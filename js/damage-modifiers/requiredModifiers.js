import { utilSeparateSpaces } from "../utils.js";
import { applyDebuffBurnParalysis } from "./statusEffectModifiers.js";

async function getTypeRelations(type, defendTypes){
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

export function parseMoveInfo(attackingMoves){
    let movesInfoArray = []
    for (let i=0;i<attackingMoves.length;i++){
        const moveContent = attackingMoves[i].textContent
        movesInfoArray.push(utilSeparateSpaces(moveContent))
    }
    return movesInfoArray
}

function typeDamage(relations, defendTypes, damage, effectiveness, multiplier){
    for(let i=0; i<relations[effectiveness].length; i++){
        for(let j=0; j<defendTypes.length; j++){
            if (defendTypes[j]===relations[effectiveness][i]["name"]){
                damage *= multiplier
            }
        }
    }
    return damage
}

function effectivenessCalculation(relations, defendTypes){
    let damage = 1

    damage = typeDamage(relations, defendTypes, damage, "double_damage_to", 2)
    damage = typeDamage(relations, defendTypes, damage, "half_damage_to", 0.5)
    damage = typeDamage(relations, defendTypes, damage, "no_damage_to", 0)

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
    let allMovesArray = []
    for(let i=0; i<movesInfoArray.length; i++){
        let effective = await getTypeRelations(movesInfoArray[i][2], defendTypes)
        allMovesArray.push(effective)
    }
    return allMovesArray
}

export function organizeMovesBonus(movesInfoArray, attackerTypes){
    let allMovesArray = []
    for(let i=0; i<movesInfoArray.length; i++){
        let bonusPower = sameTypeBonus(movesInfoArray[i][2], attackerTypes)
        allMovesArray.push(bonusPower)
    }
    return allMovesArray
}

export function organizeMovesPower(movesInfoArray, hitPerMove){
    for(let i=0; i<movesInfoArray.length; i++){
        movesInfoArray[i][0] = movesInfoArray[i][0]*hitPerMove[i].value
    }
}

export function getFinalStats(statElement, currentStatus){
    const everyStat = statElement.rows
    let parsedValues = [0, 0, 0, 0, 0, 0]
    for (let i=0;i<everyStat.length;i++){
        let getStatValue = parseInt(utilSeparateSpaces(everyStat[i].cells[0].textContent)[0]);
        
        if (i>0){
            let statChanges = parseFloat(everyStat[i].cells[3].children[0].value);
            parsedValues[i] = getStatValue*statChanges*applyDebuffBurnParalysis(i, currentStatus);
        }
        else {
            parsedValues[i] = getStatValue;
        }
    }
    return parsedValues
}