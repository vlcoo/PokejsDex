class VPokeList {
    constructor(dex, presetScroll) {
        this.dex = dex;
        this.scrollbarYPos = 402;
        this.bgGrid = images["bg_grid_list"];
        this.bgOverlay = images["bg_list"];
        this.toolbarTitle = images["toolbar_natdex"];
        this.toolbarBNavi = images["toolbar_bg_bottomNavi"];

        this.list = new BList(192, 338);
        for (var p of this.dex.pokemon_entries) {
            this.list.addEntry(new ListEntry(p.entry_number, p.pokemon_species.name, undefined));
        }
        for (var i = presetScroll-2; i > 0; i--) this.list.scroll(1);
    }

    onDraw() {
        bgGridXPos -= 0.5;
        if (bgGridXPos < -128) bgGridXPos = 0;
        image(this.bgGrid, bgGridXPos, 0);
        image(this.toolbarTitle, 0, 0);
        image(this.toolbarBNavi, 0, 720);
        image(this.bgOverlay, 11, 378);
        this.list.onDraw();
        shText("Proof of concept. Unfinished program!", 24, 60, colors["blFg"], colors["blSh"], 512);

        stroke(40, 40, 40);
        strokeWeight(2);
        fill(186, 186, 186);
        rect(502, 402, 4, 299);
        fill(251, 203, 56)
        this.scrollbarYPos = map(this.list.selectedMon, 1, this.list.entries.length, 402, 701);
        rect(500, this.scrollbarYPos, 8, 15)
    }

    onMouseInput(x, y, button) {
        if (button == LEFT) {
            let p = this.list.whichPressed(x, y);
            if (p != -1) this.openEntry(p.id);
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
        loadPokeInfoView(mon);
    }

    isPressingScrollbar(x, y) {
        return x >= 500 && x <= 508 && y >= 402 && y <= 701;
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

    onDraw() {
        image(this.bgs[this.pressed ? 1 : 0], this.x, this.y);
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
            if (this.isVisible(entry)) entry.onDraw();
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
        
        if (this.selectedMon + 8 >= Object.keys(cachedSprites).length) {
            loadNextBatchSprites();
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