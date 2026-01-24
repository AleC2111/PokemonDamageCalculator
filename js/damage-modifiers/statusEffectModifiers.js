export function applyDebuffBurnParalysis(id, currentStatus){
    const burned = id===1 && currentStatus==="Quemado"
    const paralyzed = id===5 && currentStatus==="Paralizado"

    if (burned || paralyzed){
        return 0.5
    }
    return 1
}

export function poisonBurnDamage(maxLife, currentStatus){
    const receiveDamage = currentStatus==="Quemado" || currentStatus==="Envenenado"
    if(receiveDamage){
        return maxLife*(1/8)
    }
    return 0
}