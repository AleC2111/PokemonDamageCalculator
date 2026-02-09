import { utilSeparateColons, howManyStatChanges } from "./utils.js"
import { organizeMovesBonus, organizeMovesEffective, organizeMovesPower, 
    parseMoveInfo, getFinalStats } from "./damage-modifiers/requiredModifiers.js"
import { statusPassiveDamage } from "./damage-modifiers/statusEffectModifiers.js"
import { setWeatherDamageMultipliers, setWeatherDefenseMultipliers } from "./damage-modifiers/weatherModifiers.js"
import { setTerrainMultipliers } from "./damage-modifiers/terrainModifiers.js"
import { setOwnFieldMultipliers, setOtherFieldMultipliers, setTailwindMultiplier, 
    setFieldPassiveDamage, isProtectActive } from "./damage-modifiers/fieldSideModifiers.js"
import { whichStatToAttack, whichStatToDefend } from "./moves.js"
import { speedDependentMoves, lifeDependentMoves, weightDependentMoves,
    statChangeDependentPower, statusConditionDependentPower } from "./damage-modifiers/moveSpecificModifiers.js"

function calculateFinalDamage(variationDamage, AttackerData, DefenderData){
    let finalDamageArray = [["min", "max"], ["min", "max"], ["min", "max"], ["min", "max"]]
    const fixedDamageMoves = ["seismic-toss", "night-shade", "dragon-rage", "sonic-boom"]
    const attackDamage = calculateAttackingValue(AttackerData, DefenderData.stats);
    const defendingDamage = calculateDefendingValue(DefenderData.stats, AttackerData.moves);

    for(let i=0; i<variationDamage.length; i++){
        for(let j=0; j<variationDamage[0].length; j++){
            if(fixedDamageMoves.includes(AttackerData.move[i][5])){
                finalDamageArray[i][j] = fixedDamage(moveName, AttackerData.level)
            }
            else if (defendingDamage[i]!==0 && attackDamage[i]!==0){
                let pureDamage = (attackDamage[i]/defendingDamage[i])+2
                finalDamageArray[i][j] = Math.floor(variationDamage[i][j]*pureDamage)
            }
            else finalDamageArray[i][j] = 0;
        }
    }
    return finalDamageArray
}

