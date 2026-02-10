export function loadStartingOptions(){
    const naturesElements = document.querySelectorAll(".natures")
    const statusCondition = document.querySelectorAll(".status")
    const timesHitArray = document.querySelectorAll(".times-hit")
    const statChangesArray = document.querySelectorAll(".stat-changes")

    iterateNatureNames(naturesElements); 
    iterateStatusConditions(statusCondition); 
    iterateStatChangeSelect(statChangesArray);
    iterateTimesHitSelect(timesHitArray);
}

function addNatureNames(natureElement){
    const natures = [
        "fuerte", "huraña", "firme", "picara", "audaz",
        "osada", "docil", "agitada", "descuidada", "relajada",
        "modesta", "cordial", "timida", "alocada", "apacible",
        "serena", "amable", "cauta", "extravagante", "grosera",
        "miedosa", "activa", "alegre", "ingenua", "seria"
    ]
    
    for (let i=0; i<natures.length; i++){
        const natureName = document.createElement("option")
        natureName.value = natures[i]
        natureName.text = natures[i]

        natureElement.appendChild(natureName)
    }
}

function iterateNatureNames(naturesElements){
    for(let i=0; i<naturesElements.length; i++){
        addNatureNames(naturesElements[i])
    }
}

function addStatusNames(statusElement){
    const allStatusEffects = [
        "Ninguno", "Quemado", "Paralizado", "Envenenado", 
        "Gravemente Envenenado", "Dormido", "Congelado", "Confundido"
    ]

    for (let i=0; i<allStatusEffects.length; i++){
        const statusName = document.createElement("option")
        statusName.value = allStatusEffects[i]
        statusName.text = allStatusEffects[i]

        statusElement.appendChild(statusName)
    }
}

function iterateStatusConditions(statusElements){
    for(let i=0; i<statusElements.length; i++){
        addStatusNames(statusElements[i])
    }
}

function addTimesHit(selectTimesHit){
    const numbers = ["One", "Two", "Three", "Four", "Five"]
    for(let i=0; i<5; i++){
        const hitOptions = document.createElement("option")

        hitOptions.value = i+1
        hitOptions.text = numbers[i]+" Hit"

        selectTimesHit.appendChild(hitOptions)
    }
}

function iterateTimesHitSelect(timesHitArray){
    for(let i=0; i<timesHitArray.length; i++){
        addTimesHit(timesHitArray[i])
    }
}

function statChangeValues(){
    const negativeValues = []
    const positiveValues = []
    for(let i=8; i>2; i--){
        negativeValues.push(Math.round((2/i)*100)/100)
        positiveValues.push(Math.round((i/2)*100)/100)
    }
    positiveValues.sort((a, b) => a - b)
    const statChanges = organizeEveryStatChange(negativeValues, positiveValues)
    return statChanges
}

function organizeEveryStatChange(negativeValues, positiveValues){
    const statChangesArray = []
    for(let i=0; i<13; i++){
        if(i<6){
            statChangesArray.push(negativeValues[i])
        }
        if(i==6){
            statChangesArray.push(1)
        }
        if(i>6){
            statChangesArray.push(positiveValues[i-7])
        }
    }
    return statChangesArray
}

function addStatChanges(statChangeElement){
    const statValues = statChangeValues();

    for(let i=0; i<13; i++){
        const statChange = document.createElement("option")

        statChange.value = statValues[i]
        if(i<6){
            statChange.text = "-"+(i+1)
        }
        if(i==6){
            statChange.text = "--"
            statChange.selected = true
        }
        if(i>6){
            statChange.text = "+"+(i-6)
        }
        
        statChangeElement.appendChild(statChange)
    }
}

function iterateStatChangeSelect(statChangesArray){
    for(let i=0; i<statChangesArray.length; i++){
        addStatChanges(statChangesArray[i].children[0])
    }
}

function addPoisonTurnDamage(selectPoisonDamage){
    for(let i=1; i<15; i++){
        const poisonOption = document.createElement("option")
        poisonOption.value = i/16
        poisonOption.text = i+"/16"
        selectPoisonDamage.appendChild(poisonOption)
    }
}

function createPoisonDamage(isBadlyPoison, poisonDamage, statusBlock, id){
    const isNotDefined = poisonDamage===null || poisonDamage===undefined
    if(isBadlyPoison && statusBlock.children.length===1 && isNotDefined){
        let selectPoisonDamage = document.createElement("select")
        selectPoisonDamage.className = "badly-poison"
        selectPoisonDamage.id = "poison-"+id
        statusBlock.appendChild(selectPoisonDamage)
        addPoisonTurnDamage(selectPoisonDamage)
    }
}

function deletePoisonDamage(isBadlyPoison, poisonDamage){
    const isDefined = poisonDamage!==null && poisonDamage!==undefined
    if (!isBadlyPoison && isDefined){
        poisonDamage.remove()
    }
}

// Error al eliminar y agregar
function badlyPoisonDamage(id){
    const statusBlock = document.querySelectorAll(".status-block")
    const selectStatusCondition = document.querySelectorAll(".status")
    const poisonDamageElement = document.querySelectorAll(".badly-poison")
    console.log(selectStatusCondition)
    let isBadlyPoison = selectStatusCondition[id].value==="Gravemente Envenenado"
    createPoisonDamage(isBadlyPoison, poisonDamageElement[id], statusBlock[id], id)
    deletePoisonDamage(isBadlyPoison, poisonDamageElement[id])
}

export function handlePoisonEvent(){
    const status = document.querySelectorAll(".status")
    status[0].addEventListener('change', ()=> {
        badlyPoisonDamage(0)
    })
    status[1].addEventListener('change', ()=> {
        badlyPoisonDamage(1)
    })
}
