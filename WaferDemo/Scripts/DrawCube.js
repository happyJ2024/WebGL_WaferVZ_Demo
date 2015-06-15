function drawCube(width, height, depth, X, Y, Z, s) {
    var position = new THREE.Vector3();
    position.set(X, Y, Z);
    var cube = new Cube();
    cube.init(width, height, depth, position)
    application.addObject(cube);


    /*var cubeOnDieBase = new CubeDieBase();
    cubeOnDieBase.init(width, 0.1, depth, position)
    application.addObject(cubeOnDieBase);*/
}





