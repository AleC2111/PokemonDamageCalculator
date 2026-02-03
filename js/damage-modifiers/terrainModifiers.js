export function setTerrainMultipliers(activeTerrainName, movesInfoArray, statusCondition){
    validateStatus(statusCondition, activeTerrainName)
    
    for(let i=0;i<movesInfoArray.length;i++){
        if (activeTerrainName==="none"){
            continue
        }
        let moveType = movesInfoArray[i][2]
        let movePriority = movesInfoArray[i][4]
        let moveName = movesInfoArray[i][5]
        let isGrassType = moveType==="grass"
        let isElectricType = moveType==="electric"
        let isDragonType = moveType==="dragon"
        let isPsychicType = moveType==="psychic"
        let isGroundMove = moveName==="earthquake" || moveName==="magnitude" || moveName==="bulldoze"

        let grassyBoost = terrainBoost(isGrassType, activeTerrainName, "grassy")
        let electricBoost = terrainBoost(isElectricType, activeTerrainName, "electric")
        let mistyDecrease = terrainDamageReduction(isDragonType, activeTerrainName, "misty")
        let psychicBoost = terrainBoost(isPsychicType, activeTerrainName, "psychic")
        let grassyDecrease = terrainDamageReduction(isGroundMove, activeTerrainName, "grassy")
        let psychicNegatePriority = negatePriorityDamage(movePriority, activeTerrainName)

        movesInfoArray[i][0] = movesInfoArray[i][0]*grassyBoost
        movesInfoArray[i][0] = movesInfoArray[i][0]*electricBoost
        movesInfoArray[i][0] = movesInfoArray[i][0]*mistyDecrease
        movesInfoArray[i][0] = movesInfoArray[i][0]*psychicBoost
        movesInfoArray[i][0] = movesInfoArray[i][0]*grassyDecrease
        movesInfoArray[i][0] = movesInfoArray[i][0]*psychicNegatePriority
    }
}

function terrainBoost(isTypeCorresponding, activeTerrainName, checkTerrain){
    if (isTypeCorresponding && activeTerrainName===checkTerrain){
        return 1.3
    }
    return 1
}

function terrainDamageReduction(isTypeOrMoveCorresponding, activeTerrainName, checkTerrain){
    if (isTypeOrMoveCorresponding && activeTerrainName===checkTerrain){
        return 0.5
    }
    return 1
}

function negatePriorityDamage(movePriority, activeTerrainName){
    if (movePriority>0 && activeTerrainName==="psychic"){
        return 0
    }
    return 1
}

function validateStatus(statusCondition, activeTerrainName){
    const anyStatusCondition = statusCondition==="Quemado" || statusCondition==="Envenenado" || 
        statusCondition==="Gravemente Envenenado" || statusCondition==="Paralizado" || 
        statusCondition==="Congelado" || statusCondition==="Confundido" || statusCondition==="Dormido"
    console.log(activeTerrainName)
    if(statusCondition==="Paralizado" && activeTerrainName==="electric"){
        alert("Un pokemon no puede tener ese estado en Campo Electrico")
        throw new Error("Un pokemon no puede tener ese estado en Campo Electrico")
    }
    if(anyStatusCondition && activeTerrainName==="misty"){
        alert("Un pokemon no puede tener ese estado en Campo de Niebla")
        throw new Error("Un pokemon no puede tener ese estado en Campo de Niebla")
    }
}