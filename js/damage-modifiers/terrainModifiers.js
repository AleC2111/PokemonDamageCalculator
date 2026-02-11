import { isTouchingGround } from "../utils.js"

export function setTerrainMultipliers(activeTerrainName, AttackerData){
    const statusCondition = AttackerData.status

    if(!isTouchingGround(AttackerData)){
        return
    }
    validateStatus(statusCondition, activeTerrainName)
    
    for(let i=0;i<AttackerData.moves.length;i++){
        let moveName = AttackerData.moves[i].name
        if (activeTerrainName==="none"){
            if(moveName==="steel-roller"){
                AttackerData.moves[i].power = 0
            }
            continue
        }
        if(moveName==="expanding-force" && activeTerrainName==="psychic"){
            AttackerData.moves[i].power = 120
            continue
        }
        tarrainPulseCase(activeTerrainName, AttackerData.moves[i])

        let moveType = AttackerData.moves[i].type
        let movePriority = AttackerData.moves[i].priority
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

        AttackerData.moves[i].power *= grassyBoost
        AttackerData.moves[i].power *= electricBoost
        AttackerData.moves[i].power *= mistyDecrease
        AttackerData.moves[i].power *= psychicBoost
        AttackerData.moves[i].power *= grassyDecrease
        AttackerData.moves[i].power *= psychicNegatePriority
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
    if (moves.name==="tarrain-pulse"){
        if(activeTerrainName==="grassy"){
            moves.power *= 2
            moves.type = "grass"
        }
        if(activeTerrainName==="electric"){
            moves.power *= 2
            moves.type = "electric"
        }
        if(activeTerrainName==="misty"){
            moves.power *= 2
            moves.type = "fairy"
        }
        if(activeTerrainName==="psychic"){
            moves.power *= 2
            moves.type = "psychic"
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