import { utilSeparateColons } from "./utils.js"
import { organizeMovesBonus, organizeMovesEffective, organizeMovesPower, 
    parseMoveInfo, getFinalStats } from "./damage-modifiers/requiredModifiers.js"
import { statusPassiveDamage } from "./damage-modifiers/statusEffectModifiers.js"
import { setWeatherDamageMultipliers, setWeatherDefenseMultipliers } from "./damage-modifiers/weatherModifiers.js"
import { setTerrainMultipliers } from "./damage-modifiers/terrainModifiers.js"
import { setOwnFieldMultipliers, setOtherFieldMultipliers, 
    setTailwindMultiplier, setFieldPassiveDamage, isProtectActive } from "./damage-modifiers/fieldSideModifiers.js"
import { whichStatToAttack, whichStatToDefend } from "./moves.js"

function calculateFinalDamage(variationDamage, attackDamage, defendingDamage){
    let finalDamageArray = [["min", "max"], ["min", "max"], ["min", "max"], ["min", "max"]]
    
    for(let i=0; i<variationDamage.length; i++){
        for(let j=0; j<variationDamage[0].length; j++){
            if (defendingDamage[i]!==0 || attackDamage[i]!==0){
                let pureDamage = (attackDamage[i]/defendingDamage[i])+2
                finalDamageArray[i][j] = Math.floor(variationDamage[i][j]*pureDamage)
            }
            else finalDamageArray[i][j] = 0;
        }
    }
    return finalDamageArray
}

function calculateVariation(movesBonus, effectiveness){
    const variationCalculation = []
    for(let i=0; i<movesBonus.length; i++){
        const minVariation = 0.01*movesBonus[i]*effectiveness[i]*85
        const maxVariation = 0.01*movesBonus[i]*effectiveness[i]*100
        variationCalculation.push([minVariation, maxVariation])
    }
    return variationCalculation
}

function calculateAttackingValue(attackerLevel, attackerStats, movesInfoArray, attackerStatus, defenderStats){
    const attackingCalculation = []
    const frozenOrAsleep = attackerStatus==="Congelado" || attackerStatus==="Dormido"

    attackerLevel = parseInt(attackerLevel)
    for(let i=0; i<movesInfoArray.length; i++){
        if (frozenOrAsleep || movesInfoArray[i][3]==="status"){
            attackingCalculation.push(0)
        }
        if (movesInfoArray[i][5]==="foul-play"){
            attackingCalculation.push((0.2*attackerLevel+1)*defenderStats[1]*movesInfoArray[i][0])
        }
        else {
            let statToUse = whichStatToAttack(movesInfoArray, i)
            attackingCalculation.push((0.2*attackerLevel+1)*attackerStats[statToUse]*movesInfoArray[i][0])
        }
    }
    return attackingCalculation
}

function calculateDefendingValue(defenderStats, movesInfoArray){
    const defendingCalculation = []
    for(let i=0; i<movesInfoArray.length; i++){
        if (movesInfoArray[i][3]==="status"){
            defendingCalculation.push(0)
        }
        else {
            let statToUse = whichStatToDefend(movesInfoArray, i)
            defendingCalculation.push(25*defenderStats[statToUse])
        }
    }
    return defendingCalculation
}

function fieldModifiers(finalDamage, ownFieldSide, otherFieldSide, movesInfoArray){
    for(let i=0; i<finalDamage.length; i++){
        for(let j=0; j<finalDamage[0].length; j++){
            finalDamage[i][j] = finalDamage[i][j]*setOwnFieldMultipliers(ownFieldSide);
            for(let k=0;k<movesInfoArray; k++){
                finalDamage[i][j] = finalDamage[i][j]*setOtherFieldMultipliers(otherFieldSide, movesInfoArray[k][3]);
            }
        }     
    }
}

async function iterateFieldPassiveDamage(finalDamage, ownFieldSide, attackerStats, attackerTypes){
    for(let i=0; i<finalDamage.length; i++){
        for(let j=0; j<finalDamage[0].length; j++){
            let passiveDamageTotal = await setFieldPassiveDamage(ownFieldSide, attackerStats, attackerTypes)
            finalDamage[i][j] = finalDamage[i][j]+passiveDamageTotal
        }
    }
}

