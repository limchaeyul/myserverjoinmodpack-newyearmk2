ServerEvents.recipes(event => {
    // === Constant Definitions ===
    const COMPRESSED = 'kubejs:compressed_gunpowder';
    const GUNPOWDER = 'minecraft:gunpowder';
    const CATALYST = 'kubejs:catalyst';
    const SULFURIC_ACID = 'kubejs:sulfuric_acid';
    const KNO3 = 'kubejs:kno3';
    const LIMESTONE = 'create:limestone';
    const BASE_ID = 'kubejs:kno3_from_limestone';
    const NITRIC_ACID = 'kubejs:nitric_acid';
    const FAT = 'kubejs:fat';
    const GLYCEROL = 'kubejs:glycerol';
    const PORKCHOP = 'minecraft:porkchop';
    const NITROGLYCERIN = 'kubejs:nitroglycerin';
    const NITROCELLULOSE = 'kubejs:nitrocellulose';
    const PAPER = 'minecraft:paper';
    const SMOKELESS_GUNPOWDER = 'kubejs:smokeless_gunpowder';
    const REDSTONE = 'minecraft:redstone';
    const CHARCOAL = 'minecraft:charcoal';
    const SMALL = 'kubejs:small_warhead';
    const MEDIUM = 'kubejs:medium_warhead';
    const LARGE = 'kubejs:large_warhead';
    const SMALL_WARHEAD = 'kubejs:small_warhead';
    const COPPER_NUGGET = 'tconstruct:copper_nugget';
    const MEDIUM_WARHEAD = 'kubejs:medium_warhead';
    const LARGE_WARHEAD = 'kubejs:large_warhead';
    const BRASS_SHEET = 'create:brass_sheet';
    const MIXED_ACID = 'kubejs:mixed_acid';
    const WATER = 'minecraft:water';
    const REFINED_CARBON = 'kubejs:refined_carbon';
    const COAL = 'minecraft:coal';
    const DRIPSTONE_BLOCK = 'minecraft:dripstone_block';

    const IRON_ORES = [
        'minecraft:iron_ore',
        'minecraft:deepslate_iron_ore',
        'minecraft:raw_iron',
        'minecraft:raw_iron_block'
    ];

    const SULFUR_INPUTS = [
        'burnt:sulphur'
    ];

    // Remove Iron Crushing Recipes
    IRON_ORES.forEach(item_id => {
        event.remove({
            type: 'create:crushing', 
            input: item_id 
        });
    })
    
    // Gunpowder Removal and Compressed Gunpowder Recipe
    // Remove Shapeless Gunpowder Crafting
    event.remove({
        output: 'minecraft:gunpowder',
        type: 'minecraft:crafting_shapeless'
    })

        event.remove({
        id: 'create:milling/dripstone_block'
    })

    event.remove({
        id: 'tacz:gun_smith_table'
    })

    event.remove({
        id: 'tacz:ammo_workbench'
    })

    event.remove({
        id: 'tacz:attachment_workbench'
    })

    event.recipes.createMilling(
        [Item.of(KNO3, 1)],
        DRIPSTONE_BLOCK
    ).id(`${BASE_ID}_milling_dripstone`);

    // Crusher
    event.recipes.createCrushing(
        [Item.of(KNO3, 2)],
        DRIPSTONE_BLOCK
    ).id(`${BASE_ID}_crushing_dripstone`);


    // Compressed Gunpowder Recipe
    event.shaped(
        Item.of(COMPRESSED, 1),
        ['AAA', 'AAA', 'AAA'],
        {A: GUNPOWDER}
    ).id('kubejs:compressed_gunpowder_crafting');
    
    // Decompression Recipe (Shapeless)
    event.shapeless(
        Item.of(GUNPOWDER, 9),
        [COMPRESSED]
    ).id('kubejs:gunpowder_decompression');
    
    // Potassium Nitrate Crushing Recipe
    
    // Millstone
    event.recipes.createMilling(
        [Item.of(KNO3, 1)],
        LIMESTONE
    ).id(`${BASE_ID}_milling_limestone`);

    // Crusher
    event.recipes.createCrushing(
        [Item.of(KNO3, 2)],
        LIMESTONE
    ).id(`${BASE_ID}_crushing_limestone`);
    
    // === 3. Catalyst Crushing Recipe  ===
    IRON_ORES.forEach(input => {
        event.recipes.createCrushing(
            [Item.of(CATALYST, 2)],
            input
        ).id(`kubejs:catalyst_crushing_add_${input.replace(':', '_')}`);
    });
    
    // === 4. Sulfuric Acid Recipe (Error Fix: Separate SULFUR_INPUTS array) ===
    
    // Recipe 1: Using burnt:sulphur
    event.recipes.createMixing(
        [
            Fluid.of(SULFURIC_ACID, 500),
            Item.of(CATALYST).withChance(0.8),
        ],
        [
            CATALYST,
            SULFUR_INPUTS[0],
            Fluid.of(WATER, 450)
        ]
    ).heated().id('kubejs:sulfuric_acid_production_burnt');
    
    // === 5. 질산 레시피 ===
    event.recipes.createMixing(
        [
            Fluid.of(NITRIC_ACID, 500),
            'minecraft:bone_meal'
        ],
        [
            Fluid.of(SULFURIC_ACID, 500),
            KNO3
        ]
    ).id('kubejs:nitric_acid_production');
    
    // === 6. 지방 레시피 ===
    event.recipes.createMixing(
        [
            Fluid.of(FAT, 1000),
            'minecraft:bone_meal'
        ],
        [PORKCHOP]
    ).heated().id('kubejs:fat_from_porkchop');
    
    // === 7. 글리세롤 레시피 ===
    event.recipes.createMixing(
        Fluid.of(GLYCEROL, 100),
        Fluid.of(FAT, 500)
    ).heated().id('kubejs:glycerol_production_from_fat');
    
    // === 8. 혼산 ===
    event.recipes.createMixing(
        Fluid.of(MIXED_ACID, 150),
        [
            Fluid.of(SULFURIC_ACID, 50),
            Fluid.of(NITRIC_ACID, 100)
        ]
    ).id('kubejs:nitroglycerin_production');

    // === 9. 니트로글리세린 레시피 ===
    event.recipes.createMixing(
        [
            Fluid.of(NITROGLYCERIN, 175),
            Fluid.of(SULFURIC_ACID, 25)
        ],
        [
            Fluid.of(MIXED_ACID, 200),
            Fluid.of(GLYCEROL, 75),
        ]
    ).id('kubejs:nitrocglycerin_production');
    
    // === 9. 니트로셀룰로오스 레시피 ===
    event.recipes.createMixing(
        [
            NITROCELLULOSE,
        ],
        [
            Fluid.of(MIXED_ACID, 200),
            PAPER,
        ]
    ).id('kubejs:nitrocellulose_production');
    
    // === 10. 무연화약 레시피 ===
    event.recipes.createCompacting(
        SMOKELESS_GUNPOWDER,
        [
            Fluid.of(NITROGLYCERIN, 100),
            NITROCELLULOSE,
            Fluid.of(FAT, 50),
            REDSTONE
        ]
    ).heated().id('kubejs:smokeless_gunpowder_production');
    
    // === 11. 화약 레시피 (무형 조합) ===
    // 숯 + burnt:sulphur
    event.shapeless(
        Item.of(GUNPOWDER, 4),
        [KNO3, '2x ' + CHARCOAL, '2x ' + SULFUR_INPUTS[0]]
    ).id('kubejs:gunpowder_from_kno3_burnt');
    
    
    // === 12. 탄두 압축 레시피 ===
    event.recipes.createCompacting(
        Item.of(SMALL, 9),
        ['minecraft:iron_ingot', 'minecraft:copper_ingot']
    ).id('kubejs:small_warhead_compacting');
    
    event.recipes.createCompacting(
        Item.of(MEDIUM, 5),
        ['3x tconstruct:debris_nugget', 'minecraft:diamond']
    ).id('kubejs:medium_warhead_compacting');
    
    event.recipes.createCompacting(
        Item.of(LARGE, 1),
        ['tconstruct:manyullyn_nugget', 'minecraft:iron_nugget', 'tconstruct:copper_nugget']
    ).id('kubejs:large_warhead_compacting');

    // === 13. 탄약 압축 레시피 ===

    // 소구경 탄약 (Compact Ammo)
    const COMPACT_AMMO = Item.of('tacz:ammo', {AmmoId: "hamster:compact_ammo"});
    event.recipes.createCompacting(
        COMPACT_AMMO,
        [SMALL_WARHEAD, '5x ' + GUNPOWDER, COPPER_NUGGET]
    ).id('kubejs:compact_ammo_production');

    // 중구경 탄약 (Medium Ammo)
    const MEDIUM_AMMO = Item.of('tacz:ammo', {AmmoId: "hamster:medium_ammo"});
    event.recipes.createCompacting(
        MEDIUM_AMMO,
        [
            '5x ' + GUNPOWDER,
            MEDIUM_WARHEAD,
            '2x ' + SMOKELESS_GUNPOWDER
        ]
    ).id('kubejs:medium_ammo_production');

    //대구경 탄약
    const LONG_AMMO = Item.of('tacz:ammo', {AmmoId: "hamster:long_ammo"});
    event.recipes.createCompacting(
        LONG_AMMO,
        [LARGE_WARHEAD, '6x ' + SMOKELESS_GUNPOWDER, BRASS_SHEET]
    ).id('kubejs:long_ammo_production');

    //정제탄소 - 녹은탄소
    // GEMINI-NOTE: This melting recipe has been moved to a data pack to fix loading issues.
    // It is now located at: /datapacks/kubejs_datapack/data/tconstruct/recipes/melting/refined_carbon.json

    //녹은 탄소 - 정제 탄소
    // GEMINI-NOTE: This casting recipe has been moved to a data pack to fix loading issues.
    // It is now located at: /datapacks/kubejs_datapack/data/tconstruct/recipes/casting/refined_carbon_ingot.json

    event.smoking(
        REFINED_CARBON, 
        COAL
    )
    .xp(1.0)
    .cookingTime(1600) 
    .id('kubejs:smoker/refined_carbon_from_coal');

        // 합금 레시피 추가: 액체 탄소 1 : 액체 철 2 -> 액체 강철 3
    // GEMINI-NOTE: This alloy recipe has been moved to a data pack to fix loading issues.
    // It is now located at: /datapacks/kubejs_datapack/data/tconstruct/recipes/alloy/liquid_steel.json
    
});