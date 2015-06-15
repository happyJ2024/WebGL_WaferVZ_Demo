Cube = function () {
    WebGLFramework.Object.call(this);
    this.CubeErrorFlag = false;
};

Cube.prototype = new WebGLFramework.Object();


var FACE_INDEX = 2;
Cube.prototype.init = function (width, height, depth, position) {

    var group = new THREE.Object3D();

    var geometry = new THREE.BoxGeometry(width, height, depth);


    var texture = THREE.ImageUtils.loadTexture("Images/cube.png");
    var material = new THREE.MeshBasicMaterial();
    material.map = texture;


    var material2 = new THREE.MeshBasicMaterial({color: GRID_LINE_COLOR});


    var materialArray = [];
    materialArray.push(material2);
    materialArray.push(material2);
    materialArray.push(material);
    materialArray.push(material2);
    materialArray.push(material2);
    materialArray.push(material2);

    var faceMaterial = new THREE.MeshFaceMaterial(materialArray);

    var mesh = new THREE.Mesh(geometry, faceMaterial);

    mesh.receiveShadow = true;
    mesh.castShadow = true;
    group.position.set(position.x, position.y, position.z);
    group.add(mesh);

    this.setObject3D(group);

};

Cube.prototype.update = function () {
    this.object3D.children[0].visible = true;
};

Cube.prototype.click = function () {
    this.object3D.children[0].visible = true;
};


Cube.prototype.handleMouseDown = function (pageX, pageY, point, normal) {
    if (!this.selected) {
        this.select();
    }
    else {
        this.deselect();
    }
    console.log("Cube handleMouseDown:" + pageX + "," + pageY);
};

Cube.prototype.handleDblClick = function (pageX, pageY) {
    this.select();
    console.log("Cube handleDblClick:" + pageX + "," + pageY);
};


Cube.prototype.select = function () {
    var num = this.object3D.children.length;
    for (var i = 0; i < num; i += 1) {
        this.updateCubeColorByOprFlag(this.object3D.children[i], "select", OPERATION_FLAG);
    }
    // console.log("Cube select");
    this.selected = true;
    // this.publish("selected", this, true);
};

Cube.prototype.deselect = function () {
    var num = this.object3D.children.length;
    for (var i = 0; i < num; i += 1) {
        this.updateCubeColorByOprFlag(this.object3D.children[i], "deselect", OPERATION_FLAG);
    }
    // console.log("Cube deselect");
    this.selected = false;
    // this.publish("selected", this, false);

};

Cube.prototype.updateCubeColorByOprFlag = function (cubeObj, mode, opr_flag) {
    console.log("updateCubeColorByOprFlag:" + mode + " " + opr_flag);
    if (mode == "select") {
        if (opr_flag == MARK_ERROR) {

            cubeObj.material.materials[FACE_INDEX].color = new THREE.Color(CUBE_MARK_ERROR_SELECT_COLOR);
            if (!this.CubeErrorFlag) {
                this.CubeErrorFlag = true;
                updateLegendValue(MARK_ERROR, 1);
            }
        }
        if (opr_flag == PICK_UP) {
            if (this.CubeErrorFlag == false) {
                if (selectCube == null) {
                    selectCube = this;
                    selectCubeObj = this.object3D;
                    pickUpRender();
                    updateLegendValue(PICK_UP, 1);
                }
            }
        }
    }

    if (mode == "deselect") {
        if (opr_flag == MARK_ERROR) {

            cubeObj.material.materials[FACE_INDEX].color = new THREE.Color(CUBE_MARK_ERROR_DESELECT_COLOR);
            if (this.CubeErrorFlag) {
                this.CubeErrorFlag = false;
                updateLegendValue(MARK_ERROR, -1);
            }

        }

    }
}

function updateLegendValue(opr_flag, val) {
    if (opr_flag == MARK_ERROR) {
        var originVal = $("#mark_error_a").text();
        var newVal = parseFloat(originVal) + parseFloat(val);
        $("#mark_error_a").text(newVal);
    }

    if (opr_flag == PICK_UP) {
        var originVal = $("#pick_up_a").text();
        var newVal = parseFloat(originVal) + parseFloat(val);
        $("#pick_up_a").text(newVal);
    }
}

var selectCube;
var selectCubeObj;
function pickUpRender() {
    //console.log(selectCube);
    //console.log(selectCubeObj);

    if (selectCubeObj.position.y > 100) {

        application.removeObject(selectCube);
        selectCubeObj = null;
        selectCube = null;


    } else {
        if (selectCubeObj.position.y < 10) {
            selectCubeObj.position.y += 1;
        } else {
            selectCubeObj.position.y += 3;
        }

        application.webGLRenderer.render(application.scene, application.camera);
        requestAnimationFrame(pickUpRender);

    }

}

function setVisible(obj, visible) {
    obj.visible = visible;
    var i, len = obj.children.length;
    for (i = 0; i < len; i++) {
        setVisible(obj.children[i], visible);
    }
}

