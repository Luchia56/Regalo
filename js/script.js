// --- ELEMENTOS DE LAS PANTALLAS ---
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaSeleccion = document.getElementById("pantalla-seleccion");
const pantallaJuego = document.getElementById("pantalla-juego");

const btnComenzar = document.getElementById("btn-comenzar");
const tarjetasPersonajes = document.querySelectorAll(".tarjeta-pj.seleccionable");

// Elementos del combate
const barraVidaEnemigo = document.getElementById("vida-enemigo");
const barraVidaJugador = document.getElementById("vida-jugador");
const textoHistoria = document.getElementById("mensaje-historia");

const btnAtaque1 = document.getElementById("btn-ataque1");
const btnAtaque2 = document.getElementById("btn-ataque2");
const btnCurar = document.getElementById("btn-curar");

// --- VARIABLES DE ESTADO ---
let vidaEnemigo = 100;
let vidaJugador = 100;

// Objeto para guardar la heroína seleccionada
let personajeJugador = {
  nombre: "Nahida",
  img: "img/nahida.png",
  vidaMax: 100
};

// --- FLUJO DE PANTALLAS Y SELECCIÓN ---

// 1. Al hacer clic en "EMPEZAR AVENTURA", vamos a la selección
btnComenzar.addEventListener("click", () => {
  pantallaInicio.classList.add("oculta");
  pantallaSeleccion.classList.remove("oculta");
});

// 2. Al hacer clic en una tarjeta de personaje:
tarjetasPersonajes.forEach(tarjeta => {
  tarjeta.addEventListener("click", () => {
    // Leemos los datos configurados en la tarjeta HTML
    personajeJugador.nombre = tarjeta.getAttribute("data-nombre");
    personajeJugador.img = tarjeta.getAttribute("data-img");
    personajeJugador.vidaMax = parseInt(tarjeta.getAttribute("data-vida"));

    // Transición de Selección a Juego
    pantallaSeleccion.classList.add("oculta");
    pantallaJuego.classList.remove("oculta");

    // Iniciar el personaje en el combate
    prepararJugadorEnCombate();
  });
});

// Función para cargar los datos de la heroína en el escenario
function prepararJugadorEnCombate() {
  const nombreHTML = document.getElementById("nombre-jugador");
  const imgHTML = document.getElementById("img-jugador");

  if (nombreHTML) nombreHTML.innerText = personajeJugador.nombre;
  if (imgHTML) imgHTML.src = personajeJugador.img;

  // Ajustar la vida con el máximo de la heroína elegida
  vidaJugador = personajeJugador.vidaMax;
  barraVidaJugador.style.width = "100%";
  textoHistoria.innerText = `¡${personajeJugador.nombre} ha entrado al combate! ¿Qué vas a hacer?`;
}

// --- LÓGICA DE COMBATE ---

// Función de ataque del jugador
function ataqueJugador(daño, nombreAtaque) {
  if (vidaEnemigo <= 0 || vidaJugador <= 0) return;

  // Restamos vida al enemigo
  vidaEnemigo = Math.max(0, vidaEnemigo - daño);
  barraVidaEnemigo.style.width = vidaEnemigo + "%";
  textoHistoria.innerText = `¡${personajeJugador.nombre} ha usado ${nombreAtaque} y le ha quitado ${daño} de vida!`;

  // Comprobar si hemos ganado
  if (vidaEnemigo === 0) {
    textoHistoria.innerText = "¡VICTORIA! 🎉 Has derrotado al Jefe.";
    return;
  }
  
  // Turno del enemigo (responde 1 segundo después)
  setTimeout(ataqueEnemigo, 1000);
}

// Función de respuesta del enemigo
function ataqueEnemigo() {
  if (vidaEnemigo <= 0 || vidaJugador <= 0) return;

  let dañoEnemigo = Math.floor(Math.random() * 15) + 5; // Daño entre 5 y 20
  vidaJugador = Math.max(0, vidaJugador - dañoEnemigo);
  
  // Calcular porcentaje exacto según la vida máxima de la heroína
  let porcentajeVida = (vidaJugador / personajeJugador.vidaMax) * 100;
  barraVidaJugador.style.width = porcentajeVida + "%";

  textoHistoria.innerText += ` El Jefe contraataca y te quita ${dañoEnemigo} de vida.`;

  if (vidaJugador === 0) {
    textoHistoria.innerText = "¡DERROTA! 💀 El Examen te ha suspendido... ¡Reinténtalo!";
  }
}

// Escuchar los clics de los botones de ataque
btnAtaque1.addEventListener("click", () => ataqueJugador(15, "Ataque Normal"));
btnAtaque2.addEventListener("click", () => ataqueJugador(30, "Habilidad Elemental 🌿"));

btnCurar.addEventListener("click", () => {
  if (vidaJugador <= 0 || vidaEnemigo <= 0) return;
  
  let curacion = 25;
  vidaJugador = Math.min(personajeJugador.vidaMax, vidaJugador + curacion);
  
  let porcentajeVida = (vidaJugador / personajeJugador.vidaMax) * 100;
  barraVidaJugador.style.width = porcentajeVida + "%";
  
  textoHistoria.innerText = `Te has tomado una Protogema. ¡${personajeJugador.nombre} recupera ${curacion} de HP!`;
  setTimeout(ataqueEnemigo, 1000);
});