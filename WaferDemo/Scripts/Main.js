function getJsonData() {
    /* var mapData = "";
     return JSON.parse(mapData);*/

    return "";
}


ViewMatrix = function (waferMapData) {

    var startX = 0;
    var startY = 450;
    var startZ = 400;

    // Init Camera position
    application.camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 10, 10000);
    application.camera.position.z = startZ;
    application.camera.position.x = startX;
    application.camera.position.y = startY;


    // Init TrackballControls
    var controls = new THREE.TrackballControls(application.camera, application.webGLRenderer.domElement);
    controls.target.set(0, 0, 0);
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 0.5;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.5;
    controls.keys = [ 65, 83, 68 ];
    application.controls = controls;


    // Init light
    var temp = new THREE.Object3D;
    temp.position.set(application.camera.position.x, application.camera.position.y, 0);
    light = new THREE.DirectionalLight(0xe5e5e5);
    light.position.set(application.camera.position.x, application.camera.position.y, 100000);
    light.target = temp;
    light.castShadow = true;
    light.intensity = 0.8;
    light.shadowCameraVisible = true;
    application.scene.add(light);


    //draw die

    var diePositionX = 0;
    var diePositionY = 0;
    var diePositionZ = 0;
    var dieRadius = 250;
    var dieHeight = 5;
    var position = new THREE.Vector3();
    position.set(diePositionX, diePositionY, diePositionZ);
    var dieBase = new Die();
    dieBase.init(dieRadius, dieHeight, position);
    application.addObject(dieBase);

    //draw gird
    var perSize = 100;
    var positionY = -(dieHeight / 2);
    drawGrid(container.offsetHeight, container.offsetWidth, perSize, positionY, application.scene);

    //draw Cube
    var width = 17;
    var height = 3;
    var depth = 17;
    var distance = 2;

    var loopCountX = Math.floor(dieRadius / (width )) + 1;
    var loopCountZ = Math.floor(dieRadius / (depth )) + 1;


    console.log(loopCountX + "," + loopCountZ);
    var cubeX = 0;
    var cubeY = 10;
    var cubeZ = 0;

    //第一象限
    for (var i = 0; i < loopCountX; i++) {
        cubeX = i * ( width + distance);
        for (var j = 0; j < loopCountZ; j++) {
            cubeZ = j * ( depth + distance);
            //console.log(i + "," + j);
            if (judgeIfOverDieBase(dieRadius, cubeX, width, cubeZ, depth)) {
                drawCube(width, height, depth, cubeX, cubeY, cubeZ, application.scene);
            }
        }
    }
    //第二象限
    for (var i = 0; i < loopCountX; i++) {
        cubeX = i * ( width + distance);
        for (var j = 1; j < loopCountZ; j++) {
            cubeZ = -1 * j * ( depth + distance);
            //console.log(cubeX + "," + cubeY + "," + cubeZ)
            if (judgeIfOverDieBase(dieRadius, cubeX, width, cubeZ, depth)) {
                drawCube(width, height, depth, cubeX, cubeY, cubeZ, application.scene);
            }

        }
    }
    //第三象限
    for (var i = 1; i < loopCountX; i++) {
        cubeX = -1 * i * ( width + distance);
        for (var j = 0; j < loopCountZ; j++) {
            cubeZ = j * ( depth + distance);
            //console.log(cubeX + "," + cubeY + "," + cubeZ)
            if (judgeIfOverDieBase(dieRadius, cubeX, width, cubeZ, depth)) {
                drawCube(width, height, depth, cubeX, cubeY, cubeZ, application.scene);
            }

        }
    }
    //第四象限
    for (var i = 1; i < loopCountX; i++) {
        cubeX = -1 * i * ( width + distance);
        for (var j = 1; j < loopCountZ; j++) {
            cubeZ = -1 * j * ( depth + distance);
            //console.log(cubeX + "," + cubeY + "," + cubeZ)
            if (judgeIfOverDieBase(dieRadius, cubeX, width, cubeZ, depth)) {
                drawCube(width, height, depth, cubeX, cubeY, cubeZ, application.scene);
            }

        }
    }
    // Run
    application.run();

    var totalCube=0;
    var objArray = application.getObjects();
    for (var i = 0; i < objArray.length; i++) {
        var obj = objArray[i];
        if (obj instanceof Cube) {
             totalCube++;
        }
    }
    $("#total_a").text(totalCube);
};

function judgeIfOverDieBase(dieRadius, x, xSize, z, zSize) {
    if (x < 0)x = -1 * x;
    if (z < 0)z = -1 * z;

    x = x + xSize;
    z = z + zSize;


    //console.log(x + "," + z);
    if (Math.pow(x, 2) + Math.pow(z, 2) > Math.pow(dieRadius, 2)) {
        //console.log("false");
        return false;
    }
    //console.log("true");
    return true;
}

function changeOprFlag(id) {
    console.log(id);
    if (id == "nav_button_view") {
        OPERATION_FLAG = VIEW;
        $('input:radio[name=opr_flag]')[0].checked = true;
    }
    if (id == "nav_button_mark_error") {
        OPERATION_FLAG = MARK_ERROR;
        $('input:radio[name=opr_flag]')[1].checked = true;

    }
    console.log(OPERATION_FLAG);
}

function playAnimation(id) {

    if (PLAY_ANIMATION_STATE == PLAY_ANIMATION_STOP) {
        $("#" + id).text("Bonding Simulation");
        PLAY_ANIMATION_STATE = PLAY_ANIMATION_RUN;

        console.log("play_flag:" + PLAY_ANIMATION_STATE);

        setInterval("playAnimationOnCube()", 1000);
    }
    else {
        $("#" + id).text("Bonding Simulation");
        PLAY_ANIMATION_STATE = PLAY_ANIMATION_STOP;
        OPERATION_FLAG = VIEW;
        console.log("play_flag:" + PLAY_ANIMATION_STATE);
    }


}

function playAnimationOnCube() {

    if (PLAY_ANIMATION_STATE == PLAY_ANIMATION_STOP) {
        window.clearInterval(1);
        return;
    }

    OPERATION_FLAG = PICK_UP;

    var objArray = application.getObjects();
    for (var i = 0; i < objArray.length; i++) {
        var obj = objArray[i];
        //console.log(obj);
        if (obj instanceof Cube) {
            if (obj.CubeErrorFlag == false) {
                obj.select();
                break;
            }

        }
    }
}