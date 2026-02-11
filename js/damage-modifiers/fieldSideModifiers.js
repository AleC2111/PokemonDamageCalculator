import { getTypeRelations } from "./requiredModifiers.js";
import { isTouchingGround } from "../utils.js";

export function setOwnFieldMultipliers(fieldSide){
    const forms = fieldSide.querySelectorAll("input:checked")
    let accumulatedMultiplier = 1;

    for(let i=0; i<forms.length; i++){
        let activeFieldHazard = forms[i].value
        if(activeFieldHazard==="helping-hand") accumulatedMultiplier*=1.5;
    }
    return accumulatedMultiplier;
}

export function setOtherFieldMultipliers(fieldSide, movesCategory){
    const forms = fieldSide.querySelectorAll("input:checked")
    let accumulatedMultiplier = 1;

    for(let i=0; i<forms.length; i++){
        let activeFieldHazard = forms[i].value
        if(activeFieldHazard==="reflect" && movesCategory==="physical") 
            accumulatedMultiplier*=0.5;
        if(activeFieldHazard==="light-screen" && movesCategory==="special") 
            accumulatedMultiplier*=0.5;
        if(activeFieldHazard==="aurora-veil") accumulatedMultiplier*=0.5;
        if(activeFieldHazard==="friend-guard") accumulatedMultiplier*=0.25;
    }
    return accumulatedMultiplier
}

export function isProtectActive(fieldSide){
    const forms = fieldSide.querySelectorAll("input:checked")

    for(let i=0; i<forms.length; i++){
        let activeFieldHazard = forms[i].value
        if(activeFieldHazard==="protect") return true;
    }
    return false
}

export function setTailwindMultiplier(fieldSide){
    const forms = fieldSide.querySelectorAll("input:checked")

    for(let i=0; i<forms.length; i++){
        if(forms[i].value==="tailwind") return 2;
    }
    return 1;
}

export async function setFieldPassiveDamage(fieldSide, AttackerData){
    const attackerStats = AttackerData.stats
    const attackerTypes = AttackerData.types
    const attackerItem = AttackerData.item
    const forms = fieldSide.querySelectorAll("input:checked")
    let accumulatedPassiveDamage = 0

    for(let i=0; i<forms.length; i++){
        let activeFieldHazard = forms[i].value
        accumulatedPassiveDamage += leechSeedDamage(attackerStats, attackerTypes, activeFieldHazard)
        accumulatedPassiveDamage += saltCureDamage(attackerStats, attackerTypes, activeFieldHazard)
        if(isTouchingGround(AttackerData) && attackerItem!=="heavy-duty-boots"){
            accumulatedPassiveDamage += await stealthRockDamage(attackerStats, attackerTypes, activeFieldHazard)
            accumulatedPassiveDamage += spikesDamage(attackerStats, forms[i])
        }
    }
    return accumulatedPassiveDamage;
}

function leechSeedDamage(attackerStats, attackerTypes, activeFieldHazard){
    if(activeFieldHazard==="leech-seed" && !attackerTypes.includes("grass")){
        return attackerStats[0]*(1/8);
    }
    return 0
}

function saltCureDamage(attackerStats, attackerTypes, activeFieldHazard){
    if(activeFieldHazard==="salt-cure"){
        if(attackerTypes.includes("water") || attackerTypes.includes("steel")){
            return attackerStats[0]*(1/4)
        }
        else return attackerStats[0]*(1/8);
    }
    return 0
}

async function stealthRockDamage(attackerStats, attackerTypes, activeFieldHazard){
    if(activeFieldHazard==="stealth-rock"){
        const rockEffectiveness = await getTypeRelations("rock", attackerTypes)

        if(rockEffectiveness===4) return attackerStats[0]/2;
        if(rockEffectiveness===2) return attackerStats[0]/4;
        if(rockEffectiveness===1) return attackerStats[0]*(1/8);
        if(rockEffectiveness===0.5) return attackerStats[0]*(1/16);
        if(rockEffectiveness===0.25) return attackerStats[0]*(1/32);
    }
    return 0
}

function spikesDamage(attackerStats, activeFieldHazard){
    if(activeFieldHazard.name==="spikes"){
        if (activeFieldHazard.value===1) return attackerStats[0]*(1/8);
        if (activeFieldHazard.value===2) return attackerStats[0]*(1/6);
        if (activeFieldHazard.value===3) return attackerStats[0]*(1/4);
    }
    return 0;
}