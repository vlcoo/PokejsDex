const P = new Pokedex.Pokedex({cacheImages: true});
const transAnimSpeed = 1;
const batchSize = 16;
const nSongs = 0;
const getMonIcon = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${id}.png`;
const getMonFSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

let bgColor;
let currView;
let fonts;
let colors;
let images = {};
let cachedSprites = {};     // {monId → [icon, frontSprite]}
let pleaseLoadBatch = 0;
let spinImg;
let bgGridXPos = 0;
let transAnimTimer = 0;
let atestingSong;
let loadingResources = 0;
let getErr = false;

function preload() {
    setupImages();
    loadNextBatchSprites();
    if (nSongs > 0) {
        let randSong = Math.floor(Math.random() * nSongs);
        atestingSong = loadSound(`assets/bgSongs/${randSong}.ogg`);
        atestingSong.setVolume(0.01);
    }
}

function setup() {
    if (atestingSong) atestingSong.loop();
    let c = createCanvas(512, 768);
    noSmooth();

    setupFonts();
    setupColors();

    bgColor = color(186, 32, 16);

    canvasZoom(1.5);
    if (window.location.hash) loadPokeInfoView(window.location.hash.substring(1));
    else loadMainMenu();
}

function setupFonts() {
    fonts = [];
    fonts[0] = loadFont("assets/fonts/truthideals_normal.ttf");
    textFont(fonts[0]);
    textSize(20.5);
}

function setupColors() {
    colors = {
        "blFg": color(86, 81, 80),
        "blSh": color(163, 164, 171),
        "whFg": color(251, 251, 251),
        "whSh": color(104, 105, 111),
    };
}

function setupImages() {
    images["bg_grid_info"] = loadImage("assets/graphics/bg_grid_info.png");
    images["bg_textbox"] = loadImage("assets/graphics/bg_textbox.png");
    images["toolbar_info"] = loadImage("assets/graphics/toolbar_info.png");
    images["toolbar_bg_bottomNavi"] = loadImage("assets/graphics/toolbar_bg_bottomNavi.png");
    images["bg_grid_list"] = loadImage("assets/graphics/bg_grid_list.png");
    images["bg_list"] = loadImage("assets/graphics/bg_list.png");
    images["toolbar_natdex"] = loadImage("assets/graphics/toolbar_natdex.png");
    images["button_listEntry_up"] = loadImage("assets/graphics/button_listEntry_up.png"),
    images["button_listEntry_down"] = loadImage("assets/graphics/button_listEntry_down.png")

    spinImg = loadImage("assets/graphics/spin.gif");
    monIconUnknown = loadImage("assets/graphics/monUnknown.webp");
    monFSpriteUnknown = loadImage("assets/graphics/monUnknown.webp");
}

function loadNextBatchSprites(startFrom=-1) {
    print("batching from " + startFrom);
    pleaseLoadBatch = 0;

    let len;
    if (startFrom == -1) len = Object.keys(cachedSprites).length + 1;
    else len = startFrom;
    let i = len;

    while (i < batchSize + len) {
        if (i > 807) return;

        let mon = cachedSprites[i];
        if (mon == undefined) {
            loadingResources++;
            
            cachedSprites[i] = [
                loadImage(getMonIcon(i)), 
                loadImage(getMonFSprite(i), function() {
                    loadingResources--;
                })
            ];
        }
        i++;
    }
}

function draw() {
    background(bgColor);

    if (currView != null) {
        currView.onDraw(); 
        if (transAnimTimer > 0) {
            currView.onAppearAnimStep();
            transAnimTimer -= transAnimSpeed;
        }
        else if (transAnimTimer < 0) {
            currView.onDisappearAnimStep();
            transAnimTimer += transAnimSpeed;
        }
        if (mouseIsPressed) currView.onMouseHold(mouseX, mouseY, mouseButton);
        else if (!mouseIsPressed && pleaseLoadBatch) {
            loadNextBatchSprites(pleaseLoadBatch);
        }
    }

    if (loadingResources) image(spinImg, 12, 728);
}

function keyPressed() {
    if (currView != null) currView.onKeyInput(keyCode);
}

function mouseClicked() {
    if (currView != null) currView.onMouseInput(mouseX, mouseY, mouseButton);
}

function mouseWheel(event) {
    if (currView != null) currView.onScrollInput(event.delta);
}

function loadMainMenu(presetScroll) {
    loadingResources++;

    P.getPokedexByName("national").then(function(response) {
        currView = new VPokeList(response, presetScroll);
        loadingResources--;
    }).catch(function(err) {
        currView = new VError(err.message);
    })
}

function loadPokeInfoView(which, skipAnim=false) {
    if (which < 1 || which > 807) return;
    loadingResources++;

    Promise.all([P.getPokemonByName(which), P.getPokemonSpeciesByName(which)]).then(function(results) {
        currView = new VPokeInfo(results[0], results[1], skipAnim);
        loadingResources--;
    }).catch(function(err) {
        currView = new VError(err.message);
    });
}

function loadPokeInfoViewDirectly(mon, species) {
    currView = new VPokeInfo(mon, species, false);
}

function loadPokeFormView(mon, species) {
    currView = new VPokeForm(mon, species);
}

function shText(msg, x, y, colorFg, colorSh, x2=300, y2=700) {
    msg = msg.toString().replace(/(\r\n|\n|\r)/gm, " ");

    push();
    noStroke();
    textLeading(30);
    fill(colorSh);
    text(msg, x+2, y+2, x2, y2);
    fill(colorFg);
    text(msg, x, y, x2, y2);
    pop();
}

function capitalize(msg) {
    return msg.charAt(0).toUpperCase() + msg.slice(1);
}
