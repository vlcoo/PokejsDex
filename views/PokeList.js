class VPokeList {
    constructor(dex, presetScroll) {
        this.dex = dex;
        this.scrollbarYPos = 402;
        this.bgGrid = images["bg_grid_list"];
        this.bgOverlay = images["bg_list"];
        this.toolbarTitle = images["toolbar_natdex"];
        this.toolbarBNavi = images["toolbar_bg_bottomNavi"];

        this.toolbarTitleYPos = -98;
        this.toolbarBNaviYPos = 768;
        this.fgMaskAlpha = 255;
        this.fgMaskColor = color(0, 0, 0, alpha=this.fgMaskAlpha);

        this.list = new BList(192, 338);
        for (var p of this.dex.pokemon_entries) {
            this.list.addEntry(new ListEntry(p.entry_number, p.pokemon_species.name, undefined));
            if (p.entry_number == 807) break;
        }
        for (var i = presetScroll-2; i > 0; i--) this.list.scroll(1);

        transAnimTimer = 4;
    }

    onAppearAnimStep() {
        this.toolbarTitleYPos += 24.5;
        this.toolbarBNaviYPos -= 12;
        this.fgMaskColor.setAlpha(this.fgMaskAlpha -= 63.75);
    }

    onDisappearAnimStep() {
        this.toolbarTitleYPos -= 24.5;
        this.toolbarBNaviYPos += 12;
        this.fgMaskColor.setAlpha(this.fgMaskAlpha += 63.75);
    }

    onDraw() {
        bgGridXPos -= 0.5;
        if (bgGridXPos < -128) bgGridXPos = 0;
        image(this.bgGrid, bgGridXPos, 0);
        image(this.bgOverlay, 11, 378);
        this.list.onDraw();
        
        stroke(40, 40, 40);
        strokeWeight(2);
        fill(186, 186, 186);
        rect(502, 402, 4, 299);
        fill(251, 203, 56)
        this.scrollbarYPos = map(this.list.selectedMon, 1, this.list.entries.length, 402, 701);
        rect(500, this.scrollbarYPos, 8, 15)
        
        background(this.fgMaskColor);
        
        image(this.toolbarTitle, 0, this.toolbarTitleYPos);
        image(this.toolbarBNavi, 0, this.toolbarBNaviYPos);
        shText("Proof of concept. Unfinished program!", 24, this.toolbarTitleYPos+60, colors["blFg"], colors["blSh"], 512);
    }

    onMouseInput(x, y, button) {
        if (button == LEFT) {
            let p = this.list.whichPressed(x, y);
            if (p != -1) {
                this.list.selectedMon = p.id;
                this.openEntry(p.id);
            }
        }
    }

    onMouseHold(x, y, button) {
        if (this.isPressingScrollbar(x, y)) {
            if (y > this.scrollbarYPos) this.list.scroll(1, 10);
            else if (y < this.scrollbarYPos) this.list.scroll(-1, 10);
        }
    }

    onKeyInput(k) {
        if (k == DOWN_ARROW) this.list.scroll(1);
        else if (k == UP_ARROW) this.list.scroll(-1);
    }

    onScrollInput(d) {
        if (d > 0) this.list.scroll(1);
        else if (d < 0) this.list.scroll(-1);
    }

    openEntry(mon) {
        transAnimTimer = -8;
        loadPokeInfoView(mon);
    }

    isPressingScrollbar(x, y) {
        return x >= 492 && x <= 516 && y >= 402 && y <= 701;
    }
}


class ListEntry {
    constructor(id, name, icon) {
        this.id = id;
        this.name = capitalize(name);
        this.pressed = false;
        this.x = 0;
        this.y = 0;
    }

    onDraw(isSelected=false) {
        image(this.bgs[isSelected ? 1 : 0], this.x, this.y);
        let icon = cachedSprites[this.id];
        if (icon != undefined) {
            push();
            scale(2);
            imageMode(CENTER);
            image(icon[0], this.x/2 + 17, this.y/2 + 8);
            pop();
        }

        shText(String(this.id).padStart(3, '0'), this.x+112, this.y+6, colors["whFg"], colors["whSh"]);
        shText(this.name, this.x+168, this.y+6, colors["whFg"], colors["whSh"]);
    }

    isPressed(x, y) {
        return x >= this.x && x <= this.x + 302 && y >= this.y && y <= this.y + 42;
    }
}


class BList {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.entries = [];
        this.separation = 48;
        this.selectedMon = 1;
        this.b_bgs = [
            images["button_listEntry_up"],
            images["button_listEntry_down"]
        ];
    }

    onDraw() {
        if (this.entries.length == 0) return;
        for (var entry of this.entries) {
            if (this.isVisible(entry)) entry.onDraw(entry.id == this.selectedMon);
        }

        let icon = cachedSprites[this.selectedMon];
        if (icon != undefined) {
            push();
            scale(-2, 2);
            imageMode(CENTER);
            image(icon[1], -47, 236);
            pop();
        }
    }

    addEntry(entry) {
        entry.x = this.x;
        entry.y = this.y + this.entries.length * this.separation;
        entry.bgs = this.b_bgs;
        this.entries.push(entry);
    }

    reachedBounds() {
        if (this.entries[0].y >= 600) return -1;
        else if (this.entries[this.entries.length-1].y <= 160) return 1;
    }

    isVisible(entry) {
        return entry.y > 88 && entry.y < 680; 
    }

    scroll(dir, again=0) {
        if (this.reachedBounds() == dir) return;
        for (var entry of this.entries) {
            entry.y += this.separation * -dir;
        }
        this.selectedMon += dir;
        
        if (this.selectedMon - 8 > 0 && cachedSprites[this.entries[this.selectedMon - 8].id] == undefined) {
            pleaseLoadBatch = this.selectedMon - 8;
        }
        else if (this.selectedMon + 8 < this.entries.length && cachedSprites[this.entries[this.selectedMon + 8].id] == undefined) {
            pleaseLoadBatch = this.selectedMon + 6;
        }

        if (again > 0) this.scroll(dir, again-1);
    }

    whichPressed(x, y) {
        for (var entry of this.entries) {
            if (entry.isPressed(x, y)) return entry;
        }
        return -1;
    }
}