import { utilSeparateSpaces } from "../utils.js";
import { applyDebuffBurnParalysis } from "./statusEffectModifiers.js";

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

export function parseMoveInfo(attackingMoves, allMoveNames){
    const movesInfoArray = []
    for (let i=0;i<attackingMoves.length;i++){
        const moveContent = attackingMoves[i].textContent
        movesInfoArray.push(utilSeparateSpaces(moveContent))
        const moveName = allMoveNames[i].options[allMoveNames[i].selectedIndex].text
        movesInfoArray[i].push(moveName)
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
        return await getTypeRelations(move[2], defendTypes)
    })

    return allMovesArray
}

export function organizeMovesBonus(AttackerData){
    const movesInfoArray = AttackerData.moves
    const attackerTypes = AttackerData.types
    const allMovesArray = movesInfoArray.map(move => {
        return sameTypeBonus(move[2], attackerTypes)
    })

    return allMovesArray
}

export function organizeMovesPower(movesInfoArray, hitPerMove){
    for(let i=0; i<movesInfoArray.length; i++){
        movesInfoArray[i][0] = movesInfoArray[i][0]*hitPerMove[i].value
    }
}

export function getFinalStats(statElement, currentStatus, tailwindMultiplier){
    const everyStat = statElement.rows
    let parsedValues = [0, 0, 0, 0, 0, 0]
    for (let i=0;i<everyStat.length;i++){
        let getStatValue = parseInt(utilSeparateSpaces(everyStat[i].cells[0].textContent)[0]);
        
        if (i>0){
            let statChanges = parseFloat(everyStat[i].cells[3].children[0].value);
            parsedValues[i] = getStatValue*statChanges*applyDebuffBurnParalysis(i, currentStatus);
        }
        else parsedValues[i] = getStatValue;
    }
    
    return parsedValues
}