function fixedDamage(moveName, attackerLevel){
    if(moveName==="seismic-toss" || moveName==="night-shade") return attackerLevel;
    if(moveName==="dragon-rage") return 40;
    if(moveName==="sonic-boom") return 20;
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

function calculateAttackingValue(AttackerData, defenderStats){
    const attackerLevel = AttackerData.level
    const attackerStats = AttackerData.stats
    const movesInfoArray = AttackerData.moves
    const attackerStatus = AttackerData.status
    const frozenOrAsleep = attackerStatus==="Congelado" || attackerStatus==="Dormido"
    const attackingCalculation = []

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

function fieldModifiers(finalDamage, fieldSides, movesInfoArray){
    const fixedDamageMoves = ["seismic-toss", "night-shade", "dragon-rage", "sonic-boom"]
    for(let i=0; i<finalDamage.length; i++){
        for(let j=0; j<finalDamage[0].length; j++){
            if(!fixedDamageMoves.includes(movesInfoArray[i][5])){
                finalDamage[i][j] = finalDamage[i][j]*setOwnFieldMultipliers(fieldSides[0]);
            }
            for(let k=0;k<movesInfoArray; k++){
                finalDamage[i][j] = finalDamage[i][j]*setOtherFieldMultipliers(fieldSides[1], movesInfoArray[k][3]);
            }
        }     
    }
}

async function iterateFieldPassiveDamage(finalDamage, ownFieldSide, AttackerData){
    const attackerStats = AttackerData.stats
    const attackerTypes = AttackerData.types
    
    for(let i=0; i<finalDamage.length; i++){
        for(let j=0; j<finalDamage[0].length; j++){
            let passiveDamageTotal = await setFieldPassiveDamage(ownFieldSide, attackerStats, attackerTypes)
            finalDamage[i][j] = finalDamage[i][j]+passiveDamageTotal
        }
    }
}

function iterateStatusPassiveDamage(finalDamage, DefenderData){
    const defenderStats = DefenderData.stats
    const defenderStatus = DefenderData.status

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
    const fieldSides = damageContext[1]

    const attackingTypes = allPokemonHTML[0].querySelector(".types")
    const attackingFinalStats = allPokemonHTML[0].querySelector(".calculated-stats")
    const attackerStatus = allPokemonHTML[0].querySelector(".status")
    const attackerCurrentLife = allPokemonHTML[0].querySelector(".life-slider").children[0]
    const attackerWeight = allPokemonHTML[0].querySelector(".weight")
    const attackingLevel = allPokemonHTML[0].querySelector(".level")
    const attackingMoves = allPokemonHTML[0].querySelector(".all-moves")
    const moveNames = attackingMoves.querySelectorAll(".move-select")
    const moveData = attackingMoves.querySelectorAll(".move-info")
    const hitPerMove = attackingMoves.querySelectorAll(".times-hit")

    const defendingTypes = allPokemonHTML[1].querySelector(".types")
    const defendingFinalStats = allPokemonHTML[1].querySelector(".calculated-stats")
    const defenderStatus = allPokemonHTML[1].querySelector(".status")
    const defenderCurrentLife = allPokemonHTML[1].querySelector(".life-slider").children[0]
    const defenderWeight = allPokemonHTML[1].querySelector(".weight")
    
    const activeWeather = document.querySelector(".weather")
    const activeTerrain = document.querySelector(".terrain")
    const confirmButton = document.getElementById("confirm-damage")
    confirmButton.addEventListener('click', async function() {
        try{
            // Implementar objeto con su builder
            if(!attackingFinalStats.rows[0].cells[0].textContent || !defendingFinalStats.rows[0].cells[0].textContent){
                throw new Error("Faltan valores")
            }
            const attackerPanel = damagePanel.children
            const attackerName = allPokemonHTML[0].querySelector(".name").value
            if (isProtectActive(fieldSides[1])){
                const nullDamage = [[0, 0], [0, 0], [0, 0], [0, 0]]
                changeDamagePanel(attackerPanel, attackerName, nullDamage, nullDamage);
                return
            }
            // Tipos
            const ownTypes = utilSeparateColons(attackingTypes.textContent);
            const otherTypes = utilSeparateColons(defendingTypes.textContent);
            // Movimientos
            const movesInfoArray = parseMoveInfo(moveData, moveNames);
            // Estadisticas
            const attackerStats = getFinalStats(attackingFinalStats, attackerStatus.value, setTailwindMultiplier(fieldSides[0]));
            const defenderStats = getFinalStats(defendingFinalStats, defenderStatus.value, setTailwindMultiplier(fieldSides[1]));
            const statChanges = howManyStatChanges(attackingFinalStats)

            const AttackerData = {
                level: parseInt(attackingLevel.value),
                stats: attackerStats,
                moves: movesInfoArray,
                types: ownTypes,
                status: attackerStatus.value,
                weight: parseInt(attackerWeight.textContent),
                current_life: parseInt(attackerCurrentLife.value),
                stat_changes: statChanges
            }
            const DefenderData = {
                types: otherTypes,
                stats: defenderStats,
                weight: parseInt(defenderWeight.textContent),
                status: defenderStatus.value,
                current_life: parseInt(defenderCurrentLife.value)
            }
            // Potencia Base
            organizeMovesPower(AttackerData.moves, hitPerMove);
            speedDependentMoves(AttackerData, DefenderData.stats);
            lifeDependentMoves(AttackerData, DefenderData);
            weightDependentMoves(AttackerData, DefenderData);
            statusConditionDependentPower(AttackerData, DefenderData)
            statChangeDependentPower(AttackerData)
            // Climas
            setWeatherDamageMultipliers(activeWeather.value, AttackerData.moves, DefenderData.types);
            setWeatherDefenseMultipliers(activeWeather.value, DefenderData);
            // Campos
            setTerrainMultipliers(activeTerrain.value, AttackerData);
            // Efectividad
            const effectiveness = await organizeMovesEffective(AttackerData.moves, DefenderData.types);
            // STAB
            const movesBonus = organizeMovesBonus(AttackerData);
            // Calculo final
            const variationDamage = calculateVariation(movesBonus, effectiveness);
            const finalDamage = calculateFinalDamage(variationDamage, AttackerData, DefenderData);
            // Modificadores de daño y daño pasivo
            fieldModifiers(finalDamage, fieldSides, AttackerData.moves);
            iterateStatusPassiveDamage(finalDamage, DefenderData);
            iterateFieldPassiveDamage(finalDamage, fieldSides[0], AttackerData);
            // Colocar calculo final en la página
            const finalDamagePercentage = damagePercentage(DefenderData.stats, finalDamage);
            changeDamagePanel(attackerPanel, attackerName, finalDamage, finalDamagePercentage);
        } catch (error) {
            alert("Completa los campos antes de hacer calculo")
            console.error('Error:', error);
        }
    })
}
