export function speedDependentMoves(AttackerData, defenderStats){
    const attackerStats = AttackerData.stats
    
    for(let i=0;i<AttackerData.moves.length;i++){
        let moveNames = AttackerData.moves[i].name
        let isGoingLast = attackerStats[5]<defenderStats[5] 
        if(moveNames==="gyro-ball"){
            let powerCalculation = 25*(defenderStats[5]/attackerStats[5])
            AttackerData.moves[i].power = Math.min(150, Math.max(1, powerCalculation))
        }
        if(moveNames==="electro-ball"){
            AttackerData.moves[i].power = electroBallPower(attackerStats[5]/defenderStats[5])
        }
        if((moveNames==="payback" || moveNames==="avalanche") && isGoingLast){
            AttackerData.moves[i].power *= 2
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

export function lifeDependentMoves(AttackerData, DefenderData){
    const attackerStats = AttackerData.stats
    const attackerCurrentLife = AttackerData.current_life
    const defenderStats = DefenderData.stats
    const defenderCurrentLife = DefenderData.current_life

    for(let i=0;i<AttackerData.moves.length;i++){
        let moveNames = AttackerData.moves[i].name
        if(moveNames==="eruption" || moveNames==="water-spout" || moveNames==="dragon-energy"){
            let powerCalculation = 150*(attackerCurrentLife/attackerStats[0])
            AttackerData.moves[i].power = Math.min(150, Math.max(1, powerCalculation))
        }
        if(moveNames==="brine" && defenderCurrentLife <= defenderStats[0]/2){
            AttackerData.moves[i].power = 130
        }
    }
}

export function weightDependentMoves(AttackerData, DefenderData){
    const attackerWeight = AttackerData.weight
    const defenderWeight = DefenderData.weight

    for(let i=0;i<AttackerData.moves.length;i++){
        let moveNames = AttackerData.moves[i].name
        if(moveNames==="grass-knot" || moveNames==="low-kick"){
            AttackerData.moves[i].power = onlyDefenderDependentPower(defenderWeight)
        }
        if(moveNames==="heat-crash" || moveNames==="heavy-slam"){
            AttackerData.moves[i].power = weightRelationPower(attackerWeight/defenderWeight)
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

export function statusConditionDependentPower(AttackerData, DefenderData){
    const attackerStatus = AttackerData.status
    const defenderStatus = DefenderData.status
    const isDefenderPoisioned = defenderStatus==="Envenenado" || defenderStatus==="Gravemente Envenenado"

    for(let i=0;i<AttackerData.moves.length;i++){
        let moveNames = AttackerData.moves[i].name
        if(moveNames==="venoshock" && isDefenderPoisioned){
            AttackerData.moves[i].power *= 2
        }
        if(moveNames==="facade" && attackerStatus!=="Ninguno"){
            AttackerData.moves[i].power *= 2
        }
    }
}

export function statChangeDependentPower(AttackerData){
    const statChanges = AttackerData.stat_changes+1

    for(let i=0;i<AttackerData.moves.length;i++){
        let moveNames = AttackerData.moves[i].name
        if(moveNames==="stored-power" || moveNames==="power-trip"){
            AttackerData.moves[i].power = 20*statChanges
        }
    }
}
