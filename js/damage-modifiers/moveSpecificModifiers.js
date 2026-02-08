export function speedDependentMoves(movesInfoArray, attackerStats, defenderStats){
    for(let i=0;i<movesInfoArray.length;i++){
        if(movesInfoArray[i][5]==="gyro-ball"){
            let powerCalculation = 25*(defenderStats[5]/attackerStats[5])
            movesInfoArray[i][0] = Math.min(150, Math.max(1, powerCalculation))
        }
        if(movesInfoArray[i][5]==="electro-ball"){
            movesInfoArray[i][0] = electroBallPower(attackerStats[5]/defenderStats[5])
        }
    }
}

function electroBallPower(speedDivision){
    if(speedDivision < 1) return 40;
    else if(speedDivision >= 1 && speedDivision < 2) return 60;
    else if(speedDivision >= 2 && speedDivision < 3) return 80;
    else if(speedDivision >= 3 && speedDivision < 4) return 120;
    else if(speedDivision >= 4) return 150;
}

export function lifeDependentMoves(movesInfoArray, attackerStats, defenderStats, 
    attackerCurrentLife, defenderCurrentLife){
    for(let i=0;i<movesInfoArray.length;i++){
        if(movesInfoArray[i][5]==="eruption" || movesInfoArray[i][5]==="water-spout"){
            let powerCalculation = 150*(attackerCurrentLife/attackerStats[0])
            movesInfoArray[i][0] = Math.min(150, Math.max(1, powerCalculation))
        }
        if(movesInfoArray[i][5]==="brine" && defenderCurrentLife <= defenderStats[0]/2){
            movesInfoArray[i][0] = 130
        }
    }
}

export function weightDependentMoves(movesInfoArray, attackerWeight, defenderWeight){
    for(let i=0;i<movesInfoArray.length;i++){
        if(movesInfoArray[i][5]==="grass-knot" || movesInfoArray[i][5]==="low-kick"){
            movesInfoArray[i][0] = onlyDefenderDependentPower(defenderWeight)
        }
        if(movesInfoArray[i][5]==="heat-crash" || movesInfoArray[i][5]==="heavy-slam"){
            movesInfoArray[i][0] = weightRelationPower(attackerWeight/defenderWeight)
        }
    }
}

function onlyDefenderDependentPower(defenderWeight){
    if(defenderWeight>= 0.1 && defenderWeight<10) return 20;
    else if(defenderWeight>= 10 && defenderWeight<25) return 40;
    else if(defenderWeight>= 25 && defenderWeight<50) return 60;
    else if(defenderWeight>= 50 && defenderWeight<100) return 80;
    else if(defenderWeight>= 100 && defenderWeight<200) return 100;
    else if(defenderWeight>= 200) return 120;
}

function weightRelationPower(weightDivision){
    if(weightDivision<2) return 40;
    else if(weightDivision<3 && weightDivision>=2) return 60;
    else if(weightDivision<4 && weightDivision>=3) return 80;
    else if(weightDivision<5 && weightDivision>=4) return 100;
    else if(weightDivision>=5) return 120;
}
