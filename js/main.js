import { obtainPokemon } from "./generalInfo.js"
import { damageResults } from "./damageCalculation.js"
import { loadStartingOptions, handlePoisonEvent } from "./initialLoad.js"

const firstPokemon = document.getElementById("first-pokemon")
const secondPokemon = document.getElementById("second-pokemon")
const showDamageResults = document.getElementById("damage-results")
const damagePanel = showDamageResults.querySelectorAll(".display-results")

loadStartingOptions();
handlePoisonEvent();

obtainPokemon(firstPokemon);
obtainPokemon(secondPokemon);
damageResults(firstPokemon, secondPokemon, damagePanel[0]);
damageResults(secondPokemon, firstPokemon, damagePanel[1]);
