/*!
 * Sim.js - A simple framework for WebGL, based on Three.js r67.

 */

WebGLFramework = {};

// WebGLFramework.Publisher - base class for event publishers
WebGLFramework.Publisher = function () {
    this.messageTypes = {};
};

WebGLFramework.Publisher.prototype.subscribe = function (message, subscriber, callback) {
    var subscribers = this.messageTypes[message];
    if (subscribers) {
        if (this.findSubscriber(subscribers, subscriber) != -1) {
            return;
        }
    }
    else {
        subscribers = [];
        this.messageTypes[message] = subscribers;
    }

    subscribers.push({ subscriber: subscriber, callback: callback });
};

WebGLFramework.Publisher.prototype.unsubscribe = function (message, subscriber, callback) {
    if (subscriber) {
        var subscribers = this.messageTypes[message];

        if (subscribers) {
            var i = this.findSubscriber(subscribers, subscriber, callback);
            if (i != -1) {
                this.messageTypes[message].splice(i, 1);
            }
        }
    }
    else {
        delete this.messageTypes[message];
    }
};

WebGLFramework.Publisher.prototype.publish = function (message) {
    var subscribers = this.messageTypes[message];

    if (subscribers) {
        for (var i = 0; i < subscribers.length; i++) {
            var args = [];
            for (var j = 0; j < arguments.length - 1; j++) {
                args.push(arguments[j + 1]);
            }
            subscribers[i].callback.apply(subscribers[i].subscriber, args);
        }
    }
};

WebGLFramework.Publisher.prototype.findSubscriber = function (subscribers, subscriber) {
    for (var i = 0; i < subscribers.length; i++) {
        if (subscribers[i] == subscriber) {
            return i;
        }
    }

    return -1;
};

// WebGLFramework.App - application class (singleton)
WebGLFramework.App = function () {
    //WebGLFramework.Publisher.call(this);

    this.webGLRenderer = null;
    this.scene = null;
    this.camera = null;
    this.light = null;
    this.objects = [];

};

//WebGLFramework.App.prototype = new WebGLFramework.Publisher;
WebGLFramework.App.prototype.init = function (param) {
    param = param || {};
    var container = param.container;

    // Create a new Three.js scene
    this.scene = initScene();

    var axes = new THREE.AxisHelper(120);
    //this.scene.add(axes);

    // Add light source
    this.light = initLight();
    this.scene.add(this.light);

    // Put in a camera at a good default location, do not need to change
    this.camera = initCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 10000);
    this.scene.add(this.camera);

    // Create the Three.js webGLRenderer, add it to our div
    this.webGLRenderer = initRender();
    this.webGLRenderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(this.webGLRenderer.domElement);
    this.container = container;

    this.scene.data = this;

    // Create a root object to contain all other scene objects
    var root = new THREE.Object3D();
    this.scene.add(root);
    this.root = root;

    // Create a projector to handle picking
    var projector = new THREE.Projector();
    this.projector = projector;

    // Set up event handlers
    this.initMouse();
    //this.initKeyboard();
    this.addDomHandlers();
};


function initScene() {
    return new THREE.Scene(); // 场景

}
function initCamera(fov, aspect, near, far) {

    /*  PerspectiveCamera( fov, aspect, near, far )
     视角fov： 视角的大小,如果设置为0,相当你闭上眼睛了,所以什么也看不到,如果为180,那么可以认为你的视界很广阔,但是在180度的时候，往往物体很小，因为他在你的整个可视区域中的比例变小了。
     近平面near：这个呢，表示你近处的裁面的距离。补充一下，也可以认为是眼睛距离近处的距离，假设为10米远，请不要设置为负值，Three.js就傻了,不知道怎么算了,
     远平面far：这个呢，表示你远处的裁面,
     纵横比aspect：实际窗口的纵横比，即宽度除以高度。这个值越大，说明你宽度越大*/
    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);// 透视相机
    return camera;
}
function initLight() {
    var light = new THREE.AmbientLight(0x222222);// soft white light
    return light;
}
function initRender() {

    //声明渲染器对象：WebGLRenderer
    var webGLRenderer = new THREE.WebGLRenderer({
        antialias: true,       //是否开启反锯齿
        alpha: true,           //是否可以设置背景色透明
        precision: "highp"
    });

    webGLRenderer.setClearColor(0x000000, 1);
    return webGLRenderer;

}

