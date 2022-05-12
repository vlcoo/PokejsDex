class VError {
    constructor(msg) {
        this.msg = msg;
    }

    onDraw() {
        background(0);
        shText(this.msg, 20, 20, colors["whFg"], colors["whSh"]);
    }
}