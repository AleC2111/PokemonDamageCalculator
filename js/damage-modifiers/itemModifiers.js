/*
Los objetos se recibiran también en Ingles con el mismo formato
    - Utility Umbrella
    - Interacciones de Tipos (Expert Belt, Iron Ball, Blanco)
    - Daño Pasivo (Leftovers, Rocky Helmet, Big Root, Life Orb, Binding Band)
    - Alterar orden (Lagging Tail, Incienso Lento)
    - Pokemon especifico (Discos de Genesect, Mascaras de Ogerpon, Discos de Silvally, Tablas de Arceus)
    - Mineral Evolutivo
    - Bayas
    - Depende de habilidades (Ability Shield, Booster Energy)
*/
export function weightAlteringItems(itemName, pokemonWeight){
    pokemonWeight = itemName==="float-stone" ? pokemonWeight/2: pokemonWeight;
}

export function removeMovePropertyItems(itemName, movesInfoArray){
    if(itemName==="protective-pads" || itemName==="punching-glove"){
        movesInfoArray = movesInfoArray.map(move => 
            move.filter(data => data!=="contact-move")
        )
    }
}

export function statBoostingItems(itemName, pokemonStats){
    if(itemName==="choice-band") pokemonStats[1] *= 1.5;
    else if(itemName==="choice-specs") pokemonStats[3] *= 1.5;
    else if(itemName==="choice-scarf") pokemonStats[5] *= 1.5;
    else if(itemName==="assault-vest") pokemonStats[4] *= 1.5; 
    else if(itemName==="muscle-band") pokemonStats[1] *= 1.1;
    else if(itemName==="wise-glasses") pokemonStats[3] *= 1.1;
}

export function speedLoweringItems(itemName, pokemonStats){
    const isTrainingItem = itemName==="macho-brace" || itemName==="power-weight" ||
    itemName==="power-bracer" || itemName==="power-belt" || itemName==="power-lens" ||
    itemName==="power-band" || itemName==="power-anklet"
    if(isTrainingItem || itemName==="iron-ball") pokemonStats[5] *= 0.5;
}

export function powerBoostingItems(itemName, movesInfoArray){
    const itemTypeRelations = {
        water: ["mystic-water", "splash-plate", "wave-incense", "sea-incense", "water-gem"],
        grass: ["miracle-seed", "meadow-plate", "rose-incense", "grass-gem"],
        fire: ["charcoal", "flame-plate", "fire-gem"],
        ground: ["soft-sand", "earth-plate", "ground-gem"],
        bug: ["silver-powder", "insect-plate", "bug-gem"],
        rock: ["hard-stone", "stone-plate", "rock-incense", "rock-gem"],
        flying: ["sharp-beak", "sky-plate", "flying-gem"],
        electric: ["magnet", "zap-plate", "electric-gem"],
        psychic: ["twisted-spoon", "mind-plate", "odd-incense", "psychic-gem"],
        dark: ["black-glasses", "dread-plate", "dark-gem"],
        ghost: ["spell-tag", "spooky-plate", "ghost-gem"],
        ice: ["never-melt-ice", "icicle-plate", "ice-gem"],
        dragon: ["dragon-fang", "draco-plate", "dragon-gem"],
        steel: ["metal-coat", "iron-plate", "steel-gem"],
        poison: ["poison-barb", "toxic-plate", "poison-gem"],
        normal: ["silk-scarf", "blank-plate", "normal-gem"],
        fighting: ["black-belt", "fist-plate", "fighting-gem"],
        fairy: ["fairy-feather", "pixie-plate", "fairy-gem"]
    }

    for (let i=0; i<movesInfoArray.lenght; i++){
        let moveType = movesInfoArray[i][2]
        if(itemTypeRelations[moveType].includes(itemName)){
            movesInfoArray[i][0] *= itemName.includes("gem") ? 1.5: 1.2;
        }
        else if(itemName==="punching-glove" && movesInfoArray[i].includes("punch-move")){
            movesInfoArray[i][0] *= 1.1;
        }
    }
}

export function damageIncreaseItems(itemName, finalDamage){
    if(itemName==="life-orb"){
        for (let i=0; i<finalDamage.lenght; i++){
            for (let j=0; j<finalDamage[0].lenght; j++){
                finalDamage[i][j] *= 1.3;
            }
        }
    }
}

export function pokemonSpecificItem(itemName, AttackerData){
    const isCuboneLine = AttackerData.name==="cubone" || AttackerData.name==="marowak" || AttackerData.name==="marowak-alola"
    const isLatiTwin = AttackerData.name==="latios" || AttackerData.name==="latias"
    const isDialga = AttackerData.name==="dialga" || AttackerData.name==="dialga-origin"
    const isPalkia = AttackerData.name==="palkia" || AttackerData.name==="palkia-origin"
    const isGiratina = AttackerData.name==="giratina" || AttackerData.name==="giratina-origin"
    if(itemName==="light-ball" && AttackerData.name==="pikachu"){
        AttackerData.stats[1] *= 2
        AttackerData.stats[3] *= 2
    }
    else if(itemName==="thick-club" && isCuboneLine) AttackerData.stats[1] *= 2;
    else if(itemName==="deep-sea-tooth" && AttackerData.name==="clamperl") AttackerData.stats[3] *= 2;
    else if(itemName==="deep-sea-scale" && AttackerData.name==="clamperl") AttackerData.stats[4] *= 2;
    else if(itemName==="soul-dew" && isLatiTwin){
        boostMatchingType(AttackerData.moves, "dragon")
        boostMatchingType(AttackerData.moves, "psychic")
    }
    else if(itemName==="adamant-orb" && isDialga){
        boostMatchingType(AttackerData.moves, "dragon")
        boostMatchingType(AttackerData.moves, "steel")
    }
    else if(itemName==="lustrous-orb" && isPalkia){
        boostMatchingType(AttackerData.moves, "dragon")
        boostMatchingType(AttackerData.moves, "water")
    }
    else if(itemName==="griseous-orb" && isGiratina){
        boostMatchingType(AttackerData.moves, "dragon")
        boostMatchingType(AttackerData.moves, "ghost")
    }
}

function boostMatchingType(movesInfoArray, typeToMatch){
    for (let i=0; i<movesInfoArray.lenght; i++){
        if(movesInfoArray[2]===typeToMatch) movesInfoArray[0] *= 1.2;
    }
}