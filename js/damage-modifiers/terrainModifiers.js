import { isTouchingGround } from "../utils.js"

export function setTerrainMultipliers(activeTerrainName, movesInfoArray, statusCondition, userTypes){
    if(!isTouchingGround(userTypes)){
        return
    }
    validateStatus(statusCondition, activeTerrainName)
    
    for(let i=0;i<movesInfoArray.length;i++){
        let moveName = movesInfoArray[i][5]
        if (activeTerrainName==="none"){
            if(moveName==="steel-roller"){
                movesInfoArray[i][0] = 0
            }
            continue
        }
        if(moveName==="expanding-force" && activeTerrainName==="psychic"){
            movesInfoArray[i][0] = 120
            continue
        }
        tarrainPulseCase(activeTerrainName, movesInfoArray, iterator)

        let moveType = movesInfoArray[i][2]
        let movePriority = movesInfoArray[i][4]
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

function tarrainPulseCase(activeTerrainName, movesInfoArray, iterator){
    if (movesInfoArray[i][5]==="tarrain-pulse"){
        if(activeTerrainName==="grassy"){
            movesInfoArray[iterator][0] *= 2
            movesInfoArray[iterator][2] = "grass"
        }
        if(activeTerrainName==="electric"){
            movesInfoArray[iterator][0] *= 2
            movesInfoArray[iterator][2] = "electric"
        }
        if(activeTerrainName==="misty"){
            movesInfoArray[iterator][0] *= 2
            movesInfoArray[iterator][2] = "fairy"
        }
        if(activeTerrainName==="psychic"){
            movesInfoArray[iterator][0] *= 2
            movesInfoArray[iterator][2] = "psychic"
        }
    }
}

function validateStatus(statusCondition, activeTerrainName){
    const anyStatusCondition = statusCondition==="Quemado" || statusCondition==="Envenenado" || 
        statusCondition==="Gravemente Envenenado" || statusCondition==="Paralizado" || 
        statusCondition==="Congelado" || statusCondition==="Confundido" || statusCondition==="Dormido"
    
    if(statusCondition==="Paralizado" && activeTerrainName==="electric"){
        alert("Un pokemon no puede tener ese estado en Campo Electrico")
        throw new Error("Un pokemon no puede tener ese estado en Campo Electrico")
    }
    if(anyStatusCondition && activeTerrainName==="misty"){
        alert("Un pokemon no puede tener ese estado en Campo de Niebla")
        throw new Error("Un pokemon no puede tener ese estado en Campo de Niebla")
    }
}