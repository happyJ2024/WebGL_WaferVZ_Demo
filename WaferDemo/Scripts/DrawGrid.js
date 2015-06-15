function drawGrid(height, width, perSize, positionY, s) {

    //draw Z  , XY保持不变， Z轴位置变化
    var perSizeZ = perSize;
    var ZCount = Math.floor(height / 2 / perSizeZ);// 坐标轴正方向的Z轴上的线数量
    var totalZ = ZCount * perSizeZ;   // 坐标轴正方向的Z长度
    var totalX = width;
    var MinX = -1 * totalX / 2;  // X轴正方向长度
    var MaxX = totalX / 2;  // X轴反方向长度

    var geometryZ = new THREE.Geometry();
    geometryZ.vertices.push(new THREE.Vector3(MinX, positionY, 0));
    geometryZ.vertices.push(new THREE.Vector3(MaxX, positionY, 0));

    for (var i = 0; i <= ZCount * 2; i++) {
        var line = getLine(geometryZ);
        var newZ = ( i * perSizeZ ) - totalZ;
        line.position.z = newZ;
        s.add(line);
    }


    //draw X , YZ保持不变， X轴位置变化
    var perSizeX = perSize;

    var XCount = Math.floor(width / 2 / perSizeX); // 坐标轴正方向的X轴上的线数量
    totalX = XCount * perSizeX;  // 坐标轴正方向的X长度
    totalZ = height;
    var MinZ = -1 * totalZ / 2; // Z轴正方向长度
    var MaxZ = totalZ / 2;  // Z轴反方向长度

    var geometryX = new THREE.Geometry();
    geometryX.vertices.push(new THREE.Vector3(0, positionY, MinZ));
    geometryX.vertices.push(new THREE.Vector3(0, positionY, MaxZ));
    for (var i = 0; i <= XCount * 2; i++) {
        var line = getLine(geometryX);
        var newX = ( i * perSizeX ) - totalX;
        line.position.x = newX;
        s.add(line);
    }
}

function getLine(geometry) {
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: GRID_LINE_COLOR, opacity: 0.6 }));
    return line;

}






