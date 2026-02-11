import { utilSeparateSpaces } from "../utils.js";
import { applyDebuffBurnParalysis } from "./statusEffectModifiers.js";
import { isConctactMove, isBiteMove, isCuttingMove, isDanceMove, isExplosiveMove,
    isWindMove, isPowderMove, isProyectileMove, isPulseMove, isPunchingMove,
    isSoundMove, isTrappingMove } from "../utils.js";

export async function getTypeRelations(type, defendTypes){
    try{
        if (type=="" || type===undefined){
            return
        }
        const url = 'https://pokeapi.co/api/v2/type/'+type;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const data = await response.json();
        const effectiveness = effectivenessCalculation(data["damage_relations"], defendTypes)

        return effectiveness
    } catch(error){
        console.error('Error:', error);
    }
}

function addMoveProperties(iteratedMove){
    if(isConctactMove(iteratedMove.name)) iteratedMove.properties.push("contact-move");
    if(isBiteMove(iteratedMove.name)) iteratedMove.properties.push("bite-move");
    if(isCuttingMove(iteratedMove.name)) iteratedMove.properties.push("cut-move");
    if(isDanceMove(iteratedMove.name)) iteratedMove.properties.push("dance-move");
    if(isExplosiveMove(iteratedMove.name)) iteratedMove.properties.push("explosion-move");
    if(isWindMove(iteratedMove.name)) iteratedMove.properties.push("wind-move");
    if(isPowderMove(iteratedMove.name)) iteratedMove.properties.push("powder-move");
    if(isProyectileMove(iteratedMove.name)) iteratedMove.properties.push("proyectile-move");
    if(isPulseMove(iteratedMove.name)) iteratedMove.properties.push("pulse-move");
    if(isPunchingMove(iteratedMove.name)) iteratedMove.properties.push("punch-move");
    if(isSoundMove(iteratedMove.name)) iteratedMove.properties.push("sound-move");
    if(isTrappingMove(iteratedMove.name)) iteratedMove.properties.push("trap-move")
}

export function parseMoveInfo(attackingMoves, allMoveNames){
    const movesInfoArray = []
    for (let i=0;i<attackingMoves.length;i++){
        const moveContent = utilSeparateSpaces(attackingMoves[i].textContent)
        const moveName = allMoveNames[i].options[allMoveNames[i].selectedIndex].text
        let move = {
            power: moveContent[0],
            presicion: moveContent[1],
            type: moveContent[2],
            category: moveContent[3],
            priority: moveContent[4],
            name: moveName,
            properties: []
        }
        addMoveProperties(move)
        movesInfoArray.push(move)
        console.log(move)
    }
    return movesInfoArray
}

function typeDamage(allTypeRelations, defendTypes, damage, effectiveness){
    for(let i=0; i<allTypeRelations[effectiveness["relation"]].length; i++){
        for(let j=0; j<defendTypes.length; j++){
            if (defendTypes[j]===allTypeRelations[effectiveness["relation"]][i]["name"]){
                damage *= effectiveness["multiplier"]
            }
        }
    }
    return damage
}

function effectivenessCalculation(allTypeRelations, defendTypes){
    let damage = 1

    damage = typeDamage(allTypeRelations, defendTypes, damage, {"relation":"double_damage_to", "multiplier":2})
    damage = typeDamage(allTypeRelations, defendTypes, damage, {"relation":"half_damage_to", "multiplier":0.5})
    damage = typeDamage(allTypeRelations, defendTypes, damage, {"relation":"no_damage_to", "multiplier":0})

    return damage
}

function sameTypeBonus(type, attackerTypes){
    let bonus = 1
    for(let i=0; i<attackerTypes.length; i++){
        if(type===attackerTypes[i]) return bonus*=1.5;
    }
    return bonus
}

export async function organizeMovesEffective(movesInfoArray, defendTypes){
    const allMovesArray = movesInfoArray.map(async (move) => {
        return await getTypeRelations(move.type, defendTypes)
    })

    return allMovesArray
}

export function organizeMovesBonus(AttackerData){
    const movesInfoArray = AttackerData.moves
    const attackerTypes = AttackerData.types
    const allMovesArray = movesInfoArray.map(move => {
        return sameTypeBonus(move.type, attackerTypes)
    })

    return allMovesArray
}

export function organizeMovesPower(movesInfoArray, hitPerMove){
    for(let i=0; i<movesInfoArray.length; i++){
        movesInfoArray[i].power *= hitPerMove[i].value
    }
}

export function getFinalStats(statElement, currentStatus, tailwindMultiplier, criticalHits){
    const everyStat = statElement.rows
    let parsedValues = [0, 0, 0, 0, 0, 0]
    for (let i=0;i<everyStat.length;i++){
        let isCritical = criticalHits[i]?.checked===true
        let statusConditionDebuff = applyDebuffBurnParalysis(i, currentStatus);
        let getStatValue = parseInt(utilSeparateSpaces(everyStat[i].cells[0].textContent)[0]);
        
        if (i>0 && !isCritical){
            let statChanges = parseFloat(everyStat[i].cells[3].children[0].value);
            parsedValues[i] = getStatValue*statChanges*statusConditionDebuff;
        }
        else parsedValues[i] = getStatValue*statusConditionDebuff;
    }
    parsedValues[5]*tailwindMultiplier
    return parsedValues
}