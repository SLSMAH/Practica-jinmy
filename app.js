const cfg = window.EXAM_CONFIG;
const questions = window.EXAM_QUESTIONS;

const loginView = document.getElementById('loginView');
const examView = document.getElementById('examView');
const resultView = document.getElementById('resultView');
const questionsContainer = document.getElementById('questionsContainer');
const loginMessage = document.getElementById('loginMessage');
const submitMessage = document.getElementById('submitMessage');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');

let currentStudent = '';
let currentSessionCode = '';
let lastAnswers = {};
let lastScore = 0;

function hasFirebase() {
  return cfg && cfg.databaseURL && !cfg.databaseURL.includes('PEGA_AQUI');
}

function dbUrl(path) {
  return `${cfg.databaseURL.replace(/\/$/, '')}/${path}.json`;
}

async function dbGet(path) {
  const res = await fetch(dbUrl(path));
  if (!res.ok) throw new Error('No se pudo conectar con la base de datos.');
  return res.json();
}

async function dbPut(path, data) {
  const res = await fetch(dbUrl(path), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('No se pudo guardar la información.');
  return res.json();
}

function showMessage(el, text, type = 'info') {
  el.innerHTML = `<div class="notice notice-${type}">${text}</div>`;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function renderQuestions() {
  questionsContainer.innerHTML = questions.map((q, idx) => {
    if (q.type === 'mcq') {
      return `
        <article class="card question" data-question="${q.id}">
          <div class="q-number">Pregunta ${idx + 1} · opción múltiple</div>
          <h3>${escapeHtml(q.question)}</h3>
          <div class="options">
            ${q.options.map((opt, i) => `
              <label class="option">
                <input type="radio" name="q${q.id}" value="${i}" />
                <span>${escapeHtml(opt)}</span>
              </label>
            `).join('')}
          </div>
        </article>`;
    }

    return `
      <article class="card question" data-question="${q.id}">
        <div class="q-number">Pregunta ${idx + 1} · respuesta abierta</div>
        <h3>${escapeHtml(q.question)}</h3>
        <textarea id="q${q.id}" maxlength="350" placeholder="${escapeHtml(q.placeholder || 'Escribe tu respuesta...')}"></textarea>
      </article>`;
  }).join('');

  document.querySelectorAll('input[type="radio"], textarea').forEach(el => {
    el.addEventListener('change', updateProgress);
    el.addEventListener('input', updateProgress);
  });
}

function collectAnswers() {
  const answers = {};
  for (const q of questions) {
    if (q.type === 'mcq') {
      const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
      answers[q.id] = selected ? Number(selected.value) : null;
    } else {
      answers[q.id] = document.getElementById(`q${q.id}`)?.value.trim() || '';
    }
  }
  return answers;
}

function updateProgress() {
  const answers = collectAnswers();
  const completed = questions.filter(q => q.type === 'mcq' ? answers[q.id] !== null : Boolean(answers[q.id])).length;
  progressText.textContent = `${completed}/25 respondidas`;
  progressBar.style.width = `${(completed / 25) * 100}%`;
}

function calculateScore(answers) {
  return questions.filter(q => q.type === 'mcq' && answers[q.id] === q.answer).length;
}

function scoreMessage(score) {
  const pct = score / 20;
  if (pct >= .9) return 'Excelente dominio de los conceptos. Revisa las abiertas y ya vas muy bien preparado.';
  if (pct >= .75) return 'Vas bien. Revisa los errores para reforzar los conceptos que todavía se confunden.';
  if (pct >= .55) return 'Tienes una buena base, pero conviene repasar variables, arrays, const y asignación.';
  return 'Úsalo como guía de estudio: revisa cada explicación y vuelve a intentarlo.';
}

async function joinSession() {
  const name = document.getElementById('studentName').value.trim();
  const code = document.getElementById('sessionCode').value.trim();

  if (!name || !code) return showMessage(loginMessage, 'Escribe tu nombre y el código de sesión.', 'error');
  if (!hasFirebase()) return showMessage(loginMessage, 'La página todavía no tiene Firebase configurado. Revisa firebase-config.js.', 'error');

  const btn = document.getElementById('joinBtn');
  btn.disabled = true;
  btn.textContent = 'Verificando...';

  try {
    const session = await dbGet(`sessions/${code}`);
    if (!session || !session.active) throw new Error('Ese código no existe o la sesión está cerrada.');
    if (session.expiresAt && Date.now() > session.expiresAt) throw new Error('La sesión ya expiró.');

    currentStudent = name;
    currentSessionCode = code;
    document.getElementById('studentBadge').textContent = `${name} · sesión ${code}`;
    renderQuestions();
    updateProgress();
    loginView.classList.add('hidden');
    examView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    showMessage(loginMessage, escapeHtml(err.message), 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar al examen';
  }
}

async function submitExam() {
  const answers = collectAnswers();
  const unanswered = questions.filter(q => q.type === 'mcq' ? answers[q.id] === null : !answers[q.id]);
  if (unanswered.length) {
    showMessage(submitMessage, `Te faltan ${unanswered.length} pregunta(s). Puedes completarlas antes de entregar.`, 'error');
    document.querySelector(`[data-question="${unanswered[0].id}"]`)?.scrollIntoView({ behavior:'smooth', block:'center' });
    return;
  }

  const score = calculateScore(answers);
  const attemptId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const payload = {
    name: currentStudent,
    score,
    totalAuto: 20,
    answers,
    submittedAt: Date.now(),
    userAgent: navigator.userAgent.slice(0, 180)
  };

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Guardando...';

  try {
    await dbPut(`results/${currentSessionCode}/${attemptId}`, payload);
    lastAnswers = answers;
    lastScore = score;
    document.getElementById('scoreValue').textContent = score;
    document.getElementById('resultName').textContent = `Resultado de ${currentStudent}`;
    document.getElementById('scoreText').textContent = scoreMessage(score);
    examView.classList.add('hidden');
    resultView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior:'smooth' });
  } catch (err) {
    showMessage(submitMessage, `No se pudo entregar: ${escapeHtml(err.message)}`, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entregar práctica';
  }
}

function showReview() {
  const panel = document.getElementById('reviewPanel');
  panel.innerHTML = `<h2>Corrección</h2><p class="muted">Las 20 preguntas cerradas se califican automáticamente. En las abiertas se muestra una respuesta de referencia.</p>` +
    questions.map(q => {
      if (q.type === 'mcq') {
        const chosen = lastAnswers[q.id];
        const ok = chosen === q.answer;
        const chosenText = chosen === null ? 'Sin responder' : q.options[chosen];
        return `<div class="review-item">
          <div class="${ok ? 'correct' : 'incorrect'}">${ok ? '✓ Correcta' : '✗ Revisar'}</div>
          <strong>${escapeHtml(q.question)}</strong>
          <div class="muted small">Tu respuesta: ${escapeHtml(chosenText)}</div>
          ${!ok ? `<div class="small">Correcta: ${escapeHtml(q.options[q.answer])}</div>` : ''}
          <div class="small muted">${escapeHtml(q.explanation)}</div>
        </div>`;
      }
      return `<div class="review-item">
        <div class="q-number">Respuesta abierta</div>
        <strong>${escapeHtml(q.question)}</strong>
        <div class="small">Tu respuesta: ${escapeHtml(lastAnswers[q.id] || 'Sin responder')}</div>
        <div class="small muted">Referencia: ${escapeHtml(q.reference)}</div>
      </div>`;
    }).join('');
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior:'smooth', block:'start' });
}

function retryExam() {
  resultView.classList.add('hidden');
  loginView.classList.remove('hidden');
  document.getElementById('sessionCode').value = currentSessionCode;
  document.getElementById('studentName').value = currentStudent;
  loginMessage.innerHTML = '';
  window.scrollTo({ top:0, behavior:'smooth' });
}

document.getElementById('joinBtn').addEventListener('click', joinSession);
document.getElementById('submitBtn').addEventListener('click', submitExam);
document.getElementById('reviewBtn').addEventListener('click', showReview);
document.getElementById('retryBtn').addEventListener('click', retryExam);

document.getElementById('sessionCode').addEventListener('keydown', e => {
  if (e.key === 'Enter') joinSession();
});
