Die = function () {
    WebGLFramework.Object.call(this);
};

Die.prototype = new WebGLFramework.Object();

Die.prototype.init = function (radius, height, position) {

    var group = new THREE.Object3D();

    // amendment
    if (radius < 1) {
        radius = 20;
    }
    if (height < 1) {
        height = 10;
    }
    var segmentsX = 100;
    var segmentsY = 1;
    var openEnded = false;

    var geometry = new THREE.CylinderGeometry(radius, radius, height, segmentsX, segmentsY, openEnded);
    var material = new THREE.MeshLambertMaterial({color: DIE_COLOR, transparent: false });
    material.doubleSided = true;
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    group.position.set(position.x, position.y, position.z);
    group.add(mesh);

    this.setObject3D(group);

};

Die.prototype.update = function () {
    this.object3D.children[0].visible = true;
};