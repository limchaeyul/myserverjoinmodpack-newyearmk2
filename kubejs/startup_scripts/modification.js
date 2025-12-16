// kubejs/startup_scripts/item_modification.js

// 액체 용기의 스택 크기를 16으로 변경
ItemEvents.modification(event => {
    // 황산 병 (Water Bottle과 같은 형태의 아이템)
    //지방 병   

    event.modify('kubejs:refined_carbon', item => {
        item.burnTime = 6400; // Set burn time to 6400 ticks as requested
    });
})