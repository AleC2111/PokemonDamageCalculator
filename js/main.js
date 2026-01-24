import { addNatureNames, addStatusNames } from "./stats.js"
import { obtainPokemon } from "./generalInfo.js"
import { damageResults } from "./damageCalculation.js"

const firstPokemon = document.getElementById("first-pokemon")
const secondPokemon = document.getElementById("second-pokemon")
const showDamageResults = document.getElementById("damage-results")
const naturesFirst = firstPokemon.querySelector(".natures")
const naturesSecond = secondPokemon.querySelector(".natures")
const statusFirst = firstPokemon.querySelector(".status")
const statusSecond = secondPokemon.querySelector(".status")
const damagePanel = showDamageResults.querySelectorAll(".display-results")

addNatureNames(naturesFirst);
addNatureNames(naturesSecond);
addStatusNames(statusFirst);
addStatusNames(statusSecond);
obtainPokemon(firstPokemon);
obtainPokemon(secondPokemon);
damageResults(firstPokemon, secondPokemon, damagePanel[0]);
damageResults(secondPokemon, firstPokemon, damagePanel[1]);

// Usar Web Components para dividir el html en componentes

// Organizar damageCalculation.js
/*
    (damage-modifiers)
    Gravemente Envenenado
    Objetos
    Habilidades
    Climas y campos
    Trampas del campo y barreras
    Teracristalizacion
*/
// Casos especiales de movimientos (Otra stat en calculo, Peso, Vida, Estatus, Amistad, etc)
// Tomar genero y formas alternativas (Aegislash)
// Base de datos para las megas

// Validaciones para precondicion y postcondicion de todo
// Validaciones deben pasar a un archivo validations.js