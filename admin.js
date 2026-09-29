const cfg = window.EXAM_CONFIG;
const questions = window.EXAM_QUESTIONS;
let activeCode = null;
let cachedResults = [];

function hasFirebase() {
  return cfg && cfg.databaseURL && !cfg.databaseURL.includes('PEGA_AQUI');
}
function dbUrl(path) { return `${cfg.databaseURL.replace(/\/$/, '')}/${path}.json`; }
async function dbGet(path) {
  const res = await fetch(dbUrl(path));
  if (!res.ok) throw new Error('No se pudo conectar con Firebase.');
  return res.json();
}
async function dbPut(path, data) {
  const res = await fetch(dbUrl(path), { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  if (!res.ok) throw new Error('No se pudo guardar la información.');
  return res.json();
}
async function dbPatch(path, data) {
  const res = await fetch(dbUrl(path), { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  if (!res.ok) throw new Error('No se pudo actualizar la información.');
  return res.json();
}
function esc(value='') { return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
function msg(text, type='info') { document.getElementById('adminMessage').innerHTML = `<div class="notice notice-${type}">${text}</div>`; }

function generateCode() { return String(Math.floor(100000 + Math.random() * 900000)); }

async function loadCurrentSession() {
  const pointer = await dbGet('currentSession');
  activeCode = pointer?.code || null;
  await renderSession();
}

async function renderSession() {
  const state = document.getElementById('sessionState');
  const codeEl = document.getElementById('sessionCodeDisplay');
  if (!activeCode) {
    state.textContent = 'No hay sesión activa';
    codeEl.textContent = '------';
    cachedResults = [];
    renderResults();
    return;
  }
  const session = await dbGet(`sessions/${activeCode}`);
  if (!session || !session.active || (session.expiresAt && Date.now() > session.expiresAt)) {
    state.textContent = 'La última sesión está cerrada o expirada';
    codeEl.textContent = activeCode || '------';
  } else {
    state.textContent = 'Sesión abierta';
    codeEl.textContent = activeCode;
  }
  await loadResults();
}

async function createSession() {
  if (!hasFirebase()) return msg('Primero configura la databaseURL en firebase-config.js.', 'error');
  const btn = document.getElementById('createSessionBtn');
  btn.disabled = true;
  try {
    if (activeCode) {
      const old = await dbGet(`sessions/${activeCode}`);
      if (old?.active) await dbPatch(`sessions/${activeCode}`, { active:false, closedAt:Date.now() });
    }
    const code = generateCode();
    const now = Date.now();
    await dbPut(`sessions/${code}`, {
      code,
      title: cfg.examTitle,
      active: true,
      createdAt: now,
      expiresAt: now + ((cfg.sessionDurationMinutes || 180) * 60 * 1000)
    });
    await dbPut('currentSession', { code, updatedAt:now });
    activeCode = code;
    msg(`Sesión creada. Comparte el código <strong>${code}</strong> con tus compañeros.`, 'success');
    await renderSession();
  } catch (e) {
    msg(esc(e.message), 'error');
  } finally { btn.disabled = false; }
}

async function closeSession() {
  if (!activeCode) return msg('No hay una sesión para cerrar.', 'error');
  try {
    await dbPatch(`sessions/${activeCode}`, { active:false, closedAt:Date.now() });
    msg(`La sesión ${activeCode} fue cerrada.`, 'success');
    await renderSession();
  } catch (e) { msg(esc(e.message), 'error'); }
}

async function loadResults() {
  if (!activeCode) return;
  try {
    const raw = await dbGet(`results/${activeCode}`) || {};
    cachedResults = Object.entries(raw).map(([id, value]) => ({ id, ...value })).sort((a,b) => b.submittedAt - a.submittedAt);
    renderResults();
  } catch (e) { msg(esc(e.message), 'error'); }
}

function openAnswerSummary(result) {
  return questions.filter(q => q.type === 'open').map(q => {
    const v = result.answers?.[q.id] || '—';
    return `P${q.id}: ${v}`;
  }).join(' | ');
}

function renderResults() {
  const body = document.getElementById('resultsBody');
  const count = cachedResults.length;
  const scores = cachedResults.map(r => Number(r.score || 0));
  const avg = count ? (scores.reduce((a,b)=>a+b,0)/count).toFixed(1) : '0.0';
  const best = count ? Math.max(...scores) : 0;
  document.getElementById('attemptCount').textContent = count;
  document.getElementById('avgScore').textContent = `${avg}/20`;
  document.getElementById('bestScore').textContent = `${best}/20`;

  if (!count) {
    body.innerHTML = '<tr><td colspan="4" class="muted">Aún no hay resultados.</td></tr>';
    return;
  }
  body.innerHTML = cachedResults.map(r => `
    <tr>
      <td><strong>${esc(r.name || 'Sin nombre')}</strong></td>
      <td>${Number(r.score || 0)}/20</td>
      <td>${r.submittedAt ? new Date(r.submittedAt).toLocaleString('es-DO') : '—'}</td>
      <td class="small">${esc(openAnswerSummary(r))}</td>
    </tr>`).join('');
}

function csvEscape(v) { return `"${String(v ?? '').replaceAll('"','""')}"`; }
function exportCsv() {
  if (!cachedResults.length) return msg('No hay resultados para exportar.', 'error');
  const openQs = questions.filter(q => q.type === 'open');
  const rows = [
    ['Nombre', 'Puntuación', 'Fecha', ...openQs.map(q => `P${q.id}`)],
    ...cachedResults.map(r => [
      r.name,
      `${r.score}/20`,
      new Date(r.submittedAt).toLocaleString('es-DO'),
      ...openQs.map(q => r.answers?.[q.id] || '')
    ])
  ];
  const csv = rows.map(row => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob(["\uFEFF" + csv], { type:'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resultados-${activeCode || 'sesion'}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function unlock() {
  const pin = document.getElementById('adminPin').value;
  const pinMessage = document.getElementById('pinMessage');
  if (pin !== String(cfg.adminPin)) {
    pinMessage.innerHTML = '<div class="notice notice-error">PIN incorrecto.</div>';
    return;
  }
  if (!hasFirebase()) {
    pinMessage.innerHTML = '<div class="notice notice-error">Configura primero Firebase en firebase-config.js.</div>';
    return;
  }
  document.getElementById('pinView').classList.add('hidden');
  document.getElementById('adminView').classList.remove('hidden');
  try { await loadCurrentSession(); } catch (e) { msg(esc(e.message), 'error'); }
}

document.getElementById('unlockBtn').addEventListener('click', unlock);
document.getElementById('createSessionBtn').addEventListener('click', createSession);
document.getElementById('closeSessionBtn').addEventListener('click', closeSession);
document.getElementById('refreshBtn').addEventListener('click', loadResults);
document.getElementById('exportBtn').addEventListener('click', exportCsv);
document.getElementById('adminPin').addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });
