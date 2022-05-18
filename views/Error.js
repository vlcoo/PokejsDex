class VError {
    constructor(msg) {
        this.msg = "";
        this.msg = msg;
        if (window.location.href) this.msg += ". URL contains invalid data!";

        loadingResources = 0;
    }

    onDraw() {
        background(0);
        shText(this.msg, 20, 20, colors["whFg"], colors["whSh"]);
    }

    onMouseInput(x, y, button) {
        loadMainMenu();
    }

    onMouseHold(x, y, button) {
        
    }

    onKeyInput(k) {
        loadMainMenu();
    }

    onScrollInput(d) {

    }
}