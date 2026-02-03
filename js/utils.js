export function utilSeparateText(arrayToSeparate){
    if (arrayToSeparate=="" || arrayToSeparate===undefined){
        return
    }
    let finalText = ""
    for(let i=0; i<arrayToSeparate.length; i++){
        finalText = finalText+" "+arrayToSeparate[i]
    }
    return finalText
}

export function utilSeparateColons(textToSeparate){
    let finalText = ""
    if(textToSeparate.includes(":")){
        finalText = textToSeparate.split(":")[1].split(" ").slice(1)
    }
    return finalText
}

export function utilSeparateSpaces(textToSeparate){
    return textToSeparate.split(" ").slice(1)
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

export function iterateTimesHitSelect(timesHitArray){
    for(let i=0; i<timesHitArray.length; i++){
        addTimesHit(timesHitArray[i])
    }
}

export function statChangeValues(){
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

export function iterateStatChangeSelect(statChangesArray){
    for(let i=0; i<statChangesArray.length; i++){
        addStatChanges(statChangesArray[i].children[0])
    }
}