function iterateStatusPassiveDamage(finalDamage, defenderStats, defenderStatus){
    for(let i=0; i<finalDamage.length; i++){
        for(let j=0; j<finalDamage[0].length; j++){
            let passiveDamageTotal = statusPassiveDamage(defenderStats[0], defenderStatus)
            finalDamage[i][j] = finalDamage[i][j]+passiveDamageTotal
        }
    }
}

function damagePercentage(stats, finalDamage){
    let damagePercentage = [["min", "max"], ["min", "max"], ["min", "max"], ["min", "max"]]
    for(let i=0; i<finalDamage.length; i++){
        for(let j=0; j<finalDamage[0].length; j++){
            damagePercentage[i][j] = Math.floor((finalDamage[i][j]/stats[0])*10000)/100
        }
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

export function damageResults(allPokemonHTML, damageContext){
    const damagePanel = damageContext[0][0]
    const ownFieldSide = damageContext[1][0]
    const otherFieldSide = damageContext[1][1]

    const attackingTypes = allPokemonHTML[0].querySelector(".types")
    const attackingLevel = allPokemonHTML[0].querySelector(".level")
    const attackingFinalStats = allPokemonHTML[0].querySelector(".calculated-stats")
    const attackerStatus = allPokemonHTML[0].querySelector(".status")
    const attackingMoves = allPokemonHTML[0].querySelector(".all-moves")
    const moveNames = attackingMoves.querySelectorAll(".move-select")
    const moveData = attackingMoves.querySelectorAll(".move-info")
    const hitPerMove = attackingMoves.querySelectorAll(".times-hit")

    const defendingTypes = allPokemonHTML[1].querySelector(".types")
    const defendingFinalStats = allPokemonHTML[1].querySelector(".calculated-stats")
    const defenderStatus = allPokemonHTML[1].querySelector(".status")
    
    const activeWeather = document.querySelector(".weather")
    const activeTerrain = document.querySelector(".terrain")
    const confirmButton = document.getElementById("confirm-damage")
    confirmButton.addEventListener('click', async function() {
        try{
            if(!attackingFinalStats.rows[0].cells[0].textContent || !defendingFinalStats.rows[0].cells[0].textContent){
                throw new Error("Faltan valores")
            }
            const attackerPanel = damagePanel.children
            const attackerName = allPokemonHTML[0].querySelector(".name").value
            if (isProtectActive(otherFieldSide)){
                const nullDamage = [[0, 0], [0, 0], [0, 0], [0, 0]]
                changeDamagePanel(attackerPanel, attackerName, nullDamage, nullDamage);
                return
            }
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
            attackerStats[5] = attackerStats[5]*setTailwindMultiplier(ownFieldSide);
            // STAB
            const movesBonus = organizeMovesBonus(movesInfoArray, ownTypes);
            // Potencia
            organizeMovesPower(movesInfoArray, hitPerMove);
            // Climas
            setWeatherDamageMultipliers(activeWeather.value, movesInfoArray, defendingTypes)
            setWeatherDefenseMultipliers(activeWeather.value, defendingTypes, defendingFinalStats)
            // Campos
            setTerrainMultipliers(activeTerrain.value, movesInfoArray, attackerStatus.value, ownTypes)
            // Calculo final
            const variationDamage = calculateVariation(movesBonus, effectiveness)
            const attackDamage = calculateAttackingValue(attackingLevel.value, attackerStats, movesInfoArray, attackerStatus.value, defenderStats)
            const defendingDamage = calculateDefendingValue(defenderStats, movesInfoArray)
            const finalDamage = calculateFinalDamage(variationDamage, attackDamage, defendingDamage);
            // Modificadores de daño y daño pasivo
            fieldModifiers(finalDamage, ownFieldSide, otherFieldSide, movesInfoArray)
            iterateStatusPassiveDamage(finalDamage, defenderStats, defenderStatus);
            iterateFieldPassiveDamage(finalDamage, ownFieldSide, attackerStats, ownTypes);
            // Colocar calculo final en la página
            const finalDamagePercentage = damagePercentage(defenderStats, finalDamage);
            changeDamagePanel(attackerPanel, attackerName, finalDamage, finalDamagePercentage);
        } catch (error) {
            alert("Completa los campos antes de hacer calculo")
            console.error('Error:', error);
        }
    })
}
