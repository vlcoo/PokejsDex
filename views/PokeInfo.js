class VPokeInfo {
    constructor(mon, species) {
        this.mon = mon;
        this.species = species;
        this.bgGrid = loadImage("assets/graphics/bg_grid.png");
        this.bgGridXPos = 0;
        this.bgTextbox = loadImage("assets/graphics/bg_textbox.png");
        this.toolbarTitle = loadImage("assets/graphics/toolbar_info.png");
        this.toolbarBNavi = loadImage("assets/graphics/toolbar_bg_bottomNavi.png");
        
        this.sprites = {};
        for (var sprite in this.mon.sprites) {
            var url = this.mon.sprites[sprite];
            if (typeof url === 'string') this.sprites[sprite] = loadImage(url);
        }
    }

    onDraw() {
        this.bgGridXPos -= 0.5;
        if (this.bgGridXPos < -64) this.bgGridXPos = 0;
        image(this.bgGrid, this.bgGridXPos, 0);
        image(this.toolbarTitle, 0, 0);
        image(this.toolbarBNavi, 0, 720);
        image(this.bgTextbox, 0, 384);
        scale(-2, 2);
        image(this.sprites.front_default, -98, 192);
        scale(-0.5, 0.5);
        
        shText(String(this.mon.id).padStart(3, '0'), 272, 410, colors["blFg"], colors["blSh"]);
        shText(capitalize(this.mon.name), 350, 410, colors["blFg"], colors["blSh"]);
        shText(this.species.flavor_text_entries[this.getDexTextLang("en")].flavor_text,
            25, 618, colors["whFg"], colors["whSh"], 400, 100);
        shText(this.species.genera[7].genus, 284, 444, colors["blFg"], colors["blSh"]);
        shText("HT", 288, 536, colors["blFg"], colors["blSh"]);
        shText("WT", 288, 566, colors["blFg"], colors["blSh"]);

        textAlign(RIGHT);
        shText(this.mon.height/10 + " m ", 192, 536, colors["blFg"], colors["blSh"]);
        shText(this.mon.weight/10 + " kg", 196, 566, colors["blFg"], colors["blSh"]);
        textAlign(LEFT);
    }

    getDexTextLang(lang) {
        for (var i in this.species.flavor_text_entries) {
            if (this.species.flavor_text_entries[i].language.name === lang) {
                return i;
            }
        }
        return -1;
    }
}