const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const btnComenzar = document.getElementById("btn-comenzar");

btnComenzar.addEventListener("click", () => {
  pantallaInicio.classList.add("oculta");

  pantallaJuego.classList.remove("oculta");
});

// Variables para controlar la vida
let vidaEnemigo = 100;
let vidaJugador = 100;

// Elementos de la pantalla
const barraVidaEnemigo = document.getElementById("vida-enemigo");
const barraVidaJugador = document.getElementById("vida-jugador");
const textoHistoria = document.getElementById("mensaje-historia");

const btnAtaque1 = document.getElementById("btn-ataque1");
const btnAtaque2 = document.getElementById("btn-ataque2");
const btnCurar = document.getElementById("btn-curar");

// Función de ataque del jugador
function ataqueJugador(daño, nombreAtaque) {
  if (vidaEnemigo <= 0 || vidaJugador <= 0) return;

  // Restamos vida al enemigo
  vidaEnemigo = Math.max(0, vidaEnemigo - daño);
  barraVidaEnemigo.style.width = vidaEnemigo + "%";
  textoHistoria.innerText = `¡Has usado ${nombreAtaque} y le has quitado ${daño} de vida!`;

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
  let dañoEnemigo = Math.floor(Math.random() * 15) + 5; // Daño entre 5 y 20
  vidaJugador = Math.max(0, vidaJugador - dañoEnemigo);
  barraVidaJugador.style.width = vidaJugador + "%";

  textoHistoria.innerText += ` El Jefe contraataca y te quita ${dañoEnemigo} de vida.`;

  if (vidaJugador === 0) {
    textoHistoria.innerText = "¡DERROTA! 💀 El Examen te ha suspendido... ¡Reinténtalo!";
  }
}

// Escuchar los clics de los botones
btnAtaque1.addEventListener("click", () => ataqueJugador(15, "Ataque Normal"));
btnAtaque2.addEventListener("click", () => ataqueJugador(30, "Semilla Dendro 🌿"));

btnCurar.addEventListener("click", () => {
  if (vidaJugador <= 0) return;
  vidaJugador = Math.min(100, vidaJugador + 25);
  barraVidaJugador.style.width = vidaJugador + "%";
  textoHistoria.innerText = "Te has tomado una Protogema. ¡Recuperas 25 de HP!";
  setTimeout(ataqueEnemigo, 1000);
});