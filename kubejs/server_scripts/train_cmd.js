// KubeJS/server_scripts/train_cmd.js (차원 정보 통합)

// --- 영구 저장소 키 정의 ---
const TRAIN_ID_KEY = 'saved_train_ids_index_five';
const COORDS_KEY = 'saved_carriage_2_coords';

// ----------------------------------------------------------------------
// 1. 서버 시작/종료 이벤트: 데이터 영구 저장/로드
// ----------------------------------------------------------------------

ServerEvents.loaded(event => {
    const server = event.server;
    
    // Train ID 목록 로드
    const savedIds = server.data.get(TRAIN_ID_KEY);
    global.trainIdsWithIndexFive = (savedIds && Array.isArray(savedIds)) ? savedIds : [];
    server.tell(`[Train Tracker] 서버 시작: TrainId (Index 5) ${global.trainIdsWithIndexFive.length}개 로드.`);
    
    // 좌표 목록 로드 (새 형식: {id, x, y, z, dim} 포함)
    const savedCoords = server.data.get(COORDS_KEY);
    global.savedCarriage2Coords = (savedCoords && Array.isArray(savedCoords)) ? savedCoords : [];
    server.tell(`[Train Tracker] 서버 시작: Carriage 2 좌표 ${global.savedCarriage2Coords.length}개 로드.`);
});

ServerEvents.unloaded(event => {
    const server = event.server;
    
    // Train ID 목록 저장
    server.data.set(TRAIN_ID_KEY, global.trainIdsWithIndexFive);
    server.tell(`[Train Tracker] 서버 종료: TrainId 목록 ${global.trainIdsWithIndexFive.length}개 영구 저장.`);
    
    // 좌표 목록 저장
    server.data.set(COORDS_KEY, global.savedCarriage2Coords);
    server.tell(`[Train Tracker] 서버 종료: Carriage 2 좌표 ${global.savedCarriage2Coords.length}개 영구 저장.`);
});

// ----------------------------------------------------------------------
// 2. 틱 이벤트: TrainId 및 좌표 검색, 갱신, 스폰포인트 설정
// ----------------------------------------------------------------------

let tickCounter = 0;

ServerEvents.tick(event => {
    const server = event.server;
    tickCounter++;

    // 💥 오류 방지 코드 추가
    if (typeof global.trainIdsWithIndexFive === 'undefined') {
        global.trainIdsWithIndexFive = [];
    }
    if (typeof global.savedCarriage2Coords === 'undefined') {
        global.savedCarriage2Coords = [];
    }
    
    if (tickCounter % 20 === 0) {
        
        (function() {
            let currentFoundTrainIdKeys = new Set(); 
            let currentFoundCoords = [];
            
            let trackedIds = new Set(global.trainIdsWithIndexFive); 
            
            // --- A. 엔티티 순회 및 데이터 수집 (차원 정보 추가) ---
            server.getEntities().forEach(entity => {
                
                if (entity.type == 'create:carriage_contraption') {
                    
                    let entityNbt = entity.nbt;
                    if (!entityNbt) return;

                    let trainIdKey = null; 
                    let carriageIndex;
                    
                    // 현재 엔티티의 차원 ID 가져오기 (예: 'minecraft:overworld', 'minecraft:the_nether')
                    // KubeJS에서 엔티티의 차원 ID는 entity.level.dimension.toString()으로 접근할 수 있습니다.
                    let dimensionId = entity.level.dimension.toString(); 

                    if (entityNbt.contains('TrainId')) {
                        let trainIdNbt = entityNbt.get('TrainId');
                        if (Array.isArray(trainIdNbt)) {
                            trainIdKey = trainIdNbt[0]; 
                        } else if (trainIdNbt && trainIdNbt.isNumber) { 
                            trainIdKey = trainIdNbt.asNumber(); 
                        }
                    }
                    
                    if (entityNbt.contains('CarriageIndex')) {
                        carriageIndex = entityNbt.getInt('CarriageIndex');
                    }
                    
                    if (typeof trainIdKey !== 'number' || isNaN(trainIdKey)) return;

                    if (carriageIndex === 5) {
                        currentFoundTrainIdKeys.add(trainIdKey);
                    }
                    
                    if (carriageIndex === 2 && trackedIds.has(trainIdKey)) {
                        currentFoundCoords.push({
                            id: trainIdKey,
                            x: Math.round(entity.x + -1),
                            y: Math.round(entity.y + 1),
                            z: Math.round(entity.z + -1),
                            dim: dimensionId // 💥 차원 정보 추가
                        });
                    }
                }
            });

            // --- B. ID 목록 및 좌표 갱신 (Index 5 기준으로) ---
            
            let newIds = Array.from(currentFoundTrainIdKeys); 
            let oldIds = global.trainIdsWithIndexFive;
            
            let isIdsChanged = false;
            
            if (newIds.length > 0) {
                isIdsChanged = oldIds.length !== newIds.length || !oldIds.every((val, index) => val === newIds[index]);
                
                if (isIdsChanged) {
                    
                    global.trainIdsWithIndexFive = newIds; 
                    global.savedCarriage2Coords = currentFoundCoords.filter(coord => newIds.includes(coord.id));
                    
                    server.data.set(TRAIN_ID_KEY, newIds);
                    server.data.set(COORDS_KEY, global.savedCarriage2Coords);
                    
                    server.tell(Text.aqua(`[Train Tracker] ID/좌표 갱신: Index 5 TrainId가 변경되어 ${newIds.length}개로 덮어쓰고, 좌표 ${global.savedCarriage2Coords.length}개를 저장했습니다. (차원 정보 포함)`));
                }
            } 


            // --- C. 스폰 포인트 설정 (차원 정보 사용) ---
            
            if (global.trainIdsWithIndexFive.length > 0 && currentFoundCoords.length > 0) { 
                
                let relevantCoords = currentFoundCoords.filter(coord => global.trainIdsWithIndexFive.includes(coord.id));

                if (relevantCoords.length > 0) {
                    let spawnCoord = relevantCoords[0];
                    let x = spawnCoord.x;
                    let y = spawnCoord.y + 1; 
                    let z = spawnCoord.z;
                    let dim = spawnCoord.dim; // 💥 차원 정보 사용

                    // /setworldspawn은 오버월드에서만 사용 가능합니다.
                    // 네더 등에 스폰 포인트를 설정하려면 별도의 명령어(`/setspawnpoint <dim> <x> <y> <z>`)가 필요할 수 있습니다.
                    // Minecraft 기본 명령어는 /setworldspawn이 오버월드에 고정되어 있으므로, 
                    // 여기서는 기차가 'minecraft:overworld'에 있을 때만 월드 스폰을 갱신합니다.
                    
                    if (dim === 'minecraft:overworld') {
                        server.runCommandSilent(`setworldspawn ${x} ${y} ${z}`);
                        let count = server.players.length; 
                        
                        if (isIdsChanged || tickCounter === 20) {
                            server.tell(Text.green(`[Train Spawn] 서버 기본 스폰 포인트가 [${x}, ${y}, ${z}]로 자동 설정되었습니다. (오버월드)`));
                        }

                    
                    } else {
                        // 오버월드가 아닐 경우, 월드 스폰 포인트는 변경하지 않습니다.
                        if (isIdsChanged || tickCounter === 20) {
                            server.tell(Text.yellow(`[Train Spawn] 기차가 오버월드(${dim})에 있지 않아 월드 스폰 포인트는 갱신하지 않았습니다.`));
                        }
                    }

                    global.savedCarriage2Coords = relevantCoords;
                }
            }
        })(); 
    }
});