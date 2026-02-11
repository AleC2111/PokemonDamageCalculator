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

function calculateFinalDamage(variationDamage, AttackerData, DefenderData, criticalHits){
    const fixedDamageMoves = ["seismic-toss", "night-shade", "dragon-rage", "sonic-boom", "super-fang"]
    const attackDamage = calculateAttackingValue(AttackerData, DefenderData.stats);
    const defendingDamage = calculateDefendingValue(DefenderData.stats, AttackerData.moves);
    const hasFocusSash = DefenderData.item==="focus-sash"
    const hasMaxLife = DefenderData.current_life===DefenderData.stats[0]

    const finalDamageArray = variationDamage.map((variationArray, index) => {
        if(fixedDamageMoves.includes(AttackerData.moves[index][5])){
            let fixedDamageResult = fixedDamage(AttackerData.moves[index][5], AttackerData.level, AttackerData.current_life)
            return [fixedDamageResult, fixedDamageResult]
        }
        else if (defendingDamage[index]!==0 && attackDamage[index]!==0){
            let pureDamage = (attackDamage[index]/defendingDamage[index])+2
            return variationArray.map(variationItem => {
                let calculateDamage = Math.floor(variationItem*pureDamage)
                let finalCalculation = criticalHits[index].checked ? calculateDamage*1.5: calculateDamage;
                return (hasFocusSash && hasMaxLife) ? Math.min(DefenderData.current_life-1, finalCalculation): finalCalculation;
            })
        }
        else return [0, 0];
    })

    return finalDamageArray
}

function fixedDamage(moveName, attackerLevel, attackerCurrentLife){
    if(moveName==="super-fang") return attackerCurrentLife/2;
    if(moveName==="seismic-toss" || moveName==="night-shade") return attackerLevel;
    if(moveName==="dragon-rage") return 40;
    if(moveName==="sonic-boom") return 20;
}

async function calculateVariation(movesBonus, effectiveness){
    const variationCalculation =  Promise.all(movesBonus.map(async (bonus, index) => {
        let effective = await effectiveness[index]
        return [0.01*bonus*effective*85, 0.01*bonus*effective*100]
    }))
    return variationCalculation
}

function calculateAttackingValue(AttackerData, defenderStats){
    const attackerLevel = AttackerData.level
    const attackerStats = AttackerData.stats
    const movesInfoArray = AttackerData.moves
    const attackerStatus = AttackerData.status
    const frozenOrAsleep = attackerStatus==="Congelado" || attackerStatus==="Dormido"
    const levelModifier = 0.2*attackerLevel+1
    const attackingCalculation = movesInfoArray.map(move => {
        if (frozenOrAsleep || move[3]==="status") return 0;
        else if (move[5]==="foul-play") return levelModifier*defenderStats[1]*move[0];
        else {
            let statToUse = whichStatToAttack(move)
            if(move[5]==="facade" && attackerStatus==="Quemado") return levelModifier*(attackerStats[statToUse]*2)*move[0];
            else return levelModifier*attackerStats[statToUse]*move[0];
        }
    })

    return attackingCalculation
}

function calculateDefendingValue(defenderStats, movesInfoArray){
    const defendingCalculation = movesInfoArray.map(move => {
        if (move[3]==="status") return 0;
        else return 25*defenderStats[whichStatToDefend(move)];
    })

    return defendingCalculation
}

function fieldModifiers(finalDamage, fieldSides, movesInfoArray, criticalHits){
    const fixedDamageMoves = ["seismic-toss", "night-shade", "dragon-rage", "sonic-boom", "super-fang"]
    for(let i=0; i<finalDamage.length; i++){
        for(let j=0; j<finalDamage[0].length; j++){
            if(!fixedDamageMoves.includes(movesInfoArray[i][5])){
                finalDamage[i][j] *= setOwnFieldMultipliers(fieldSides[0]);
            }
            for(let k=0;k<movesInfoArray; k++){
                if(!criticalHits[i].checked){
                    finalDamage[i][j] *= setOtherFieldMultipliers(fieldSides[1], movesInfoArray[k][3]);
                }
            }
        }     
    }
}

async function iterateFieldPassiveDamage(finalDamage, ownFieldSide, AttackerData){
    for(let i=0; i<finalDamage.length; i++){
        for(let j=0; j<finalDamage[0].length; j++){
            let passiveDamageTotal = await setFieldPassiveDamage(ownFieldSide, AttackerData)
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
    const damagePercentage = finalDamage.map(damageArray => 
        damageArray.map(variation => Math.floor((variation/stats[0])*10000)/100)
    )

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
    const attackerItem = allPokemonHTML[0].querySelector(".items")
    const attackingLevel = allPokemonHTML[0].querySelector(".level")
    const attackingMoves = allPokemonHTML[0].querySelector(".all-moves")
    const moveNames = attackingMoves.querySelectorAll(".move-select")
    const moveData = attackingMoves.querySelectorAll(".move-info")
    const hitPerMove = attackingMoves.querySelectorAll(".times-hit")
    const criticalHits = attackingMoves.querySelectorAll(".crit")

    const defendingTypes = allPokemonHTML[1].querySelector(".types")
    const defendingFinalStats = allPokemonHTML[1].querySelector(".calculated-stats")
    const defenderStatus = allPokemonHTML[1].querySelector(".status")
    const defenderCurrentLife = allPokemonHTML[1].querySelector(".life-slider").children[0]
    const defenderWeight = allPokemonHTML[1].querySelector(".weight")
    const defenderItem = allPokemonHTML[1].querySelector(".items")
    
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
            const defenderName = allPokemonHTML[1].querySelector(".name").value
            if (isProtectActive(fieldSides[1])){
                const nullDamage = [[0, 0], [0, 0], [0, 0], [0, 0]]
                changeDamagePanel(attackerPanel, attackerName, nullDamage, nullDamage);
                return
            }
            // Tipos
            const ownTypes = utilSeparateColons(attackingTypes.textContent);
            const otherTypes = utilSeparateColons(defendingTypes.textContent);
            // Movimientos
            let movesInfoArray = parseMoveInfo(moveData, moveNames);
            // Estadisticas
            const attackerStats = getFinalStats(attackingFinalStats, attackerStatus.value, setTailwindMultiplier(fieldSides[0]), criticalHits);
            const defenderStats = getFinalStats(defendingFinalStats, defenderStatus.value, setTailwindMultiplier(fieldSides[1]), criticalHits);
            const statChanges = howManyStatChanges(attackingFinalStats)

            const AttackerData = {
                name: attackerName,
                level: parseInt(attackingLevel.value),
                stats: attackerStats,
                moves: movesInfoArray,
                types: ownTypes,
                status: attackerStatus.value,
                weight: parseInt(attackerWeight.textContent),
                item: attackerItem.value,
                current_life: parseInt(attackerCurrentLife.value),
                stat_changes: statChanges
            }
            const DefenderData = {
                name: defenderName,
                types: otherTypes,
                stats: defenderStats,
                weight: parseInt(defenderWeight.textContent),
                item: defenderItem.value,
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
            const variationDamage = await calculateVariation(movesBonus, effectiveness);
            const finalDamage = calculateFinalDamage(variationDamage, AttackerData, DefenderData, criticalHits);
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
