import { utilSeparateColons } from "./utils.js"
import { organizeMovesBonus, organizeMovesEffective, organizeMovesPower, 
    parseMoveInfo, getFinalStats } from "./damage-modifiers/requiredModifiers.js"
import { setWeatherDamageMultipliers, setWeatherDefenseMultipliers } from "./damage-modifiers/weatherModifiers.js"
import { setTerrainMultipliers } from "./damage-modifiers/terrainModifiers.js"

function calculateFinalDamage(attackerStats, defenderStats, attackerLevel, effectiveness, 
    movesBonus, movesInfoArray, attackerStatus, defenderStatus){

    let finalDamageArray = [["min", "max"], ["min", "max"], ["min", "max"], ["min", "max"]]
    attackerLevel = parseInt(attackerLevel)
    const frozenOrAsleep = attackerStatus==="Congelado" || attackerStatus==="Dormido"

    for(let i=0; i<movesInfoArray.length; i++){
        if (frozenOrAsleep){
            finalDamageArray[i][0] = 0
            finalDamageArray[i][1] = 0
            continue
        }
        let minVariation = 0.01*movesBonus[i]*effectiveness[i]*85
        let maxVariation = 0.01*movesBonus[i]*effectiveness[i]*100
        if (movesInfoArray[i][3]==="physical"){
            let attack = (0.2*attackerLevel+1)*attackerStats[1]*movesInfoArray[i][0]
            let defense = 25*defenderStats[2]

            finalDamageArray[i][0] = Math.floor(minVariation*((attack/defense)+2))
            finalDamageArray[i][1] = Math.floor(maxVariation*((attack/defense)+2))
        }
        else if (movesInfoArray[i][3]==="special"){
            let specialAttack = (0.2*attackerLevel+1)*attackerStats[3]*movesInfoArray[i][0]
            let specialDefense = 25*defenderStats[4]

            finalDamageArray[i][0] = Math.floor(minVariation*((specialAttack/specialDefense)+2))
            finalDamageArray[i][1] = Math.floor(maxVariation*((specialAttack/specialDefense)+2))
        }
        else{
            finalDamageArray[i][0] = 0
            finalDamageArray[i][1] = 0
        }
    }
    return finalDamageArray
}

function damagePercentage(stats, finalDamage){
    let damagePercentage = [["min", "max"], ["min", "max"], ["min", "max"], ["min", "max"]]
    for(let i=0; i<finalDamage.length; i++){
        damagePercentage[i][0] = Math.floor((finalDamage[i][0]/stats[0])*10000)/100
        damagePercentage[i][1] = Math.floor((finalDamage[i][1]/stats[0])*10000)/100
    }
    return damagePercentage
}

function changeDamagePanel(panel, pokemonName, finalDamage, finalDamagePercentage){
    panel[0].textContent = "Nombre: "+pokemonName
    for(let i=0; i<finalDamage.length; i++){
        let damageText = finalDamage[i][0]+" - "+finalDamage[i][1]
        let damagePercentageText = finalDamagePercentage[i][0]+"% - "+finalDamagePercentage[i][1]+"%"
        panel[i+1].textContent = "Resultado: "+damageText+" / "+damagePercentageText
    }
}

export function damageResults(attackingPokemonHTML, defendingPokemonHTML, damagePanel){
    const attackingTypes = attackingPokemonHTML.querySelector(".types")
    const attackingLevel = attackingPokemonHTML.querySelector(".level")
    const attackingFinalStats = attackingPokemonHTML.querySelector(".calculated-stats")
    const attackerStatus = attackingPokemonHTML.querySelector(".status")
    const attackingMoves = attackingPokemonHTML.querySelector(".all-moves")
    const moveNames = attackingMoves.querySelectorAll(".move-select")
    const moveData = attackingMoves.querySelectorAll(".move-info")
    const hitPerMove = attackingMoves.querySelectorAll(".times-hit")

    const defendingTypes = defendingPokemonHTML.querySelector(".types")
    const defendingFinalStats = defendingPokemonHTML.querySelector(".calculated-stats")
    const defenderStatus = defendingPokemonHTML.querySelector(".status")
    
    const activeWeather = document.querySelector(".weather")
    const activeTerrain = document.querySelector(".terrain")
    const confirmButton = document.getElementById("confirm-damage")
    confirmButton.addEventListener('click', async function() {
        try{
            const attackerPanel = damagePanel.children
            const attackerName = attackingPokemonHTML.querySelector(".name").value
            // Tipos
            const ownTypes = utilSeparateColons(attackingTypes.textContent);
            const otherTypes = utilSeparateColons(defendingTypes.textContent);
            // Movimientos
            const movesInfoArray = parseMoveInfo(moveData, moveNames);
            // Efectividad
            const effectiveness = await organizeMovesEffective(movesInfoArray, otherTypes);
            // Estadisticas
            const attackerStats = getFinalStats(attackingFinalStats, attackerStatus.value);
            const defenderStats = getFinalStats(defendingFinalStats, defenderStatus.value);
            // STAB
            const movesBonus = organizeMovesBonus(movesInfoArray, ownTypes);
            // Potencia
            organizeMovesPower(movesInfoArray, hitPerMove);
            // Climas
            setWeatherDamageMultipliers(activeWeather.value, movesInfoArray, defendingTypes)
            setWeatherDefenseMultipliers(activeWeather.value, defendingTypes, defendingFinalStats)
            // Campos
            setTerrainMultipliers(activeTerrain.value, movesInfoArray, attackerStatus.value)
            // Calculo final
            const finalDamage = calculateFinalDamage(attackerStats, 
                                                    defenderStats, 
                                                    attackingLevel.value,
                                                    effectiveness, 
                                                    movesBonus, 
                                                    movesInfoArray,
                                                    attackerStatus.value,
                                                    defenderStatus.value
                                                );
            // Calculo en porcentajes
            const finalDamagePercentage = damagePercentage(defenderStats, finalDamage);
            // Colocar calculo en el HTML
            changeDamagePanel(attackerPanel, attackerName, finalDamage, finalDamagePercentage);
        } catch (error) {
            console.error('Error:', error);
        }
    })
}
