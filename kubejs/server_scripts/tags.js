// kubejs/server_scripts/tags.js (태그 추가)

ServerEvents.tags('fluid', event => {
    
    // 지방 태그 추가: 양동이와 유리병 모두 가능
    event.add('forge:fat', [
        'kubejs:fat',
    ]);
    // 지방 액체가 물병 용기에 담기도록 태그 설정 (유리병 용기)
    event.add('forge:bottles/fat', 'kubejs:fat')


    // 황산 태그 추가 (물병만 가능)
    event.add('forge:sulfuric_acid', [
        'kubejs:sulfuric_acid'
    ]);
    event.add('forge:bottles/sulfuric_acid', 'kubejs:sulfuric_acid')


    // 질산 태그 추가 (물병만 가능)
    event.add('forge:nitric_acid', [
        'kubejs:nitric_acid'
    ]);
    event.add('forge:bottles/nitric_acid', 'kubejs:nitric_acid')

    
    // 글리세롤 태그 추가 (물병만 가능)
    event.add('forge:glycerol', [
        'kubejs:glycerol'
    ]);
    event.add('forge:bottles/glycerol', 'kubejs:glycerol')

    //니트로 글리세린 태그 추가
    event.add('forge:nitroglycerin', [
        'kubejs:nitroglycerin'
    ]);
    // 니트로글리세린 액체가 물병 용기에 담기도록 태그 설정 (필수)
    event.add('forge:bottles/nitroglycerin', 'kubejs:nitroglycerin')
})