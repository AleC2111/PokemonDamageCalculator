export function setWeatherDamageMultipliers(activeClimateName, movesInfoArray, defenderTypes){
    for(let i=0;i<movesInfoArray.length;i++){
        if (activeClimateName==="none"){
            continue
        }
        if(movesInfoArray[i][5]==="hydro-steam" && activeClimateName==="sun"){
            movesInfoArray[i][0] = 120
            continue
        }
        weatherBallCase(activeClimateName, movesInfoArray[i])

        let moveType = movesInfoArray[i][2]
        let isWaterType = moveType==="water"
        let isFireType = moveType==="fire"
        let isStatusMove = movesInfoArray[i][3]==="status"
        
        let sunDamageBoost = weatherBoost(isFireType, activeClimateName, "sun")*weatherBoost(isFireType, activeClimateName, "harsh-sun")
        let rainDamageBoost = weatherBoost(isWaterType, activeClimateName, "rain")*weatherBoost(isWaterType, activeClimateName, "heavy-rain")
        let sunDamageReduction = weatherDamageReduction(isWaterType, activeClimateName, "sun")
        let rainDamageReduction = weatherDamageReduction(isFireType, activeClimateName, "rain")
        let strongWindsReduction = strongWindsDamageReduction(moveType, activeClimateName, defenderTypes)
        let harshSunCancelDamage = weatherCancelDamage(isWaterType, activeClimateName, "harsh-sun", isStatusMove)
        let heavyRainCancelDamage = weatherCancelDamage(isFireType, activeClimateName, "heavy-rain", isStatusMove)
        
        movesInfoArray[i][0] *= sunDamageBoost
        movesInfoArray[i][0] *= rainDamageBoost
        movesInfoArray[i][0] *= sunDamageReduction
        movesInfoArray[i][0] *= rainDamageReduction
        movesInfoArray[i][0] *= strongWindsReduction
        movesInfoArray[i][0] *= harshSunCancelDamage
        movesInfoArray[i][0] *= heavyRainCancelDamage
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
    if (moves[5]==="weather-ball"){
        if(activeClimateName==="sun" || activeClimateName==="harsh-sun"){
            moves[0] *= 2
            moves[2] = "fire"
        }
        if(activeClimateName==="rain" || activeClimateName==="heavy-rain"){
            moves[0] *= 2
            moves[2] = "water"
        }
        if(activeClimateName==="sandstorm"){
            moves[0] *= 2
            moves[2] = "rock"
        }
        if(activeClimateName==="snow"){
            moves[0] *= 2
            moves[2] = "ice"
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