//Core run loop
WebGLFramework.App.prototype.run = function () {
    this.update();
    this.webGLRenderer.render(this.scene, this.camera);
    var that = this;
    this.requestId = requestAnimationFrame(function () {
        that.run();
    });
};

// Update method - called once per tick
WebGLFramework.App.prototype.update = function () {
    var i, len;
    len = this.objects.length;
    for (i = 0; i < len; i++) {
        this.objects[i].update();
    }
};

// Addobjects
WebGLFramework.App.prototype.addObject = function (obj) {
    this.objects.push(obj);

    // If this is a renderable object, add it to the root scene
    if (obj.object3D) {
        this.root.add(obj.object3D);
    }
};
// get objects
WebGLFramework.App.prototype.getObjects = function () {

    return this.objects;

};
///remove  objects
WebGLFramework.App.prototype.removeObject = function (obj) {
    var index = this.objects.indexOf(obj);
    if (index != -1) {
        this.objects.splice(index, 1);
        // If this is a renderable object, remove it from the root scene
        if (obj.object3D) {
            this.root.remove(obj.object3D);
        }
    }
};

// Event handling
WebGLFramework.App.prototype.initMouse = function () {
    var dom = this.webGLRenderer.domElement;

    var that = this;
    dom.addEventListener('mousemove',
        function (e) {
            that.onDocumentMouseMove(e);
        }, false);
    dom.addEventListener('mousedown',
        function (e) {
            that.onDocumentMouseDown(e);
        }, false);
    dom.addEventListener('mouseup',
        function (e) {
            that.onDocumentMouseUp(e);
        }, false);
    dom.addEventListener('dblclick',
        function (e) {
            that.onDocumentDblClick(e);
        }, false);

    dom.addEventListener('mousewheel',
        function (e) {
            that.onDocumentMouseScroll(e);
        }, false);

    dom.addEventListener('DOMMouseScroll', // Mozilla Firefox
        function (e) {
            that.onDocumentMouseScroll(e);
        }, false);

    this.overObject = null;
    this.clickedObject = null;
};

WebGLFramework.App.prototype.initKeyboard = function () {

    var that = this;
    // use window add listener, canvas not support keyboard events
    window.addEventListener('keydown',
        function (e) {
            that.onKeyDown(e);
        }, false);
    window.addEventListener('keyup',
        function (e) {
            that.onKeyUp(e);
        }, false);
    window.addEventListener('keypress',
        function (e) {
            that.onKeyPress(e);
        }, false);
};

WebGLFramework.App.prototype.addDomHandlers = function () {
    var that = this;
    window.onresize = function (event) {
        that.onWindowResize(event);
    }
};

WebGLFramework.App.prototype.onDocumentMouseMove = function (event) {
    event.preventDefault();

    if (this.clickedObject && this.clickedObject.handleMouseMove) {
        var hitpoint = null, hitnormal = null;
        var intersected = this.objectFromMouse(event.pageX, event.pageY);
        if (intersected.object == this.clickedObject) {
            hitpoint = intersected.point;
            hitnormal = intersected.normal;
        }
        this.clickedObject.handleMouseMove(event.pageX, event.pageY, hitpoint, hitnormal);
    }
    else {
        var handled = false;

        var oldObj = this.overObject;
        var intersected = this.objectFromMouse(event.pageX, event.pageY);
        this.overObject = intersected.object;

        if (this.overObject != oldObj) {
            if (oldObj) {
                this.container.style.cursor = 'auto';

                if (oldObj.handleMouseOut) {
                    oldObj.handleMouseOut(event.pageX, event.pageY);
                }
            }

            if (this.overObject) {
                if (this.overObject.overCursor) {
                    this.container.style.cursor = this.overObject.overCursor;
                }

                if (this.overObject.handleMouseOver) {
                    this.overObject.handleMouseOver();
                }
            }

            handled = true;
        }

        if (!handled && this.handleMouseMove) {
            this.handleMouseMove(event.pageX, event.pageY);
        }
    }
};

