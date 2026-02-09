export function applyDebuffBurnParalysis(id, currentStatus){
    const burned = id===1 && currentStatus==="Quemado"
    const paralyzed = id===5 && currentStatus==="Paralizado"

    if (burned || paralyzed){
        return 0.5
    }
    return 1
}
// Refactorizar
function applyBadlyPoisonDamage(maxLife, currentStatus){
    const isBadlyPoison = currentStatus.value==="Gravemente Envenenado"
    const poisonDamageElement = currentStatus.querySelector(".badly-poison")
    const isDefined = poisonDamageElement!==null && poisonDamageElement!==undefined

    if (isBadlyPoison && isDefined){
        return maxLife*poisonDamageElement.value
    }
    return 0
}

export function statusPassiveDamage(maxLife, currentStatus){
    const receiveDamage = currentStatus.value==="Quemado" || currentStatus.value==="Envenenado"
    if(receiveDamage){
        return maxLife*(1/8)
    }
    // applyBadlyPoisonDamage(maxLife, currentStatus)
    return 0
}