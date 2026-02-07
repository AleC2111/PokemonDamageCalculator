import { obtainPokemon } from "./generalInfo.js"
import { damageResults } from "./damageCalculation.js"
import { loadStartingOptions, handlePoisonEvent } from "./initialLoad.js"

const firstPokemon = document.getElementById("first-pokemon")
const secondPokemon = document.getElementById("second-pokemon")
const damagePanel = document.querySelectorAll(".display-results")
const fieldSide = document.querySelectorAll(".field-side")

loadStartingOptions();
handlePoisonEvent();

obtainPokemon(firstPokemon);
obtainPokemon(secondPokemon);
damageResults(firstPokemon, secondPokemon, damagePanel[0], fieldSide[0], fieldSide[1]);
damageResults(secondPokemon, firstPokemon, damagePanel[1], fieldSide[1], fieldSide[0]);
