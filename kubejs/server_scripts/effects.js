//버프 디버프 처리
let COUNTER = 0;
ServerEvents.tick(event => {
    const SERVER = event.server;
    const PLAYERS = SERVER.getEntities().filter(e => e.isPlayer());
    
    const PAINKILLUUID = 'efcf043f-91a3-410e-8b81-8ef63592d81a';

    PLAYERS.forEach(player => {
        const NOWHP = player.getHealth();
        const INJURY = player.getEffect('kubejs:injury');
        const PAINKILL = player.getEffect('kubejs:painkill');

        const OVERDOTETICK = player.persistentData.getInt('OverDoteLeft');
        const ADRENALINETICK = player.persistentData.getInt('AdrenalineTick');
        const MORPHINETICK = player.persistentData.getInt('MorphineTick');
        const BLTICKETTICK = player.persistentData.getInt('BlackTicketTick');
        const NOTINTERFERENCE = player.persistentData.getInt('NotInterferenceTick')
        const DIMCHECK = player.persistentData.getBoolean('InSameDimension')

        const coordsList = global.savedCarriage2Coords;
        const targetCoord = coordsList[0];
        const targetX = targetCoord.x;
        const targetY = targetCoord.y + 1;
        const targetZ = targetCoord.z;
        const targetDim = targetCoord.dim;
        const MAXDIS = SERVER.persistentData.getInt('MaxDistance');
        const ENTITYDIM = player.level.dimension.toString()

        const XDIS = (targetX - player.x) ** 2
        const YDIS = (targetY - player.y) ** 2
        const ZDIS = (targetZ - player.z) ** 2

        const DISVECTORL = XDIS + YDIS + ZDIS
        
        COUNTER++;

        if (ENTITYDIM === targetDim) {
            player.persistentData.putBoolean('InSameDimension', true)
        } else {
            player.persistentData.putBoolean('InSameDimension', false)
        }

        if (OVERDOTETICK > 0) {
            player.persistentData.putInt('OverDoteLeft', OVERDOTETICK - 1);
        }

        if (BLTICKETTICK > 0) {
            player.persistentData.putInt('BlackTicketTick', BLTICKETTICK - 1);
        }
        
        if (ADRENALINETICK > 0) {
            player.persistentData.putInt('AdrenalineTick', ADRENALINETICK - 1);
            if (ADRENALINETICK == 1) {
                entity.potionEffects.add('minecraft:nausea', 20*20)
                entity.potionEffects.add('kubejs:sleepy', 120*20)
                entity.potionEffects.add('minecraft:slowness', 20*20)
            }
        }

        if (MORPHINETICK > 0) {
            player.persistentData.putInt('MorphineTick', MORPHINETICK - 1);
        }


        if (NOTINTERFERENCE > 0) {
            player.persistentData.putInt('NotInterferenceTick', NOTINTERFERENCE - 1);
        } else if (!(DIMCHECK && DISVECTORL < (MAXDIS ** 2))){
            player.potionEffects.add('kubejs:interference', 2)
            player.potionEffects.add('minecraft:slowness', 2)
            player.potionEffects.add('kubejs:sleepy', 2)
            player.potionEffects.add('minecraft:weakness', 2)
        }

        if (INJURY && INJURY.getDuration() >= 2 && PAINKILL && PAINKILL.getDuration() >= 2) {
                player.modifyAttribute('minecraft:generic.movement_speed', 
                        PAINKILLUUID, // UUID
                        0.90, // 90% 감소
                        "multiply_base")
            } else {
                player.modifyAttribute('minecraft:generic.movement_speed', 
                        PAINKILLUUID,
                        0,
                        "multiply_base")
            }

        

        if (NOWHP<=6) {
            player.runCommandSilent('effect give @s kubejs:sleepy 2');
        }
    });
});

//유예 시스템

EntityEvents.hurt(event => {
    
    const entity = event.entity;
    let damageAmount = event.damage;
    entity.runCommandSilent('effect clear @s minecraft:regeneration');
    
    if (entity.isPlayer()) {

        const entityeff = entity.getEffect('kubejs:hootoo'); 
        const INJURY = entity.getEffect('kubejs:injury');
        const debuffFactor = Math.floor(damageAmount / 4);
        const currentHealth = entity.getHealth(); 
        const absorptionHealth = entity.getAbsorptionAmount();
        const over_dmg = currentHealth + absorptionHealth - damageAmount
        const ENDURED = entity.persistentData.getFloat('ENDURED_DMG');

        const min = 1;
        const max = 20;
        const randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;

        //흐트시 부활차단
        if (entityeff && entityeff.getDuration() >= 2) {
            return
        }
        
        //랜덤 출혈
        let requiredRandomThreshold = -1;

        if (debuffFactor >= 3) {
            requiredRandomThreshold = 5;
        } else if (debuffFactor === 2) {
            requiredRandomThreshold = 10;
        } else if (debuffFactor === 1) {
            requiredRandomThreshold = 15;
        }

        if (requiredRandomThreshold !== -1 && randomInteger >= requiredRandomThreshold) {
            entity.potionEffects.add('kubejs:bleeding', 120*20)
        }
        //출혈 끝 ---

        //부상 메커니즘
        if (over_dmg < 0) {
            if (over_dmg >= 100){
                entity.persistentData.putFloat('ENDURED_DMG', 0);
                return
            }
            
            if (INJURY && INJURY.getDuration() >= 2) {
                entity.persistentData.putFloat('ENDURED_DMG', Math.abs(over_dmg) + ENDURED);
                entity.setHealth(1.0); 
                entity.runCommandSilent('playsound minecraft:entity.zombie.attack_wooden_door player @s ~ ~ ~ 0.7 0.7');
                if (ENDURED >= 100) {
                    entity.persistentData.putFloat('ENDURED_DMG', 0);
                    entity.setHealth(0.001);
                    return
                }
                event.cancel();
            }

            entity.persistentData.putFloat('ENDURED_DMG', Math.abs(over_dmg) + 10);
            event.player.setFoodLevel(6);
            event.player.setSaturation(0);
            entity.potionEffects.add('kubejs:injury', 300*20)
            entity.potionEffects.add('minecraft:nausea', 5*20)
            entity.potionEffects.add('minecraft:glowing', 3*20)
            entity.potionEffects.add('minecraft:slowness', 3*20, 254)
            entity.runCommandSilent('playsound minecraft:entity.zombie.attack_wooden_door player @s ~ ~ ~ 0.7 0.7');
            entity.runCommandSilent('playsound minecraft:entity.villager.hurt player @s ~ ~ ~ 0.7 0.7');
            entity.setHealth(1.0);
            event.cancel();
        }
    }
});

