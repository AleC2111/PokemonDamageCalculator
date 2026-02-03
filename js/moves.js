import { utilSeparateText } from "./utils.js"

async function getEachMove(moveUrl){
    try{
        if (moveUrl=="" || moveUrl===undefined){
            return
        }
        const moveResponse= await fetch(moveUrl)
        if (!moveResponse.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        const data = await moveResponse.json();
        return data
    } catch(error){
        console.log('Error:', error)
    }
}

function acommodateMoveData(moveJSON){
    if (moveJSON=="" || moveJSON===undefined){
        return
    }
    const power = moveJSON["power"]
    const accuracy = moveJSON["accuracy"]
    const type = moveJSON["type"]["name"]
    const damageClass = moveJSON["damage_class"]["name"]
    const priority = moveJSON["priority"]

    return [
        power===null? 0: power,
        accuracy===null? 0: accuracy,
        type,
        damageClass,
        priority===null? 0: priority
    ]
}

function equalMoveset(previousMovesArray, currentMoves){
    if(previousMovesArray.length!==currentMoves.length){
        return false
    }
    for (let i=0;i<currentMoves.length;i++){
        if(previousMovesArray[i]!==currentMoves[i]["move"]["name"]){
            return false
        }
    }
    return true
}

function addMovesLogic(data, moveElement, id){
    if(id===0){
        moveElement.innerHTML = '';
    }

    const newMoveElement = document.createElement("option");
    newMoveElement.value = data["moves"][id]["move"]["url"];
    newMoveElement.text = data["moves"][id]["move"]["name"];

    moveElement.appendChild(newMoveElement);
}

export function addMoveOptions(data, movesSelectors){
    for (let i=0;i<movesSelectors.length;i++){
        let moveList = movesSelectors[i]
        const previousMoves = Array.from(moveList.options).map(option => option.text)
        if (i===0 && equalMoveset(previousMoves, data["moves"])===true){
            return
        }
        for (let j=0;j<data["moves"].length;j++){
            addMovesLogic(data, moveList, j)
        }
    }
}

export async function getMoveData(movesSelectors, movesInfoElement) {
    try{
        for (let i=0;i<movesSelectors.length;i++){
            let moveContent = await getEachMove(movesSelectors[i].value) 
            movesInfoElement[i].textContent = utilSeparateText(acommodateMoveData(moveContent))
        }
    } catch(error){
        console.log('Error:', error)
    }
}
