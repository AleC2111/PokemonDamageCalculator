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
