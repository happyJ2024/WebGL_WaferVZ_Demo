/*!
 * WaferMapApp Class (Singleton), derived from WebGlFramework.App. Hold all objects and controls for rendering.
 */

var clock = new THREE.Clock();

WaferMapApp = function () {
    WebGLFramework.App.call(this);
};

WaferMapApp.prototype = new WebGLFramework.App();

WaferMapApp.prototype.init = function (param) {

    WebGLFramework.App.prototype.init.call(this, param);
};

WaferMapApp.prototype.update = function () {

    var delta = clock.getDelta();
    this.controls.update(delta);
    WebGLFramework.App.prototype.update.call(this);
};

WaferMapApp.prototype.onControlSelected = function (control, selected) {

    if (control == this.selectedControl) {
        if (!selected) {
            this.selectedControl = null;
        }
    }
    else {
        if (selected) {
            if (this.selectedControl) {
                this.selectedControl.deselect();
            }
            this.selectedControl = control;
        }
    }
};