class VPokeInfo {
    constructor(mon, species, skipAnim) {
        this.mon = mon;
        this.species = species;
        this.bgGrid = images["bg_grid_info"];
        this.bgTextbox = images["bg_textbox"];
        this.toolbarTitle = images["toolbar_info"];
        this.toolbarBNavi = images["toolbar_bg_bottomNavi"];
        
        this.toolbarTitleYPos = -48;
        this.toolbarBNaviYPos = 768;
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
        this.toolbarBNaviYPos -= 6;
        this.fgMaskColor.setAlpha(this.fgMaskAlpha -= 31.875);
    }

    onDisappearAnimStep() {
        this.toolbarTitleYPos -= 6;
        this.toolbarBNaviYPos += 6;
        this.fgMaskColor.setAlpha(this.fgMaskAlpha += 31.875);
    }

    onDraw() {
        bgGridXPos -= 0.5;
        if (bgGridXPos < -64) bgGridXPos = 0;
        image(this.bgGrid, bgGridXPos, 0);
        image(this.bgTextbox, 0, 384);
        scale(-2, 2);
        let img = cachedSprites[this.mon.id];
        if (img == undefined && this.mon.id < 808) loadNextBatchSprites(this.mon.id);
        else if (img != undefined) image(img[1], -98, 192);
        scale(-0.5, 0.5);
        noStroke();
        fill(0, 0, 0, 160);
        rect(0, 338, 512, 49);
        
        shText(String(this.mon.id).padStart(3, '0'), 272, 410, colors["blFg"], colors["blSh"]);
        shText(capitalize(this.mon.name), 350, 410, colors["blFg"], colors["blSh"]);
        shText(this.species.flavor_text_entries[this.getDexTextLangGen("en", "black-2")].flavor_text,
            25, 618, colors["whFg"], colors["whSh"], 400, 100);
        shText(this.species.genera[7].genus.replace("Pokémon", "PKMN"), 284, 444, colors["blFg"], colors["blSh"]);
        shText("HT", 288, 536, colors["blFg"], colors["blSh"]);
        shText("WT", 288, 566, colors["blFg"], colors["blSh"]);

        textAlign(RIGHT);
        shText(this.mon.height/10 + " m ", 192, 536, colors["blFg"], colors["blSh"]);
        shText(this.mon.weight/10 + " kg", 196, 566, colors["blFg"], colors["blSh"]);
        textAlign(LEFT);

        background(this.fgMaskColor);

        image(this.toolbarTitle, 0, this.toolbarTitleYPos);
        image(this.toolbarBNavi, 0, this.toolbarBNaviYPos);
    }

    onMouseInput(x, y, button) {
        if (x > 0 && x < width && y > 0 && y < height) loadMainMenu(this.mon.id + 1);
    }

    onMouseHold(x, y, button) {
        
    }

    onKeyInput(k) {
        if (k == ESCAPE) {
            transAnimTimer = -4;
            loadMainMenu(this.mon.id + 1);
        }
        else if (k == DOWN_ARROW) loadPokeInfoView(this.mon.id + 1, true);
        else if (k == UP_ARROW) loadPokeInfoView(this.mon.id - 1, true);
        else if (k == RIGHT_ARROW) loadPokeFormView(this.mon, this.species);
    }

    onScrollInput(d) {

    }

    getDexTextLangGen(lang, genName) {
        for (var i in this.species.flavor_text_entries) {
            if (this.species.flavor_text_entries[i].language.name === lang &&
                this.species.flavor_text_entries[i].version.name === genName) {
                return i;
            }
        }
        for (var i in this.species.flavor_text_entries) {
            if (this.species.flavor_text_entries[i].language.name === lang) {
                return i;
            }
        }
        return 0;
    }
}