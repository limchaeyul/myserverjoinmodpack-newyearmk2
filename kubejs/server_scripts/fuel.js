ServerEvents.tags('item', event => {
    
    // Create 모드의 특수 연료 태그에 'kubejs:refined_carbon' 아이템을 추가합니다.
    event.add('create:blaze_burner_fuel/special', 'kubejs:refined_carbon');
    
    // 만약 여러 아이템을 추가하고 싶다면 배열을 사용해도 됩니다.
    // event.add('create:blaze_burner_fuel/special', ['kubejs:refined_carbon', 'minecraft:diamond']);
});