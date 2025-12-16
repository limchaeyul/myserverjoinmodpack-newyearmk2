// KubeJS/server_scripts/player_effects.js (리스폰 시 차원 이동 텔레포트 적용)

const TRAIN_TP_TAG = "train_tp_pending";
const MAX_DISTANCE_SQ = 64 * 64; 

// ----------------------------------------------------------------------
// 1. PlayerEvents.respawned (리스폰 시 기차 차원 & 좌표로 텔레포트)
// ----------------------------------------------------------------------

PlayerEvents.respawned(event => {
    const player = event.player;
    if (!player.level.server) return; 

    const playerName = player.username; 
    
    // 1. 저장된 기차 좌표가 있는지 확인
    const coordsList = global.savedCarriage2Coords;
    
    if (!coordsList || coordsList.length === 0) {
        // 기차 좌표가 없으면 기본 텔레포트 실행 (Y+2)
        player.runCommand(`tp @s ~ ~2 ~`);
        player.tell(Text.yellow('리스폰 시 기차 좌표를 찾을 수 없어 기본 텔레포트됩니다.'));
        return;
    }
    
    
    
    const targetCoord = coordsList[0];
    const targetX = targetCoord.x;
    const targetY = targetCoord.y + 1; // 1블록 위로 텔레포트
    const targetZ = targetCoord.z;
    const targetDim = targetCoord.dim; // 💥 목표 차원 ID
    
    // 2. 텔레포트 실행 (차원 이동 포함)
    // execute in <차원ID> run tp <대상> <x> <y> <z>
    player.runCommandSilent(`execute in ${targetDim} run tp @s ${targetX} ${targetY} ${targetZ}`);
    
    player.tell(Text.green(`리스폰하여 기차 위치인 ${targetDim}의 좌표로 즉시 텔레포트되었습니다.`));
    console.info(`[Player Effect] ${playerName} 리스폰 -> ${targetDim} 기차 좌표 [${targetX}, ${targetY}, ${targetZ}]로 텔레포트 완료.`);
    player.runCommandSilent('kubejs persistent_data entity @s remove *');
    player.persistentData.putInt('interference_counter_id', 2)
    player.potionEffects.add('kubejs:interference', 300*20);
    player.potionEffects.add('minecraft:slowness', 300*20)
    player.potionEffects.add('kubejs:sleepy', 300*20)
    player.potionEffects.add('minecraft:weakness', 300*20)
    player.potionEffects.add('minecraft:mining_fatigue', 300*20)
});


// ----------------------------------------------------------------------
// 2. PlayerEvents.loggedOut (로그아웃 로직 - 변경 없음)
// ----------------------------------------------------------------------
// ... (로그아웃 로직은 변경 없음) ...

PlayerEvents.loggedOut(event => {
    const player = event.player;
    
    const coordsList = global.savedCarriage2Coords;

    if (!coordsList || coordsList.length === 0) {
        return; 
    }
    
    const targetCoord = coordsList[0];
    const targetX = targetCoord.x;
    const targetY = targetCoord.y;
    const targetZ = targetCoord.z;
    
    const playerX = Math.round(player.x);
    const playerY = Math.round(player.y);
    const playerZ = Math.round(player.z);
    
    const playerDim = player.level.dimension.toString();
    const targetDim = targetCoord.dim;

    if (playerDim !== targetDim) {
        player.runCommandSilent(`tag @s remove ${TRAIN_TP_TAG}`);
        return; 
    }

    // 3D 거리 계산
    const dx = playerX - targetX;
    const dy = playerY - targetY;
    const dz = playerZ - targetZ;
    const distanceSq = dx * dx + dy * dy + dz * dz;

    if (distanceSq <= MAX_DISTANCE_SQ) {
        player.runCommandSilent(`tag @s add ${TRAIN_TP_TAG}`);
        
        player.tell(Text.aqua(`[Train TP] 기차 주변 (${playerDim})에서 로그아웃하여 텔레포트 대기 태그가 부여되었습니다.`));
        console.info(`[Train TP] ${player.username} 로그아웃: 64블록 3D 이내 (${Math.sqrt(distanceSq).toFixed(1)}m). 태그 부여 완료.`);
    } else {
        player.runCommandSilent(`tag @s remove ${TRAIN_TP_TAG}`);
        console.info(`[Train TP] ${player.username} 로그아웃: 거리 밖. 태그 제거 시도 완료.`);
    }
});

// ----------------------------------------------------------------------
// 3. PlayerEvents.loggedIn (로그인 로직 - 변경 없음)
// ----------------------------------------------------------------------
// ... (로그인 로직은 변경 없음) ...

PlayerEvents.loggedIn(event => {
    const player = event.player;
    
    if (!player.level.server) return;
    
    const playerName = player.username;
    
    // 1. 태그 확인 
    if (!player.tags.contains(TRAIN_TP_TAG)) {
        return; 
    }
    
    // 2. 저장된 기차 좌표 가져오기
    const coordsList = global.savedCarriage2Coords;
    
    if (!coordsList || coordsList.length === 0) {
        player.runCommandSilent(`tag @s remove ${TRAIN_TP_TAG}`);
        player.tell(Text.red('[Train TP] 태그가 있지만, 기차 좌표를 찾을 수 없어 태그를 제거합니다.'));
        return;
    }
    
    // 3. 텔레포트 목표 좌표 설정 (Y+1 및 차원)
    const targetCoord = coordsList[0];
    const targetX = targetCoord.x;
    const targetY = targetCoord.y + 1; 
    const targetZ = targetCoord.z;
    const targetDim = targetCoord.dim; 

    // 4. 텔레포트 실행 (차원 이동 포함)
    player.runCommandSilent(`execute in ${targetDim} run tp @s ${targetX} ${targetY} ${targetZ}`);
    
    // 5. 태그 제거 (텔레포트 완료)
    player.runCommandSilent(`tag @s remove ${TRAIN_TP_TAG}`);
    
    player.tell(Text.green(`[Train TP] 이전 로그아웃 위치에 따라 ${targetDim}의 기차 좌표로 텔레포트되었습니다.`));
    console.info(`[Train TP] ${playerName} 로그인: ${targetDim} [${targetX}, ${targetY}, ${targetZ}]로 텔레포트 및 태그 제거 완료.`);
});