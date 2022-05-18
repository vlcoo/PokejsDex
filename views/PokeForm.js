class VPokeForm {
    constructor(mon, species, skipAnim) {
        this.mon = mon;
        this.species = species;
        this.bgGrid = images["bg_grid_info"];
        this.bgTextbox = images["bg_textbox"];
        this.toolbarTitle = images["toolbar_info"];
        this.toolbarBNavi = images["toolbar_bg_bottomNavi"];
        
        this.toolbarTitleYPos = -48;
        this.toolbarBNaviYPos = 720;
        this.fgMaskAlpha = 255;
        this.fgMaskColor = color(0, 0, 0, alpha=this.fgMaskAlpha);
        
        this.sprites = {};
        for (var sprite in this.mon.sprites) {
            var url = this.mon.sprites[sprite];
            if (typeof url === 'string') this.sprites[sprite] = loadImage(url);
        }

        if (skipAnim) {
            for(var i = 0; i < 8; i++) this.onAppearAnimStep();
        }
        else transAnimTimer = 8;
    }

    onAppearAnimStep() {
        this.toolbarTitleYPos += 6;
        this.fgMaskColor.setAlpha(this.fgMaskAlpha -= 31.875);
    }

    onDisappearAnimStep() {
        this.toolbarTitleYPos -= 6;
        this.fgMaskColor.setAlpha(this.fgMaskAlpha += 31.875);
    }

    onDraw() {
        background(48, 162, 251);
        bgGridXPos -= 0.5;
        if (bgGridXPos < -64) bgGridXPos = 0;
        image(this.bgGrid, bgGridXPos, 0);
        noStroke();
        fill(0, 0, 0, 160);
        rect(0, 338, 512, 64);

        background(this.fgMaskColor);

        image(this.toolbarTitle, 0, this.toolbarTitleYPos);
        image(this.toolbarBNavi, 0, this.toolbarBNaviYPos);
    }

    onMouseInput(x, y, button) {
        loadMainMenu(this.mon.id + 1);
    }

    onMouseHold(x, y, button) {
        
    }

    onKeyInput(k) {
        if (k == LEFT_ARROW) loadPokeInfoViewDirectly(this.mon, this.species);
    }

    onScrollInput(d) {

    }
}