WebGLFramework.App.prototype.onDocumentMouseDown = function (event) {
    event.preventDefault();

    var handled = false;

    var intersected = this.objectFromMouse(event.pageX, event.pageY);
    if (intersected.object) {
        if (intersected.object.handleMouseDown) {
            intersected.object.handleMouseDown(event.pageX, event.pageY, intersected.point, intersected.normal);
            this.clickedObject = intersected.object;
            handled = true;
        }
    }

    if (!handled && this.handleMouseDown) {
        this.handleMouseDown(event.pageX, event.pageY);
    }
};

WebGLFramework.App.prototype.onDocumentMouseUp = function (event) {
    event.preventDefault();

    var handled = false;

    var intersected = this.objectFromMouse(event.pageX, event.pageY);
    if (intersected.object) {
        if (intersected.object.handleMouseUp) {
            intersected.object.handleMouseUp(event.pageX, event.pageY, intersected.point, intersected.normal);
            handled = true;
        }
    }

    if (!handled && this.handleMouseUp) {
        this.handleMouseUp(event.pageX, event.pageY);
    }

    this.clickedObject = null;
};

WebGLFramework.App.prototype.onDocumentDblClick = function (event) {
    event.preventDefault();

    var handled = false;

    var intersected = this.objectFromMouse(event.pageX, event.pageY);
    if (intersected.object) {
        if (intersected.object.handleDblClick) {
            intersected.object.handleDblClick(event.pageX, event.pageY);
            handled = true;
        }
    }

    if (!handled && this.handleDblClick) {
        this.handleMouseUp(event.pageX, event.pageY);
    }

};

WebGLFramework.App.prototype.onDocumentMouseScroll = function (event) {
    event.preventDefault();
    var delta;

    if (event.wheelDelta) { // WebKit / Opera / Explorer 9

        delta = event.wheelDelta / 40;

    } else if (event.detail) { // Firefox

        delta = -event.detail / 3;

    }

    if (this.handleMouseScroll) {
        this.handleMouseScroll(delta);
    }
};

WebGLFramework.App.prototype.objectFromMouse = function (pagex, pagey) {
    // Translate page coords to element coords
    var offset = $(this.webGLRenderer.domElement).offset();
    var eltx = pagex - offset.left;
    var elty = pagey - offset.top;

    // Translate client coords into viewport x,y
    var vpx = ( eltx / this.container.offsetWidth ) * 2 - 1;
    var vpy = -( elty / this.container.offsetHeight ) * 2 + 1;

    var vector = new THREE.Vector3(vpx, vpy, 1);

    this.projector.unprojectVector(vector, this.camera);

    var ray = new THREE.Raycaster();
    ray.precision = 1; // default
    ray.set(this.camera.position, vector.sub(this.camera.position).normalize());
    var intersects = ray.intersectObjects(this.root.children, true);

    if (intersects.length > 0) {

        var i = 0;
        while ((!intersects[i].object.visible) && (i < intersects.length)) {
            i++;
        }

        if (intersects[i] == null || intersects[i].object.visible == false) {
            return { object: null, point: null, normal: null };
        }
        else {
            var intersected = intersects[i];
            return this.findParentSimObject(intersected.object, intersected.point); // return WebGLFramework.Object
        }

    }
    else {
        return { object: null, point: null, normal: null };
    }
};

WebGLFramework.App.prototype.findParentSimObject = function (object, point, normal) {
    if (object.data) {
        return { object: object.data, point: point, normal: normal };
    }
    else if (object.parent) {
        return this.findParentSimObject(object.parent, point, normal);
    }
    else {
        return { object: null, point: null, normal: null };
    }
};

