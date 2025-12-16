//-------------------------검티-------------------
ItemEvents.firstRightClicked('kubejs:black_ticket', event => {
    event.player.persistentData.putInt('ItemTickCounter', 0)
})


ItemEvents.rightClicked('kubejs:black_ticket', event => {
    const BLTICKETTICK = event.player.persistentData.getInt('BlackTicketTick')
    if (!(BLTICKETTICK === 0)) {
        return
    }
    const TICKCOUNT = event.player.persistentData.getInt('ItemTickCounter')
    const coordsList = global.savedCarriage2Coords;
    const targetCoord = coordsList[0];
    const targetX = targetCoord.x;
    const targetY = targetCoord.y + 1; // 1블록 위로 텔레포트
    const targetZ = targetCoord.z;
    const targetDim = targetCoord.dim; // 💥 목표 차원 ID
    event.player.persistentData.putInt('ItemTickCounter', TICKCOUNT + 1 )

    event.player.potionEffects.add('minecraft:slowness', 1*20, 255);
    if (TICKCOUNT >= 16) {
        event.player.persistentData.putInt('ItemTickCounter', 0)
        event.player.persistentData.putInt('BlackTicketTick', 300*20)
        event.player.potionEffects.add('kubejs:interference', 300*20);
        event.player.potionEffects.add('minecraft:slowness', 300*20)
        event.player.potionEffects.add('kubejs:sleepy', 300*20)
        event.player.potionEffects.add('minecraft:weakness', 300*20)
        event.player.potionEffects.add('minecraft:mining_fatigue', 300*20)
        player.runCommandSilent(`execute in ${targetDim} run tp @s ${targetX} ${targetY} ${targetZ}`);
        
    }
})


//--------------------빨티--------------------------
ItemEvents.firstRightClicked('kubejs:red_ticket', event => {
    event.player.persistentData.putInt('ItemTickCounter', 0)
})


ItemEvents.rightClicked('kubejs:red_ticket', event => {
    const TICKCOUNT = event.player.persistentData.getInt('ItemTickCounter')
    const coordsList = global.savedCarriage2Coords;
    const targetCoord = coordsList[0];
    const targetX = targetCoord.x;
    const targetY = targetCoord.y + 1; // 1블록 위로 텔레포트
    const targetZ = targetCoord.z;
    const targetDim = targetCoord.dim; // 💥 목표 차원 ID
    event.player.persistentData.putInt('ItemTickCounter', TICKCOUNT + 1 )

    event.player.potionEffects.add('minecraft:slowness', 1*20, 255);
    if (TICKCOUNT >= 16) {
        event.player.persistentData.putInt('ItemTickCounter', 0)
        player.runCommandSilent(`execute in ${targetDim} run tp @s ${targetX} ${targetY} ${targetZ}`);
        event.player.runCommand(`give @s kubejs:blank_ticket`)
        event.item.count--
    }
})

//-----------------청티---------------------
ItemEvents.firstRightClicked('kubejs:blue_ticket', event => {
    event.player.persistentData.putInt('ItemTickCounter', 0)
})


ItemEvents.rightClicked('kubejs:blue_ticket', event => {
    const TICKCOUNT = event.player.persistentData.getInt('ItemTickCounter')
    event.player.persistentData.putInt('ItemTickCounter', TICKCOUNT + 1 )

    event.player.potionEffects.add('minecraft:slowness', 1*20, 255);
    if (TICKCOUNT >= 16) {
        event.player.persistentData.putInt('NotInterferenceTick', 1800 * 20)
        event.player.persistentData.putInt('ItemTickCounter', 0)
        event.player.runCommand(`give @s kubejs:blank_ticket`)
        event.item.count--
    }
})

//-----------------청티조각---------------------
ItemEvents.firstRightClicked('kubejs:blue_ticket_freg', event => {
    event.player.persistentData.putInt('ItemTickCounter', 0)
})


ItemEvents.rightClicked('kubejs:blue_ticket_freg', event => {
    const TICKCOUNT = event.player.persistentData.getInt('ItemTickCounter')
    event.player.persistentData.putInt('ItemTickCounter', TICKCOUNT + 1 )

    event.player.potionEffects.add('minecraft:slowness', 1*20, 255);
    if (TICKCOUNT >= 16) {
        event.player.persistentData.putInt('NotInterferenceTick', 600 * 20)
        event.player.persistentData.putInt('ItemTickCounter', 0)
        event.item.count--
    }
})

//-----------------보티---------------------
ItemEvents.firstRightClicked('kubejs:purple_ticket', event => {
    event.player.persistentData.putInt('ItemTickCounter', 0)
})


ItemEvents.rightClicked('kubejs:purple_ticket', event => {
    const TICKCOUNT = event.player.persistentData.getInt('ItemTickCounter')
    event.player.persistentData.putInt('ItemTickCounter', TICKCOUNT + 1 )

    event.player.potionEffects.add('minecraft:slowness', 1*20, 255);
    if (TICKCOUNT >= 16) {
        event.player.persistentData.putInt('NotInterferenceTick', 360 * 20)
        event.player.persistentData.putInt('ItemTickCounter', 0)
        event.player.runCommand(`execute in minecraft:the_end run tp @s 0 100 0`);
        event.player.runCommand(`give @s kubejs:blank_ticket`)
        event.item.count--
    }
})