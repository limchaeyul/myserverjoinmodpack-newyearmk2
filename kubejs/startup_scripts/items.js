StartupEvents.registry('item', event => {
    //압축화약 추가
    event.create('compressed_gunpowder')
        .displayName('압축 화약') // 아이템 이름 설정 (lang 파일로 덮어쓰기 가능)
        .maxStackSize(16) // 최대 스택을 16개로 설정
        
        .modelJson({ 
            parent: 'minecraft:item/generated',
            textures: {
                layer0: 'minecraft:item/gunpowder' // 바닐라 화약 텍스처 경로
            }
        });
    //압축화약 끝

    //질산칼륨 추가
    event.create('kno3')
        .displayName('질산칼륨') // 아이템 이름 설정
        .maxStackSize(64)
        
        // 텍스처를 마인크래프트 기본 설탕 텍스처로 사용하도록 설정
        .modelJson({ 
            parent: 'minecraft:item/generated',
            textures: {
                layer0: 'minecraft:item/sugar' // 바닐라 설탕 텍스처 경로
            }
        });
    //질산칼륨 끝

    //촉매
    event.create('catalyst')
        .displayName('촉매') // 아이템 이름 설정
        .maxStackSize(16)   // 최대 스택 16개 유지
        
        // ✨ 텍스처를 마인크래프트 기본 발광석 가루 텍스처로 변경
        .modelJson({ 
            parent: 'minecraft:item/generated',
            textures: {
                layer0: 'minecraft:item/glowstone_dust' // 발광석 가루 텍스처 경로
            }
        });
    //촉매 끝

    //니트로셀룰로오스
    event.create('nitrocellulose')
        .displayName('니트로셀룰로오스')
        .maxStackSize(64)
        
        .modelJson({ 
            parent: 'minecraft:item/generated',
            textures: {
                layer0: 'minecraft:item/map'
            }
        });
    //니트로셀룰로오스 끝

    //무연화약
    event.create('smokeless_gunpowder')
        .displayName('무연화약') 
        .maxStackSize(48)
        .rarity('uncommon')
        
        // 텍스처를 마인크래프트 기본 화약(gunpowder) 텍스처로 사용하도록 설정
        .modelJson({ 
            parent: 'minecraft:item/generated',
            textures: {
                layer0: 'minecraft:item/gunpowder' // 바닐라 화약 텍스처 경로
            }
        });
    //무연화약 끝

    //소구경 탄두
    event.create('small_warhead')
        .displayName('소구경 탄두')
        .maxStackSize(64) // 64 스택
        .rarity('common') // 기본 희귀도 (흰색)
        // 텍스처: 철 조각 (minecraft:nugget/iron)
        .modelJson({ 
            parent: 'minecraft:item/generated',
            textures: {
                layer0: 'minecraft:item/iron_nugget' 
            }
        });
        
    //중구경 탄두
    event.create('medium_warhead')
        .displayName('중구경 탄두')
        .maxStackSize(48)
        .rarity('uncommon')
        // 텍스처: 금 조각 (minecraft:nugget/gold)
        .modelJson({ 
            parent: 'minecraft:item/generated',
            textures: {
                layer0: 'minecraft:item/gold_nugget' 
            }
        });
        
    //대구경 탄두
    event.create('large_warhead')
        .displayName('대구경 탄두')
        .maxStackSize(32) // 32 스택
        .rarity('rare') // Rare 희귀도 (노란색)
        // 텍스처: 디스크 조각 5 (minecraft:disc_fragment_5)
        .modelJson({ 
            parent: 'minecraft:item/generated',
            textures: {
                layer0: 'minecraft:item/disc_fragment_5' 
            }
        });

    //정제 탄소
    event.create('refined_carbon')
        .displayName('정제 탄소')
        .maxStackSize(64)
        .modelJson({ 
            parent: 'minecraft:item/generated',
            textures: {
                layer0: 'minecraft:item/coal' 
            }
        })
        .color(0, 0xAFFFFFFF);

    event.create('morphine')
        .displayName('모르핀 주사')
        .unstackable()
        .texture('kubejs:item/morphine')

    event.create('adrenaline')
        .displayName('아드레날린 주사')
        .unstackable()
        .texture('kubejs:item/adrenaline')

    event.create('medikit')
        .displayName('의료 주사기')
        .maxStackSize(2)
        .texture('kubejs:item/medikit')

    event.create('bandage')
        .displayName('붕대')
        .maxStackSize(10)
        .texture('kubejs:item/bandage')


    event.create('coffee')
        .displayName('커피')
        .unstackable()
        .texture('kubejs:item/coffee')
        .useAnimation('drink')
        .food(food => {
            food
            .hunger(2)
            .saturation(4)
            .alwaysEdible() 
            .effect('kubejs:stimulant', 180*20, 0, 1)
            .effect('farmersdelight:comfort', 180*20, 0, 1)
        })


    event.create('harddrink')
        .displayName('술')
        .unstackable()
        .texture('kubejs:item/harddrink')
        .useAnimation('drink')
        .food(food => {
            food
            .hunger(2)
            .saturation(4)
            .alwaysEdible() 
            .effect('kubejs:painkill', 240*20, 0, 1)
            .effect('minecraft:nausea', 60*20, 0, 1)
            .effect('minecraft:blindness', 30*20, 0, 1)
        })

    event.create('blank_ticket')
        .displayName('빈 티켓')
        .unstackable()
        .texture('kubejs:item/blank_ticket')

    event.create('black_ticket')
        .displayName('흑색 티켓')
        .unstackable()
        .texture('kubejs:item/black_ticket')

    event.create('blue_ticket')
        .displayName('청색 티켓')
        .unstackable()
        .texture('kubejs:item/blue_ticket')

    event.create('purple_ticket')
        .displayName('자색 티켓')
        .unstackable()
        .texture('kubejs:item/purple_ticket')

    event.create('blue_ticket_freg')
        .displayName('청색 티켓 조각')
        .maxStackSize(3)
        .texture('kubejs:item/blue_ticket_freg')

    event.create('red_ticket')
        .displayName('적색 티켓')
        .maxStackSize(3)
        .texture('kubejs:item/red_ticket')

});