ItemEvents.firstRightClicked('kubejs:morphine', event => {
    event.player.persistentData.putInt('ItemTickCounter', 0)
})

ItemEvents.firstRightClicked('kubejs:adrenaline', event => {
    event.player.persistentData.putInt('ItemTickCounter', 0)
})

ItemEvents.firstRightClicked('kubejs:adrenaline', event => {
    event.player.persistentData.putInt('ItemTickCounter', 0)
})

ItemEvents.firstRightClicked('kubejs:bandage', event => {
    event.player.persistentData.putInt('ItemTickCounter', 0)
})


ItemEvents.rightClicked('kubejs:morphine', event => {
    const TICKCOUNT = event.player.persistentData.getInt('ItemTickCounter')
    const OVERDOTETICK = event.player.persistentData.getInt('OverDoteLeft')
    event.player.persistentData.putInt('ItemTickCounter', TICKCOUNT + 1 )

    event.player.potionEffects.add('minecraft:slowness', 1*20);
    if (TICKCOUNT >= 8) {
        const INJURYNOW = event.player.persistentData.getBoolean('is_injury')
        if (OVERDOTETICK > 0) {
            if (!(INJURYNOW)) {
                event.player.potionEffects.add('minecraft:poison', 10*20);
            }
        }

        event.player.heal(8)
        event.player.persistentData.putInt('OverDoteLeft', 7200);
        event.player.persistentData.putInt('MorphineTick', 3600);
        event.player.persistentData.putInt('ItemTickCounter', 0)

        event.player.potionEffects.add('kubejs:painkill', 180*20)
        
        event.item.count--
    }
})

ItemEvents.rightClicked('kubejs:adrenaline', event => {
    const TICKCOUNT = event.player.persistentData.getInt('ItemTickCounter');
    const OVERDOTETICK = event.player.persistentData.getInt('OverDoteLeft');

    event.player.persistentData.putInt('ItemTickCounter', TICKCOUNT + 1 );

    event.player.potionEffects.add('minecraft:slowness', 1*20);

    if (TICKCOUNT >= 8) {
        const INJURYNOW = event.player.persistentData.getBoolean('is_injury');
        if (OVERDOTETICK > 0) {
            if (!(INJURYNOW)) {
                event.player.potionEffects.add('minecraft:poison', 10*20);
            }
        }

        event.player.persistentData.putInt('OverDoteLeft', 7200);
        event.player.persistentData.putInt('AdrenalineTick', 3600);
        event.player.persistentData.putInt('ItemTickCounter', 0);
        event.player.potionEffects.add('kubejs:stimulant', 180*20);
        event.player.potionEffects.add('minecraft:speed', 180*20, 1);
        event.player.potionEffects.add('minecraft:haste', 180*20, 1);

        event.item.count--
    }
})

ItemEvents.rightClicked('kubejs:medikit', event => {
    const TICKCOUNT = event.player.persistentData.getInt('ItemTickCounter')

    event.player.persistentData.putInt('ItemTickCounter', TICKCOUNT + 1 )

    event.player.potionEffects.add('minecraft:slowness', 1*20);

    if (TICKCOUNT >= 8) {

        event.player.persistentData.putInt('ItemTickCounter', 0)
        event.player.heal(4)
        event.player.potionEffects.add('minecraft:regeneration', 10*20)

        event.item.count--
    }
})

ItemEvents.rightClicked('kubejs:bandage', event => {
    const TICKCOUNT = event.player.persistentData.getInt('ItemTickCounter')

    event.player.persistentData.putInt('ItemTickCounter', TICKCOUNT + 1 )

    event.player.potionEffects.add('minecraft:slowness', 1*20);

    if (TICKCOUNT >= 20) {

        event.player.persistentData.putInt('ItemTickCounter', 0)
        event.player.heal(1)
        event.player.potionEffects.add('minecraft:regeneration', 20*20)
        event.player.runCommandSilent('effect clear @s kubejs:bleeding');

        event.item.count--
    }
})