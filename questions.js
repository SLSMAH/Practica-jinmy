window.EXAM_QUESTIONS = [
  {
    id: 1,
    type: "mcq",
    question: "¿Qué es una variable en programación?",
    options: [
      "Un espacio con nombre donde se guarda un dato que puede usarse después",
      "Una página web completa",
      "Una imagen dentro del código",
      "Un error del programa"
    ],
    answer: 0,
    explanation: "Una variable guarda un valor bajo un nombre para poder reutilizarlo o modificarlo."
  },
  {
    id: 2,
    type: "mcq",
    question: "¿Cuál palabra se recomienda en JavaScript para declarar una variable cuyo valor puede cambiar?",
    options: ["let", "const", "double", "print"],
    answer: 0,
    explanation: "let permite reasignar el valor de la variable."
  },
  {
    id: 3,
    type: "mcq",
    question: "¿Cuál palabra se usa para declarar una constante en JavaScript?",
    options: ["var", "const", "int", "string"],
    answer: 1,
    explanation: "const declara una referencia que no puede reasignarse."
  },
  {
    id: 4,
    type: "mcq",
    question: "¿Qué significa el signo = en una declaración como let edad = 16;?",
    options: ["Comparación", "Asignación", "Suma", "Negación"],
    answer: 1,
    explanation: "= asigna el valor de la derecha a la variable de la izquierda."
  },
  {
    id: 5,
    type: "mcq",
    question: "¿Cuál declaración es válida en JavaScript?",
    options: ["let edad = 16;", "edad let = 16;", "16 = edad;", "let = edad 16;"],
    answer: 0,
    explanation: "La estructura correcta es: palabra reservada + nombre + = + valor."
  },
  {
    id: 6,
    type: "mcq",
    question: "Si escribimos let puntos = 10; y luego puntos = 20;, ¿qué valor tiene puntos al final?",
    options: ["10", "20", "30", "Da error siempre"],
    answer: 1,
    explanation: "Una variable declarada con let puede cambiar su valor."
  },
  {
    id: 7,
    type: "mcq",
    question: "¿Cuál de estas declaraciones NO permite reasignar la variable?",
    options: ["let nombre = 'Ana';", "var nombre = 'Ana';", "const nombre = 'Ana';", "let nombre;"],
    answer: 2,
    explanation: "Una variable declarada con const no puede recibir después otro valor mediante reasignación."
  },
  {
    id: 8,
    type: "mcq",
    question: "¿Qué es una matriz (array) en JavaScript?",
    options: [
      "Una colección de varios valores guardados en una sola estructura",
      "Una variable que solo guarda números negativos",
      "Una condición if",
      "Una función matemática obligatoria"
    ],
    answer: 0,
    explanation: "Un array permite guardar varios elementos y acceder a ellos por posición."
  },
  {
    id: 9,
    type: "mcq",
    question: "¿Cuál es un ejemplo correcto de un array?",
    options: ["let colores = ['rojo', 'azul', 'verde'];", "let colores = rojo, azul;", "array = rojo + azul;", "let colores = {rojo; azul};"],
    answer: 0,
    explanation: "Los arrays se escriben normalmente entre corchetes [ ]."
  },
  {
    id: 10,
    type: "mcq",
    question: "En el array let frutas = ['mango', 'uva', 'pera'];, ¿qué valor está en frutas[0]?",
    options: ["uva", "pera", "mango", "0"],
    answer: 2,
    explanation: "Los índices de un array comienzan en 0."
  },
  {
    id: 11,
    type: "mcq",
    question: "¿Qué indica el índice de un array?",
    options: ["La posición de un elemento", "El color del elemento", "El tipo de navegador", "El tamaño de la pantalla"],
    answer: 0,
    explanation: "El índice representa la posición de cada elemento dentro del array."
  },
  {
    id: 12,
    type: "mcq",
    question: "¿Cuál es el resultado de let a = 5; let b = 3; let total = a + b;?",
    options: ["53", "8", "2", "15"],
    answer: 1,
    explanation: "Como a y b son números, el operador + realiza una suma: 5 + 3 = 8."
  },
  {
    id: 13,
    type: "mcq",
    question: "¿Cuál de estos nombres de variable es válido?",
    options: ["2nombre", "mi nombre", "miNombre", "let"],
    answer: 2,
    explanation: "miNombre es válido. No puede empezar con número, contener espacios ni usar una palabra reservada."
  },
  {
    id: 14,
    type: "mcq",
    question: "¿Qué tipo de dato es 'Hola' en JavaScript?",
    options: ["Number", "Boolean", "String", "Array solamente"],
    answer: 2,
    explanation: "Un texto entre comillas es un String."
  },
  {
    id: 15,
    type: "mcq",
    question: "¿Qué tipo de dato es true?",
    options: ["String", "Boolean", "Number", "Array"],
    answer: 1,
    explanation: "true y false son valores booleanos."
  },
  {
    id: 16,
    type: "mcq",
    question: "Sobre int y double, ¿cuál afirmación es correcta para JavaScript?",
    options: [
      "JavaScript obliga a escribir int o double antes de cada número",
      "JavaScript usa principalmente el tipo Number para enteros y decimales",
      "double significa texto",
      "int significa verdadero o falso"
    ],
    answer: 1,
    explanation: "En JavaScript normalmente no declaramos números con int o double; ambos se representan con Number (además existe BigInt para enteros grandes)."
  },
  {
    id: 17,
    type: "mcq",
    question: "En otros lenguajes, ¿qué describe normalmente un int?",
    options: ["Un número entero", "Un texto", "Un número decimal", "Una imagen"],
    answer: 0,
    explanation: "int suele representar números enteros, por ejemplo 7, 20 o -3."
  },
  {
    id: 18,
    type: "mcq",
    question: "En otros lenguajes, ¿qué describe normalmente un double?",
    options: ["Un carácter", "Un número con decimales de doble precisión", "Solo números positivos", "Una constante"],
    answer: 1,
    explanation: "double suele almacenar números de punto flotante con decimales."
  },
  {
    id: 19,
    type: "mcq",
    question: "¿Qué mostrará console.log(nombre); si antes escribimos let nombre = 'Luis';?",
    options: ["nombre", "Luis", "let", "undefined siempre"],
    answer: 1,
    explanation: "console.log muestra el valor almacenado en la variable."
  },
  {
    id: 20,
    type: "mcq",
    question: "¿Cuál ejemplo muestra una constante bien declarada?",
    options: ["const PI = 3.1416;", "constant PI = 3.1416;", "PI const 3.1416;", "const = PI;"],
    answer: 0,
    explanation: "La sintaxis correcta usa const, luego el nombre, = y el valor."
  },
  {
    id: 21,
    type: "open",
    question: "Identifica la variable en este código: let edad = 17;",
    placeholder: "Escribe solo el nombre de la variable...",
    reference: "La variable es: edad."
  },
  {
    id: 22,
    type: "open",
    question: "Identifica las dos variables: let nombre = 'Carlos'; let curso = '5to';",
    placeholder: "Escribe los dos nombres...",
    reference: "Las variables son: nombre y curso."
  },
  {
    id: 23,
    type: "open",
    question: "Escribe una declaración de variable llamada puntos con valor 10 y que pueda cambiar.",
    placeholder: "Ejemplo de código...",
    reference: "Una respuesta correcta es: let puntos = 10;"
  },
  {
    id: 24,
    type: "open",
    question: "Escribe un array llamado numeros que contenga 1, 2 y 3.",
    placeholder: "Ejemplo de código...",
    reference: "Una respuesta correcta es: let numeros = [1, 2, 3];"
  },
  {
    id: 25,
    type: "open",
    question: "Explica con tus palabras la diferencia entre let y const.",
    placeholder: "Escribe una explicación breve...",
    reference: "Idea clave: let permite reasignar un valor; const no permite reasignar la variable."
  }
];
