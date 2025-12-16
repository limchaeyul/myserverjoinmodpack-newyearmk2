EntityEvents.death(event => {
    if (!(event.entity.getType() == 'minecraft:player')) {
        return
    }

    const player = event.player;
    
    // 1. 마인크래프트의 기본 아이템 드랍 로직을 막습니다.
    //    이것이 없다면 모든 아이템이 기본 드랍된 후 아래 커스텀 로직이 추가로 실행됩니다.
    
    // 2. 인벤토리를 순회하며 아이템을 처리합니다.
    //    (0~35: 일반 인벤토리, 36~39: 방어구, 40: 보조 손)
    for (let i = 0; i < 41; i++) {
        let stack = player.getSlot(i).get();
        event.server.tell(`${stack.id}`);
        
        // 아이템 스택이 비어있으면 건너뜁니다.
        if (stack.empty) continue;

        // 드랍을 막을 아이템 목록 (인벤토리에 유지할 아이템)
        const itemsToKeep = [
            'minecraft:diamond',
            'kubejs:black_ticket'
            // 여기에 유지하고 싶은 다른 아이템 ID를 추가하세요.
        ];
        
        // 3. 유지 목록에 없는 아이템만 드랍합니다.
        if (!itemsToKeep.includes(stack.id)) {
            player.drop(player.getSlot(i).get(), true);
            player.inventory.setStackInSlot(i, "minecraft:air");
        }
        // else: 유지 목록에 있는 아이템(다이아몬드, 엔더 상자)은 인벤토리에 그대로 남습니다.
    }
    
    // 4. (선택 사항) 사망 위치 주변에 경험치 드랍
});