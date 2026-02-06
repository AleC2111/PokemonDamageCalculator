import { natureValue, calculatePokemonStats} from "./stats.js"
import { addMoveOptions, getMoveData } from "./moves.js"

function getTypes(data, types){
    let typeContent = ""
    for(let i=0; i<data["types"].length; i++){
        typeContent = typeContent+" "+data["types"][i]["type"]["name"];
    }
    types.textContent = "Tipos:"+typeContent
}

function getAbilities(data, abilities){
    abilities.innerHTML = ''
    for(let i=0; i<data["abilities"].length; i++){
        let newAbilityElement = document.createElement("option");
        newAbilityElement.value = data["abilities"][i]["ability"]["name"];
        newAbilityElement.text = data["abilities"][i]["ability"]["name"];

        abilities.appendChild(newAbilityElement);
    }
}

function getBaseStats(data, stats){
    let statsArray = "";
    for(let i=0; i<data["stats"].length; i++){
        statsArray = statsArray+" "+data["stats"][i]["base_stat"]
    }
    stats.textContent = "Estadisticas base: "+statsArray
}

function setFinalStats(finalStatsElement, calculatedStats){
    const everyStat = finalStatsElement.rows
    const statsNames = ["HP", "ATK", "DEF", "SP.A", "SP.D", "SPEED"]
    for (let i=0;i<everyStat.length;i++){
        everyStat[i].cells[0].textContent = statsNames[i]+" "+calculatedStats[i]
    }
}

function getStatCalculation(data, level, natureElement, finalStats){
    try {
        if (level.value && (level.value <= 100 && level.value >= 1)){
            const natureMultiplier = natureValue(natureElement.value)
            let calculatedStats = calculatePokemonStats(level.value, data["stats"], natureMultiplier, finalStats)
            setFinalStats(finalStats, calculatedStats)
        }
        else{
            alert("El nivel debe tener un valor entre 1 y 100")
        }
    } catch (error){
        console.log(error)
        alert("Valores invalidos para IVs y EVs")
    }
}

export function obtainPokemon(pokemonElementsHTML) {
    const name = pokemonElementsHTML.querySelector(".name")
    const button = pokemonElementsHTML.querySelector(".confirm")
    const types = pokemonElementsHTML.querySelector(".types")
    const abilities = pokemonElementsHTML.querySelector(".abilities")
    const stats = pokemonElementsHTML.querySelector(".base-stats")
    const level = pokemonElementsHTML.querySelector(".level")
    const items = pokemonElementsHTML.querySelector(".items")
    const natureElement = pokemonElementsHTML.querySelector(".natures")
    const finalStats = pokemonElementsHTML.querySelector(".calculated-stats")
    const moves = pokemonElementsHTML.querySelector(".all-moves")

    const movesSelectors = moves.querySelectorAll(".move-select")
    const movesInfo = moves.querySelectorAll(".move-info")
    button.addEventListener('click', async function() {
        const url = 'https://pokeapi.co/api/v2/pokemon/'+name.value;
        try {
            const response = await fetch(url, {method:"GET"});
            if (!response.ok || name.value==="") {
                alert("Error: No existe ese pokemon")
                throw new Error(`Error HTTP! estado: ${response.status}`);
            }
            let data = await response.json();
            
            addMoveOptions(data, movesSelectors);
            getMoveData(movesSelectors, movesInfo); 
            getTypes(data, types);
            getAbilities(data, abilities);
            getBaseStats(data, stats);
            getStatCalculation(data, level, natureElement, finalStats);
        } catch (error) {
            console.error('Error:', error);
        }
    });
    movesSelectors.forEach(element => {
        element.addEventListener('change', async function(){
            getMoveData(movesSelectors, movesInfo); 
        });
    });
}

