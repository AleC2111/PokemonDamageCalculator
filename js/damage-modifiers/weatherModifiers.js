export function setWeatherDamageMultipliers(activeClimateName, movesInfoArray, defenderTypes){
    for(let i=0;i<movesInfoArray.length;i++){
        if (activeClimateName==="none"){
            continue
        }
        if(movesInfoArray[i].name==="hydro-steam" && activeClimateName==="sun"){
            movesInfoArray[i].power = 120
            continue
        }
        weatherBallCase(activeClimateName, movesInfoArray[i])

        let isWaterType = movesInfoArray[i].type==="water"
        let isFireType = movesInfoArray[i].type==="fire"
        let isStatusMove = movesInfoArray[i].category==="status"
        
        let sunDamageBoost = weatherBoost(isFireType, activeClimateName, "sun")*weatherBoost(isFireType, activeClimateName, "harsh-sun")
        let rainDamageBoost = weatherBoost(isWaterType, activeClimateName, "rain")*weatherBoost(isWaterType, activeClimateName, "heavy-rain")
        let sunDamageReduction = weatherDamageReduction(isWaterType, activeClimateName, "sun")
        let rainDamageReduction = weatherDamageReduction(isFireType, activeClimateName, "rain")
        let strongWindsReduction = strongWindsDamageReduction(movesInfoArray[i].type, activeClimateName, defenderTypes)
        let harshSunCancelDamage = weatherCancelDamage(isWaterType, activeClimateName, "harsh-sun", isStatusMove)
        let heavyRainCancelDamage = weatherCancelDamage(isFireType, activeClimateName, "heavy-rain", isStatusMove)
        
        movesInfoArray[i].power *= sunDamageBoost
        movesInfoArray[i].power *= rainDamageBoost
        movesInfoArray[i].power *= sunDamageReduction
        movesInfoArray[i].power *= rainDamageReduction
        movesInfoArray[i].power *= strongWindsReduction
        movesInfoArray[i].power *= harshSunCancelDamage
        movesInfoArray[i].power *= heavyRainCancelDamage
    }
}

function weatherBoost(isTypeCorresponding, activeClimateName, checkClimate){
    return (isTypeCorresponding && activeClimateName===checkClimate) ? 1.5: 1;
}

function weatherDamageReduction(isTypeCorresponding, activeClimateName, checkClimate){
    return (isTypeCorresponding && activeClimateName===checkClimate) ? 0.5: 1;
}

function weatherCancelDamage(isTypeCorresponding, activeClimateName, checkClimate, isStatusMove){
    return (isTypeCorresponding && activeClimateName===checkClimate && !isStatusMove) ? 0: 1;
}

function strongWindsDamageReduction(moveType, activeClimateName, defenderTypes){
    const isFlyingEffective = moveType==="rock" || moveType==="electric" || moveType==="ice"

    for (let i=0; i<defenderTypes.length; i++){
        if (isFlyingEffective && activeClimateName==="strong-winds" && defenderTypes[i]==="flying"){
            return 0.5
        }
    }
    return 1
}

function weatherBallCase(activeClimateName, moves){
    if (moves.name==="weather-ball"){
        if(activeClimateName==="sun" || activeClimateName==="harsh-sun"){
            moves.power *= 2
            moves.type = "fire"
        }
        if(activeClimateName==="rain" || activeClimateName==="heavy-rain"){
            moves.power *= 2
            moves.type = "water"
        }
        if(activeClimateName==="sandstorm"){
            moves.power *= 2
            moves.type = "rock"
        }
        if(activeClimateName==="snow"){
            moves.power *= 2
            moves.type = "ice"
        }
    }
}

export function setWeatherDefenseMultipliers(activeClimateName, DefenderData){
    const defenderTypes = DefenderData.types

    for (let i=0; i<defenderTypes.length; i++){
        if (activeClimateName==="none"){
            continue
        }
        let isRockType = defenderTypes[i]==="rock"
        let isIceType = defenderTypes[i]==="ice"
        let sandDefenseBoost = weatherBoost(isRockType, activeClimateName, "sand")
        let snowDefenseBoost = weatherBoost(isIceType, activeClimateName, "snow")

        DefenderData.stats[4] *= sandDefenseBoost
        DefenderData.stats[2] *= snowDefenseBoost
    }
}