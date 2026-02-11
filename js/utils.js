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

export function isTouchingGround(AttackerData){
    return !AttackerData.types.includes("flying") || !AttackerData.item==="air-balloon"
}

export function isConctactMove(comparingMoveName, comparingMoveCategory){
    const psysicalNotContactList = ["aqua-cutter", "attack-order", "aura-wheel", "barb-barrage",
        "barrage", "beak-blast", "beat-up", "bone-club", "bone-rush", "bonemerang",
        "bulldoze", "bullet-seed", "diamond-storm", "dragon-darts", "drum-beating",
        "earthquake", "egg-bomb", "explosion", "feint", "fissure", "fling", "flower-trick",
        "freeze-shock", "fusion-bolt", "gigaton-hammer", "glacial-lance", "grav-apple",
        "gunk-shot", "hyperspace-fury", "ice-shard", "icicle-crash", "icicle-spear",
        "ivy-cudgel", "lands-wrath", "last-respects", "leafage", "magnet-bomb", "magnitude",
        "metal-burst", "meteor-assault", "mountain-gale", "natural-gift", "order-up",
        "pay-day", "petal-blizzard", "pin-missile", "poison-sting", "poltergeist",
        "precipice-blades", "present", "psycho-cut", "pyro-ball", "raging-fury", "razor-leaf",
        "rock-blast", "rock-slide", "rock-throw", "rock-tomb", "rock-wrecker", "sacred-fire",
        "salt-cure", "sand-tomb", "scale-shot", "secret-power", "seed-bomb", "self-destruct",
        "shadow-bone", "sky-attack", "smack-down", "spike-cannon", "spirit-shackle", "stone-edge",
        "thousand-arrows", "thousand-waves", "triple-arrows", "twineedle"
    ]
    const specialDoesContactList = ["petal-dance", "trump-card", "wring-out", "grass-knot",
        "draining-kiss", "infestation", "electro-drift"
    ]
    const psysicalContact = !psysicalNotContactList.includes(comparingMoveName) && comparingMoveCategory==="psysical"
    const specialContact = specialDoesContactList.includes(comparingMoveName) && comparingMoveCategory==="special"
    return psysicalContact || specialContact
}

export function isPunchingMove(comparingMoveName){
    const punchList = ["headlong-rush", "surging-strikes", "double-iron-bash",
        "sky-uppercut", "wicked-blow", "hammer-arm", "ice-hammer", "mega-punch",
        "bullet-punch", "focus-punch", "comet-punch", "dynamic-punch", "drain-punch",
        "fire-punch", "rage-fist", "ice-punch", "power-up-punch", "jet-punch", "dizzy-punch",
        "meteor-mash", "shadow-punch", "thunder-punch", "plasma-fists", "mach-punch"
    ]
    return punchList.includes(comparingMoveName)
}

export function isSoundMove(comparingMoveName){
    const soundList = ["snarl", "uproar", "overdrive", "sparkling-aria", "howl",
        "round", "sing", "relic-song", "torch-song", "alluring-voice", "perish-song",
        "heal-bell", "chatter", "screech", "confide", "eerie-spell", "metal-sound",
        "echoed-voice", "boomburst", "clangorous-soul", "clanging-scales", "growl",
        "psychic-noise", "snore", "roar", "noble-roar", "grass-whistle", "supersonic",
        "parting-shot", "disarming-voice", "hyper-voice", "bug-buzz"
    ]
    return soundList.includes(comparingMoveName)
}

export function isWindMove(comparingMoveName){
    const windList = ["air-cutter", "twister", "springtide-storm", "wildbolt-storm",
        "heat-wave", "whirlwind", "sandsear-storm", "sandstorm", "petal-blizzard",
        "gust", "hurricane", "bleakwind-storm", "blizzard", "tailwind", "fairy-wind",
        "icy-wind"
    ]
    return windList.includes(comparingMoveName)
}

export function isPowderMove(comparingMoveName){
    const powderList = ["spore", "cotton-spore", "stun-spore", "powder", "rage-powder",
        "magic-powder", "poison-powder", "sleep-powder"
    ]
    return powderList.includes(comparingMoveName)
}

export function isPulseMove(comparingMoveName){
    const pulseList = ["aura-sphere", "water-pulse", "heal-pulse", "terrain-pulse",
        "dragon-pulse", "origin-pulse", "dark-pulse"
    ]
    return pulseList.includes(comparingMoveName)
}

export function isProyectileMove(comparingMoveName){
    const proyectileList = ["pyro-ball", "pollen-puff", "ice-ball", "mist-ball", "shadow-ball",
        "electro-ball", "acid-spray", "syrup-bomb", "mud-bomb", "seed-bomb", "egg-bomb",
        "searing-shot", "magnet-bomb", "sludge-bomb", "zap-cannon", "energy-ball", "aura-sphere",
        "gyro-ball", "weather-ball", "focus-blast", "rock-blast", "beak-blast", "octozooka",
        "rock-wrecker", "bullet-seed"
    ]
    return proyectileList.includes(comparingMoveName)
}

export function isCuttingMove(comparingMoveName){
    const cutList = ["air-cutter", "razor-shell", "cut", "fury-cutter", "solar-blade",
        "slash", "bitter-blade", "sacred-sword", "mighty-cleave", "kowtow-cleave",
        "aerial-ace", "stone-axe", "razor-leaf", "leaf-blade", "population-bomb",
        "psycho-cut", "psyblade", "secret-sword", "aqua-cutter", "air-slash", "ceasless-edge",
        "behemoth-blade", "tachyon-cutter", "night-slash", "x-scissor", "cross-poison"
    ]
    return cutList.includes(comparingMoveName)
}

export function isBiteMove(comparingMoveName){
    const biteList = ["fishious-rend", "ice-fang", "fire-fang", "thunder-fang",
        "poison-fang", "hyper-fang", "bite", "jaw-lock", "psychic-fangs", "crunch"
    ]
    return biteList.includes(comparingMoveName)
}

export function isDanceMove(comparingMoveName){
    const danceList = ["aqua-step", "quiver-dance", "teeter-dance", "revelation-dance",
        "dragon-dance", "sword-dance", "fiery-dance", "lunar-dance", "petal-dance",
        "feather-dance", "victory-dance", "clangorous-soul"
    ]
    return danceList.includes(comparingMoveName)
}

export function isTrappingMove(comparingMoveName){
    const trapList = ["infestation", "bind", "sand-tomb", "snap-trap", "wrap",
        "thunder-cage", "fire-spin", "magma-storm", "clamp", "whirlpool"
    ]
    return trapList.includes(comparingMoveName)
}

export function isExplosiveMove(comparingMoveName){
    const explosiveList = ["self-destruct", "misty-explosion", "mind-blown", "explosion"]
    return explosiveList.includes(comparingMoveName)
}

export function inverseArguments(allPokemon, damageContext){
    const inversedPokemon = [...allPokemon].reverse()
    const inversedContext = Array.from(damageContext).map(contextArray => [...contextArray].reverse())

    return {inversedPokemon: inversedPokemon, inversedContext: inversedContext}
}

export function howManyStatChanges(statElement){
    const everyStat = statElement.rows
    let totalStatChanges = 0

    for (let i=1;i<everyStat.length;i++){
        let isPositive = parseFloat(everyStat[i].cells[3].children[0].value)>1;
        if (isPositive) {
            let select = everyStat[i].cells[3].children[0]
            let statChanges = parseInt(select.options[select.selectedIndex].text.slice(1))
            totalStatChanges += statChanges
        }
    }
    return totalStatChanges
}