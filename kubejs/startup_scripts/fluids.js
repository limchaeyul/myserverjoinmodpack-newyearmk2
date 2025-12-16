StartupEvents.registry('fluid', event => {
    
    // (RGBA 색상 값: R, G, B, A (0~1))
    
    // 지방 (Fat)
    event.create('fat')
        .displayName('지방')
        .tag('fat')
        .viscosity(3000)
        .density(2000)
        .color(0x6BFFB800)
        .thickTexture(0x6BFFB800);
    
    // 황산 (Sulfuric_Acid)
    event.create('sulfuric_acid')
        .displayName('황산')
        .tag('sulfuric_acid')
        .noBlock()
        .color(0x0AFFFFFF)
        .thinTexture(0x0AFFFFFF);
    
    // 질산 (Nitric_Acid)
    event.create('nitric_acid')
        .displayName('질산')
        .tag('nitric_acid')
        .noBlock()
        .color(0x0AFFFFFF)
        .thinTexture(0x0AFFFFFF);
    
    // 글리세롤 (Glycerol)
    event.create('glycerol')
        .displayName('글리세롤')
        .tag('glycerol')
        .noBlock()
        .color(0x0AFFFFFF)
        .thinTexture(0x0AFFFFFF); 

    // 니트로글리세린
    event.create('nitroglycerin')
        .displayName('니트로글리세린')
        .tag('nitroglycerin') 
        .noBlock()
        .color(0x0AFFFFFF)
        .thinTexture(0x0AFFFFFF);

    //혼산
    event.create('mixed_acid')
        .displayName('혼산')
        .tag('mixed_acid')
        .noBlock()
        .color(0x0AFFFFFF)
        .thinTexture(0x0AFFFFFF);

    //정제 탄소
    event.create('liquid_carbon')
        .displayName('정제 탄소')
        .tag('liquid_carbon')
        .viscosity(7000)
        .density(4000)
        .noBlock()
        .color(0x242424)
        .thickTexture(0x242424)
        .temperature(1300);
});