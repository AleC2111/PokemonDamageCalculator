import { obtainPokemon } from "./generalInfo.js"
import { damageResults } from "./damageCalculation.js"
import { loadStartingOptions, handlePoisonEvent } from "./initialLoad.js"
import { inverseArguments } from "./utils.js"

const firstPokemon = document.getElementById("first-pokemon")
const secondPokemon = document.getElementById("second-pokemon")
const damagePanel = document.querySelectorAll(".display-results")
const fieldSide = document.querySelectorAll(".field-side")
const allPokemon = [firstPokemon, secondPokemon]
const damageContext = [damagePanel, fieldSide]

loadStartingOptions();
handlePoisonEvent();

for(let i=0; i<allPokemon.length; i++){
    obtainPokemon(allPokemon[i])
}
damageResults(allPokemon, damageContext)
const {inversedPokemon, inversedContext} = inverseArguments(allPokemon, damageContext)
damageResults(inversedPokemon, inversedContext)