WebGLFramework.App.prototype.onKeyDown = function (event) {
    // N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
    event.preventDefault();

    if (this.handleKeyDown) {
        this.handleKeyDown(event.keyCode, event.charCode);
    }
};

WebGLFramework.App.prototype.onKeyUp = function (event) {
    // N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
    event.preventDefault();

    if (this.handleKeyUp) {
        this.handleKeyUp(event.keyCode, event.charCode);
    }
};

WebGLFramework.App.prototype.onKeyPress = function (event) {
    // N.B.: Chrome doesn't deliver keyPress if we don't bubble... keep an eye on this
    event.preventDefault();

    if (this.handleKeyPress) {
        this.handleKeyPress(event.keyCode, event.charCode);
    }
};

WebGLFramework.App.prototype.onWindowResize = function (event) {

    this.webGLRenderer.setSize(this.container.offsetWidth, this.container.offsetHeight);

    this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
    this.camera.updateProjectionMatrix();

};

WebGLFramework.App.prototype.focus = function () {
    if (this.webGLRenderer && this.webGLRenderer.domElement) {
        this.webGLRenderer.domElement.focus();
    }
};


// WebGLFramework.Object - base class for all objects in our simulation
WebGLFramework.Object = function () {
    WebGLFramework.Publisher.call(this);

    this.object3D = null;
    this.children = [];
};

WebGLFramework.Object.prototype = new WebGLFramework.Publisher;

WebGLFramework.Object.prototype.init = function () {
};

// setPosition - move the object to a new position
WebGLFramework.Object.prototype.setPosition = function (x, y, z) {
    if (this.object3D) {
        this.object3D.position.set(x, y, z);
    }
};

//setScale - scale the object
WebGLFramework.Object.prototype.setScale = function (x, y, z) {
    if (this.object3D) {
        this.object3D.scale.set(x, y, z);
    }
};

//setScale - scale the object
WebGLFramework.Object.prototype.setVisible = function (visible) {
    function setVisible(obj, visible) {
        obj.visible = visible;
        var i, len = obj.children.length;
        for (i = 0; i < len; i++) {
            setVisible(obj.children[i], visible);
        }
    }

    if (this.object3D) {
        setVisible(this.object3D, visible);
    }
};

// updateChildren - update all child objects
WebGLFramework.Object.prototype.update = function () {
    var i, len;
    len = this.children.length;
    for (i = 0; i < len; i++) {
        this.children[i].update();
    }
};

WebGLFramework.Object.prototype.setObject3D = function (object3D) {
    object3D.data = this;
    this.object3D = object3D;
};

//Add/remove children
WebGLFramework.Object.prototype.addChild = function (child) {
    this.children.push(child);

    // If this is a renderable object, add its object3D as a child of mine
    if (child.object3D) {
        this.object3D.add(child.object3D);
    }
};

WebGLFramework.Object.prototype.removeChild = function (child) {
    var index = this.children.indexOf(child);
    if (index != -1) {
        this.children.splice(index, 1);
        // If this is a renderable object, remove its object3D as a child of mine
        if (child.object3D) {
            this.object3D.remove(child.object3D);
        }
    }
};

// Some utility methods
WebGLFramework.Object.prototype.getScene = function () {
    var scene = null;
    if (this.object3D) {
        var obj = this.object3D;
        while (obj.parent) {
            obj = obj.parent;
        }

        scene = obj;
    }
    return scene;
};

WebGLFramework.Object.prototype.getApp = function () {
    var scene = this.getScene();
    return scene ? scene.data : null;
};

// Some constants

/* key codes
 37: left
 38: up
 39: right
 40: down
 */
WebGLFramework.KeyCodes = {};
WebGLFramework.KeyCodes.KEY_LEFT = 37;
WebGLFramework.KeyCodes.KEY_UP = 38;
WebGLFramework.KeyCodes.KEY_RIGHT = 39;
WebGLFramework.KeyCodes.KEY_DOWN = 40;

// fix constructor of THREE.Sprite
THREE.Line.prototype.constructor = THREE.Line;