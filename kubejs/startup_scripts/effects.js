StartupEvents.registry('mob_effect', event => {
    const INJURY = "kubejs_injury";
    const INJURY_UUID = '45170eb4-dda9-4f2c-bc9f-5e8a59de0cbd';
    
    event.create('injury') 
        .harmful() 
        .color(0x292929) 
        
        // 90% 이동 속도 감소 속성
        .modifyAttribute('minecraft:generic.movement_speed', 
                        INJURY_UUID, // UUID
                        -0.90, // 90% 감소
                        "multiply_base") // Operation: 기본 속도에 곱하여 적용

        .effectTick((entity, lvl) => {
            const eff = entity.getEffect('kubejs:injury');
            const currentHealth = entity.getHealth(); 
            const currentFood = entity.getFoodLevel();
            const absorptionHealth = entity.getAbsorptionAmount();
            const ENDURED = entity.persistentData.getFloat('ENDURED_DMG');
            const PAINKILL = entity.persistentData.getBoolean('is_painkill')

            if (entity.isPlayer() && eff && eff.getDuration() >= 2) {
                entity.persistentData.putBoolean('is_injury', true)

                if (currentFood>16) {
                    entity.setFoodLevel(16);
                }

                if (!PAINKILL) {
                    entity.runCommandSilent('effect give @s minecraft:jump_boost 2 252');
                }
                
                if (eff.getDuration() >= 5800){
                    return
                }
                if (currentHealth >= 2.0){
                    let ENDURED_RE = entity.persistentData.getFloat('ENDURED_DMG');
                    entity.persistentData.putFloat('ENDURED_DMG', (ENDURED_RE - (currentHealth - 1.0)));
                    entity.setHealth(1.0);
                } 
                if (absorptionHealth >= 0){
                    let ENDURED_RE = entity.persistentData.getFloat('ENDURED_DMG');
                    entity.persistentData.putFloat('ENDURED_DMG', (ENDURED_RE - absorptionHealth));

                    entity.setAbsorptionAmount(0.0);
                }
                if (ENDURED <= 0){
                    entity.persistentData.putFloat('ENDURED_DMG', 0);
                    entity.runCommandSilent('effect clear @s kubejs:injury');
                    entity.persistentData.putBoolean('is_injury', false)
                    entity.runCommandSilent('effect give @s kubejs:hootoo 900');
                }
            } else {
                if (ENDURED > 0) {
                    entity.persistentData.putFloat('ENDURED_DMG', 0);
                    entity.persistentData.putBoolean('is_injury', false)
                    entity.runCommandSilent('effect give @s kubejs:hootoo 1');
                    entity.kill();
                } else {
                    entity.persistentData.putFloat('ENDURED_DMG', 0);
                    entity.persistentData.putBoolean('is_injury', false)
                    entity.runCommandSilent('effect give @s kubejs:hootoo 900');
                }
            }
        })
        

    event.create('painkill') 
        .beneficial() 
        .color(0x21DE00)
        .effectTick((entity, lvl) => {
            const eff = entity.getEffect('kubejs:painkill');

            if (entity.isPlayer() && eff && eff.getDuration() >= 2) {
                entity.persistentData.putBoolean('is_painkill', true)
            } else {
                entity.persistentData.putBoolean('is_painkill', false)
            }
        }) 

    event.create('stimulant') 
        .beneficial() 
        .color(0xF5E100) 
        
    event.create('hootoo') 
        .harmful()
        .color(0xF5E100) 

    event.create('sleepy') 
        .harmful()
        .color(0x454545) 
        
        .effectTick((entity, lvl) => {
            let COUNTER = entity.persistentData.getInt('sleepy_counter_id');
            const STIMULANT = entity.getEffect('kubejs:stimulant');
            const SLEEPY = entity.getEffect('kubejs:sleepy');
            entity.persistentData.putInt('sleepy_counter_id', COUNTER + 1);
            if (COUNTER % 100 === 0 && SLEEPY && SLEEPY.getDuration() >= 2) {
                if (STIMULANT && STIMULANT.getDuration() >= 1){
                    entity.persistentData.putInt('sleepy_counter_id', 1);
                    return
                    
                }
                entity.runCommandSilent('effect give @s minecraft:blindness 2');
                entity.runCommandSilent('effect give @s minecraft:darkness 2');
                entity.persistentData.putInt('sleepy_counter_id', 1);
            }
        })

    event.create('bleeding') 
        .harmful()
        .color(0xD41500) 
        .effectTick((entity, lvl) => {
            let COUNTER = entity.persistentData.getInt('bleeding_counter_id')
            entity.persistentData.putInt('bleeding_counter_id', COUNTER + 1);
            const BLEEDING = entity.getEffect('kubejs:bleeding');
            if (COUNTER % 100 === 0 && BLEEDING && BLEEDING.getDuration() >= 2) {
                if (entity.persistentData.getBoolean('is_injury')){
                    return
                }
                entity.runCommandSilent('damage @s 1 minecraft:magic');
                entity.persistentData.putInt('bleeding_counter_id', 1);
            }
        })

    event.create('infaction') 
        .harmful()
        .color(0x004487) 

    event.create('interference') 
        .harmful()
        .color(0x666666) 
        .effectTick((entity, lvl) => {
            let COUNTER = entity.persistentData.getInt('interference_counter_id')
            entity.persistentData.putInt('interference_counter_id', COUNTER + 1);
            const INFERFERENCE = entity.getEffect('kubejs:interference');
            if (COUNTER % 200 === 0 && INFERFERENCE && INFERFERENCE.getDuration() >= 2) {
                const z_component = Math.random() * 2 - 1; // -1에서 1 사이의 랜덤 cos(phi)
                if (z_component > 1) z_component = 1;
                if (z_component < -1) z_component = -1;
                const phi = Math.acos(z_component); // 극각 (0 ~ π)
                const TWO_PI = 6.283185307179586;
                const theta = Math.random() * TWO_PI;
                const n = Math.random() * 3

                // 2. 단위 벡터의 성분 계산
                const sin_phi = Math.sin(phi);

                const ux = sin_phi * Math.cos(theta);
                const uy = sin_phi * Math.sin(theta);
                const uz = z_component; // Math.cos(phi)

                // 3. 길이 n을 곱하여 최종 벡터 생성
                const vx = n * ux;
                const vy = n * uy;
                const vz = n * uz;
                entity.runCommandSilent(`playsound minecraft:block.end_portal_frame.fill player @a ~ ~ ~ 2 0.5`);
                entity.runCommandSilent(`tp ${entity.x + vx} ${entity.y + vy} ${entity.z + vz}`);
                entity.persistentData.putInt('interference_counter_id', 1);
            }
        })
    });
    