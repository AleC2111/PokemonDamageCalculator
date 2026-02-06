function assignNatureValue(natureMultiplier, diminishingStat, boostingStat){
    if(diminishingStat===boostingStat) return;
    natureMultiplier[boostingStat]=1.1
    natureMultiplier[diminishingStat]=0.9
}

export function natureValue(natureName){
    let natureMultiplier = [1, 1, 1, 1, 1]
    const attackBoosting = ["fuerte", "huraña", "firme", "picara", "audaz"]
    const defenseBoosting = ["osada", "docil", "agitada", "descuidada", "relajada"]
    const specialAttackBoosting = ["modesta", "cordial", "timida", "alocada", "apacible"]
    const specialDefenseBoosting = ["serena", "amable", "cauta", "extravagante", "grosera"]
    const speedBoosting = ["miedosa", "activa", "alegre", "ingenua", "seria"]

    for (let i=0;i<natureMultiplier.length;i++){
        if (attackBoosting[i] === natureName){
            assignNatureValue(natureMultiplier, i, 0)
        }
        if (defenseBoosting[i] === natureName){
            assignNatureValue(natureMultiplier, i, 1)
        }
        if (specialAttackBoosting[i] === natureName){
            assignNatureValue(natureMultiplier, i, 2)
        }
        if (specialDefenseBoosting[i] === natureName){
            assignNatureValue(natureMultiplier, i, 3)
        }
        if (speedBoosting[i] === natureName){
            assignNatureValue(natureMultiplier, i, 4)
        }
    }

    return natureMultiplier
}

function getStatMofications(finalStats){
    const everyStat = finalStats.rows
    let individualValues = [0, 0, 0, 0, 0, 0]
    let effortValues = [0, 0, 0, 0, 0, 0]
    for (let i=0;i<everyStat.length;i++){
        individualValues[i] = parseInt(everyStat[i].cells[1].children[0].value);
        effortValues[i] = parseInt(everyStat[i].cells[2].children[0].value);
        let negativeTest = individualValues[i]<0 || effortValues[i]<0
        let overflowTest = individualValues[i]>31 || effortValues[i]>252
        if (negativeTest || overflowTest){
            throw new Error("Valores invalidos para IVs y EVs");
        }
    }

    return {
        iv: individualValues,
        ev: effortValues
    };
}

export function calculatePokemonStats(level, statsArray, natureMultiplier, finalStats){
    let { iv, ev } = getStatMofications(finalStats)
    let finalCalculation = [0, 0, 0, 0, 0, 0]
    
    level = parseInt(level);
    let baseStats = 2*statsArray[0]["base_stat"]
    let trainingModifiers = iv[0]+(ev[0]/4)
    finalCalculation[0] = Math.floor((((baseStats+trainingModifiers)*level)/100)+level+10);
    for (let i=0;i<natureMultiplier.length;i++){
        baseStats = 2*statsArray[i+1]["base_stat"]
        trainingModifiers = iv[i+1]+(ev[i+1]/4)
        finalCalculation[i+1] = Math.floor(((((baseStats+trainingModifiers)*level)/100)+5)*natureMultiplier[i]);
    }

    return finalCalculation
}