//ELEMENTOS DE LAS PANTALLAS
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaHistoria = document.getElementById("pantalla-historia");
const pantallaSeleccion = document.getElementById("pantalla-seleccion");
const pantallaJuego = document.getElementById("pantalla-juego");
const pantallaVictoria = document.getElementById("pantalla-victoria");

const btnComenzar = document.getElementById("btn-comenzar");
const btnContinuarHistoria = document.getElementById("btn-continuar-historia");
const btnReiniciar = document.getElementById("btn-reiniciar");
const tarjetasPersonajes = document.querySelectorAll(".tarjeta-pj.seleccionable");

//Elementos del combate
const barraVidaEnemigo = document.getElementById("vida-enemigo");
const barraVidaJugador = document.getElementById("vida-jugador");
const textoHistoria = document.getElementById("mensaje-historia");
const nombreEnemigoDOM = document.getElementById("nombre-enemigo");
const imgEnemigoDOM = document.getElementById("img-enemigo");

const btnAtaque1 = document.getElementById("btn-ataque1");
const btnAtaque2 = document.getElementById("btn-ataque2");
const btnCurar = document.getElementById("btn-curar");

//CONFIGURACIÓN DE LOS JEFES
let rondaActual = 1;
const datosJefes = {
  1: { nombre: "Jean (Caballero de Favonius)", vida: 100, dañoBase: 12, img: "img/Jean.png" },
  2: { nombre: "Venti (¡Arconte Anemo!)", vida: 180, dañoBase: 22, img: "img/Venti.png" }
};

let vidaEnemigo = 100;
let vidaJugador = 100;

//Objeto del personaje seleccionado
let personajeJugador = {
  nombre: "Nahida",
  img: "img/nahida.png",
  vidaMax: 100
};

//FLUJO DE PANTALLAS

// 1. De Inicio a Historia
if (btnComenzar) {
  btnComenzar.addEventListener("click", () => {
    pantallaInicio.classList.add("oculta");
    pantallaHistoria.classList.remove("oculta");
  });
}

// 2. De Historia a Selección de Personaje
if (btnContinuarHistoria) {
  btnContinuarHistoria.addEventListener("click", () => {
    pantallaHistoria.classList.add("oculta");
    pantallaSeleccion.classList.remove("oculta");
  });
}

// 3. De Selección a Combate
tarjetasPersonajes.forEach(tarjeta => {
  tarjeta.addEventListener("click", () => {
    personajeJugador.nombre = tarjeta.getAttribute("data-nombre");
    personajeJugador.img = tarjeta.getAttribute("data-img");
    personajeJugador.vidaMax = parseInt(tarjeta.getAttribute("data-vida"));

    pantallaSeleccion.classList.add("oculta");
    pantallaJuego.classList.remove("oculta");

    prepararJugadorEnCombate();
    rondaActual = 1;
    iniciarRonda();
  });
});

// Reiniciar juego desde la pantalla de victoria
if (btnReiniciar) {
  btnReiniciar.addEventListener("click", () => {
    pantallaVictoria.classList.add("oculta");
    pantallaSeleccion.classList.remove("oculta");
  });
}

//FUNCIONES DE COMBATE
function prepararJugadorEnCombate() {
  const nombreHTML = document.getElementById("nombre-jugador");
  const imgHTML = document.getElementById("img-jugador");

  if (nombreHTML) nombreHTML.innerText = personajeJugador.nombre;
  if (imgHTML) imgHTML.src = personajeJugador.img;

  vidaJugador = personajeJugador.vidaMax;
  barraVidaJugador.style.width = "100%";
}

function iniciarRonda() {
  const jefe = datosJefes[rondaActual];
  vidaEnemigo = jefe.vida;

  if (nombreEnemigoDOM) nombreEnemigoDOM.innerText = jefe.nombre;
  if (imgEnemigoDOM) imgEnemigoDOM.src = jefe.img;

  barraVidaEnemigo.style.width = "100%";

  if (rondaActual === 1) {
    textoHistoria.innerText = `¡${personajeJugador.nombre} inicia la prueba contra Jean!`;
  } else {
    textoHistoria.innerText = `¡Cuidado! Jean se retira y el Arconte Venti entra al combate con un poder enorme...`;
  }
}

//LÓGICA DE COMBATE
function ataqueJugador(daño, nombreAtaque) {
  if (vidaEnemigo <= 0 || vidaJugador <= 0) return;

  const jefe = datosJefes[rondaActual];
  vidaEnemigo = Math.max(0, vidaEnemigo - daño);
  
  let porcentajeEnemigo = (vidaEnemigo / jefe.vida) * 100;
  barraVidaEnemigo.style.width = porcentajeEnemigo + "%";
  
  textoHistoria.innerText = `¡${personajeJugador.nombre} usó ${nombreAtaque} e hizo ${daño} de daño!`;

  if (vidaEnemigo === 0) {
    if (rondaActual === 1) {
      rondaActual = 2;
      textoHistoria.innerText = "¡Has vencido a Jean! Pero el viento empieza a soplar con fuerza... ¡Aparece Venti!";
      setTimeout(iniciarRonda, 2000);
    } else {
      textoHistoria.innerText = "¡VICTORIA ABSOLUTA! 🎉 Has derrotado al Arconte Venti.";
      setTimeout(() => {
        pantallaJuego.classList.add("oculta");
        pantallaVictoria.classList.remove("oculta");
      }, 1500);
    }
    return;
  }

  setTimeout(ataqueEnemigo, 1000);
}

function ataqueEnemigo() {
  if (vidaEnemigo <= 0 || vidaJugador <= 0) return;

  const jefe = datosJefes[rondaActual];
  let dañoEnemigo = Math.floor(Math.random() * 10) + jefe.dañoBase;
  
  vidaJugador = Math.max(0, vidaJugador - dañoEnemigo);
  let porcentajeVida = (vidaJugador / personajeJugador.vidaMax) * 100;
  barraVidaJugador.style.width = porcentajeVida + "%";

  textoHistoria.innerText += ` ${jefe.nombre} ataca y te quita ${dañoEnemigo} de vida.`;

  if (vidaJugador === 0) {
    textoHistoria.innerText = "¡DERROTA! 💀 No has superado la prueba. ¡Reinténtalo!";
  }
}

// Botones de Acción
if (btnAtaque1) btnAtaque1.addEventListener("click", () => ataqueJugador(15, "Ataque Normal"));
if (btnAtaque2) btnAtaque2.addEventListener("click", () => ataqueJugador(30, "Habilidad Elemental 🌿"));

if (btnCurar) {
  btnCurar.addEventListener("click", () => {
    if (vidaJugador <= 0 || vidaEnemigo <= 0) return;

    let curacion = 25;
    vidaJugador = Math.min(personajeJugador.vidaMax, vidaJugador + curacion);

    let porcentajeVida = (vidaJugador / personajeJugador.vidaMax) * 100;
    barraVidaJugador.style.width = porcentajeVida + "%";

    textoHistoria.innerText = `Te has tomado una Protogema. ¡${personajeJugador.nombre} recupera ${curacion} de HP!`;
    setTimeout(ataqueEnemigo, 1000);
  });
}