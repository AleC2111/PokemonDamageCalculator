import { isTouchingGround } from "../utils.js"

export function setTerrainMultipliers(activeTerrainName, AttackerData){
    const statusCondition = AttackerData.status
    const userTypes = AttackerData.types

    if(!isTouchingGround(userTypes)){
        return
    }
    validateStatus(statusCondition, activeTerrainName)
    
    for(let i=0;i<AttackerData.moves.length;i++){
        let moveName = AttackerData.moves[i][5]
        if (activeTerrainName==="none"){
            if(moveName==="steel-roller"){
                AttackerData.moves[i][0] = 0
            }
            continue
        }
        if(moveName==="expanding-force" && activeTerrainName==="psychic"){
            AttackerData.moves[i][0] = 120
            continue
        }
        tarrainPulseCase(activeTerrainName, AttackerData.moves[i])

        let moveType = AttackerData.moves[i][2]
        let movePriority = AttackerData.moves[i][4]
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

        AttackerData.moves[i][0] *= grassyBoost
        AttackerData.moves[i][0] *= electricBoost
        AttackerData.moves[i][0] *= mistyDecrease
        AttackerData.moves[i][0] *= psychicBoost
        AttackerData.moves[i][0] *= grassyDecrease
        AttackerData.moves[i][0] *= psychicNegatePriority
    }
}

function terrainBoost(isTypeCorresponding, activeTerrainName, checkTerrain){
    return (isTypeCorresponding && activeTerrainName===checkTerrain) ? 1.3: 1;
}

function terrainDamageReduction(isTypeOrMoveCorresponding, activeTerrainName, checkTerrain){
    return (isTypeOrMoveCorresponding && activeTerrainName===checkTerrain) ? 0.5: 1;
}

function negatePriorityDamage(movePriority, activeTerrainName){
    return (movePriority>0 && activeTerrainName==="psychic") ? 0: 1;
}

function tarrainPulseCase(activeTerrainName, moves){
    if (moves[5]==="tarrain-pulse"){
        if(activeTerrainName==="grassy"){
            moves[0] *= 2
            moves[2] = "grass"
        }
        if(activeTerrainName==="electric"){
            moves[0] *= 2
            moves[2] = "electric"
        }
        if(activeTerrainName==="misty"){
            moves[0] *= 2
            moves[2] = "fairy"
        }
        if(activeTerrainName==="psychic"){
            moves[0] *= 2
            moves[2] = "psychic"
        }
    }
}

function validateStatus(statusCondition, activeTerrainName){
    const anyStatusCondition = statusCondition!=="Ninguno"
    
    if(statusCondition==="Paralizado" && activeTerrainName==="electric"){
        alert("Un pokemon no puede tener ese estado en Campo Electrico")
        throw new Error("Un pokemon no puede tener ese estado en Campo Electrico")
    }
    if(anyStatusCondition && activeTerrainName==="misty"){
        alert("Un pokemon no puede tener ese estado en Campo de Niebla")
        throw new Error("Un pokemon no puede tener ese estado en Campo de Niebla")
    }
}