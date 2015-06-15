CubeDieBase = function () {
    WebGLFramework.Object.call(this);
};

CubeDieBase.prototype = new WebGLFramework.Object();

CubeDieBase.prototype.init = function (width, height, depth, position) {

    var group = new THREE.Object3D();

    var geometry = new THREE.BoxGeometry(width, height, depth);


    var material = new THREE.MeshBasicMaterial({ color: CUBE_DIE_BASE_COLOR });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    group.position.set(position.x, position.y, position.z);
    group.add(mesh);

    this.setObject3D(group);

};






