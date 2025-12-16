
ServerEvents.recipes(event => {
    const FIREWORK_ROCKET = 'minecraft:firework_rocket';
    const COMPRESSED_GUNPOWDER = 'kubejs:compressed_gunpowder';
    
    // 1. 기존의 모든 폭죽 로켓 조합법을 제거합니다.
    event.remove({ output: FIREWORK_ROCKET });

    // 2. 새로운 폭죽 로켓 조합법을 추가합니다.
    // 폭죽탄 유무에 관계없이 조합 가능하도록 바닐라와 유사하게 변경합니다.
    // KubeJS는 재료에 폭죽탄이 포함되면 자동으로 NBT를 완제품 로켓에 복사합니다.
    // 비행 시간은 화약의 양에 따라 결정되어야 하므로, 출력 아이템에 NBT로 명시적으로 지정합니다.

    // --- 폭죽탄 없는 조합법 (Shapeless) ---

    // 비행 시간 1
    event.shapeless(Item.of(FIREWORK_ROCKET, '{Fireworks:{Flight:1b}}'), [
        'minecraft:paper',
        COMPRESSED_GUNPOWDER
    ]).id('kubejs:plain_rocket_1');
    
    // 비행 시간 2
    event.shapeless(Item.of(FIREWORK_ROCKET, '{Fireworks:{Flight:2b}}'), [
        'minecraft:paper',
        COMPRESSED_GUNPOWDER,
        COMPRESSED_GUNPOWDER
    ]).id('kubejs:plain_rocket_2');

    // 비행 시간 3
    event.shapeless(Item.of(FIREWORK_ROCKET, '{Fireworks:{Flight:3b}}'), [
        'minecraft:paper',
        COMPRESSED_GUNPOWDER,
        COMPRESSED_GUNPOWDER,
        COMPRESSED_GUNPOWDER
    ]).id('kubejs:plain_rocket_3');

    // --- 폭죽탄 있는 조합법 (Shapeless) ---
    // 참고: 바닐라 조합법은 종이 1개, 화약 1~3개, 별 1~7개를 사용합니다.
    // 여기서는 별 1개만 사용하는 것으로 단순화합니다.

    // 비행 시간 1 + 폭죽탄
    event.shapeless(Item.of(FIREWORK_ROCKET, '{Fireworks:{Flight:1b}}'), [
        'minecraft:paper',
        'minecraft:firework_star',
        COMPRESSED_GUNPOWDER
    ]).id('kubejs:star_rocket_1');

    // 비행 시간 2 + 폭죽탄
    event.shapeless(Item.of(FIREWORK_ROCKET, '{Fireworks:{Flight:2b}}'), [
        'minecraft:paper',
        'minecraft:firework_star',
        COMPRESSED_GUNPOWDER,
        COMPRESSED_GUNPOWDER
    ]).id('kubejs:star_rocket_2');

    // 비행 시간 3 + 폭죽탄
    event.shapeless(Item.of(FIREWORK_ROCKET, '{Fireworks:{Flight:3b}}'), [
        'minecraft:paper',
        'minecraft:firework_star',
        COMPRESSED_GUNPOWDER,
        COMPRESSED_GUNPOWDER,
        COMPRESSED_GUNPOWDER
    ]).id('kubejs:star_rocket_3');
});
