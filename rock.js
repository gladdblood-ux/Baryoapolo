// ==========================================================================
// BARYO APOLO: TOUCH-FIXED FARMING & GRAPHICS ENGINE (rocks.js)
// ==========================================================================

let breakableRocks = [];
let rocksContainer = null;
let farmPlots = [
    { id: 1, x: 50, y: 160, state: 'empty', timer: 0 },
    { id: 2, x: 90, y: 190, state: 'empty', timer: 0 },
    { id: 3, x: 130, y: 220, state: 'empty', timer: 0 }
]; 

// 1. PINAKAMALUPIT NA CSS LOOKS
const megaStyles = `
<style>
    /* 3D Realistic Kubo */
    .premium-kubo {
        position: absolute;
        background: linear-gradient(135deg, #b45309 0%, #78350f 70%, #451a03 100%);
        border: 2px solid #292524;
        box-shadow: inset 2px 2px 0px rgba(255,255,255,0.15), 0 10px 15px rgba(0,0,0,0.5);
        border-radius: 8px;
        transform: rotateX(55deg) rotateZ(-45deg);
        transform-style: preserve-3d;
    }
    .premium-kubo::before {
        content: '🌾';
        position: absolute;
        top: -12px; left: -2px;
        font-size: 32px;
        text-shadow: 0 4px 6px rgba(0,0,0,0.5);
    }

    /* Gold Mine at Elixir Pump */
    .premium-mine {
        position: absolute;
        background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
        border: 2px solid #78350f;
        box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
        border-radius: 5px;
        transform: rotateX(55deg) rotateZ(-45deg);
    }
    .premium-pump {
        position: absolute;
        background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);
        border: 2px solid #581c87;
        box-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
        border-radius: 5px;
        transform: rotateX(55deg) rotateZ(-45deg);
    }

    /* Taniman (Farm Plot) - PINALAKAS ANG POINTER EVENTS */
    .farm-plot {
        position: absolute;
        background: linear-gradient(135deg, #7c2d12 0%, #451a03 100%);
        border: 2px dashed #a16207;
        border-radius: 4px;
        transform: rotateX(55deg) rotateZ(-45deg);
        pointer-events: auto !important; /* Pwersahang clickable */
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
        z-index: 99999 !important; /* Lumulutang sa pinakataas para mapindot agad */
        user-select: none;
        touch-action: manipulation;
    }
    .farm-plot:active { 
        filter: brightness(1.4);
        transform: rotateX(55deg) rotateZ(-45deg) scale(0.9);
    }

    /* Mga Puto */
    .delikadong-puto {
        position: absolute;
        width: 14px; height: 14px;
        background: #fdf4ff;
        border-radius: 50%;
        border: 1px solid #e9d5ff;
        box-shadow: inset -2px -2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3);
    }
    .delikadong-puto::after {
        content: '';
        position: absolute;
        top: 2px; left: 4px; width: 6px; height: 3px;
        background: #facc15;
        border-radius: 1px;
    }
</style>
`;
if (!document.getElementById("megaStylesInjected")) {
    document.head.insertAdjacentHTML('beforeend', megaStyles + '<div id="megaStylesInjected"></div>');
}

// 2. AUTOMATIC GRAPHICS SYSTEM
function upgradeBaseGraphics() {
    let baseCanvas = document.getElementById("mainCanvas") || document.querySelector("canvas");
    let baseScreen = document.getElementById("baseScreen");
    if (!baseCanvas || !baseScreen) return;

    let overlay = document.getElementById("megaGraphicsOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "megaGraphicsOverlay";
        overlay.style.position = "absolute";
        overlay.style.top = baseCanvas.offsetTop + "px";
        overlay.style.left = baseCanvas.offsetLeft + "px";
        overlay.style.width = baseCanvas.offsetWidth + "px";
        overlay.style.height = baseCanvas.offsetHeight + "px";
        overlay.style.pointerEvents = "none"; /* Wrapper is transparent to clicks */
        overlay.style.zIndex = "999"; 
        baseScreen.appendChild(overlay);
    }

    // Alisin muna ang mga lumang kubo/minahan para hindi magpatong-patong
    let oldElements = overlay.querySelectorAll('.premium-kubo, .premium-mine, .premium-pump, .delikadong-puto');
    oldElements.forEach(el => el.remove());

    let currentBuildings = [];
    if (typeof gameData !== 'undefined' && gameData.structures) currentBuildings = gameData.structures;
    else if (typeof structures !== 'undefined') currentBuildings = structures;

    currentBuildings.forEach((b) => {
        let size = 35;
        let posX = (b.gridX * 28) + 160; 
        let posY = (b.gridY * 14) + 60;

        let styleClass = "premium-kubo";
        if (b.type && b.type.includes("gold")) styleClass = "premium-mine";
        if (b.type && b.type.includes("elixir")) styleClass = "premium-pump";

        let buildingHTML = `<div class="${styleClass}" style="left: ${posX}px; top: ${posY}px; width: ${size}px; height: ${size}px;"></div>`;
        overlay.insertAdjacentHTML('beforeend', buildingHTML);

        if (styleClass === "premium-kubo") {
            let putoHTML = `<div class="delikadong-puto" style="left: ${posX + size + 2}px; top: ${posY + 10}px;"></div>`;
            overlay.insertAdjacentHTML('beforeend', putoHTML);
        }
    });

    // Pwersahang i-render at ikabit ang click listeners sa Taniman
    renderFarmsWithFixedClick(overlay);
}

// 3. SIGURADONG CLICK SYSTEM (EVENT LISTENER METHOD)
function renderFarmsWithFixedClick(overlay) {
    farmPlots.forEach(plot => {
        let plotId = `farm-plot-${plot.id}`;
        let plotEl = document.getElementById(plotId);
        
        let icon = "🕳️"; 
        if (plot.state === 'growing') icon = "🌱";
        if (plot.state === 'ready') icon = "🌾"; 

        if (!plotEl) {
            // Gagawa ng element
            let btn = document.createElement("div");
            btn.id = plotId;
            btn.className = "farm-plot";
            btn.style.left = plot.x + "px";
            btn.style.top = plot.y + "px";
            btn.style.width = "35px";
            btn.style.height = "35px";
            btn.innerText = icon;

            // DITO ANG SEKRETO: JavaScript na mismo ang makikinig sa tap ng daliri mo sa CP!
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                triggerFarmLogic(plot.id);
            });
            btn.addEventListener("touchstart", (e) => {
                e.stopPropagation();
                triggerFarmLogic(plot.id);
            });

            overlay.appendChild(btn);
        } else {
            plotEl.innerText = icon;
        }
    });
}

// ANG LOGIC NG PAGTATANIM
function triggerFarmLogic(id) {
    let plot = farmPlots.find(p => p.id === id);
    if (!plot) return;

    if (plot.state === 'empty') {
        plot.state = 'growing';
        plot.timer = 8; // Ginawa nating 8 segundo na lang para mabilis!
        console.log("🌱 Nagtanim!");
    } else if (plot.state === 'ready') {
        plot.state = 'empty';
        
        // Dagdag yaman reward sa laro mo!
        if (typeof gameData !== 'undefined') {
            gameData.gold += 500;
            if(document.getElementById("goldLabel")) {
                document.getElementById("goldLabel").innerText = gameData.gold;
            }
        }
        alert("🌾 Naani mo na ang Palay/Puto Tree! +500 Ginto! 💰");
    }
}

// Timer para sa paglaki ng pananim
setInterval(() => {
    farmPlots.forEach(plot => {
        if (plot.state === 'growing') {
            plot.timer--;
            if (plot.timer <= 0) {
                plot.state = 'ready';
            }
        }
    });
}, 1000);

// LOOP RUNNER
setInterval(() => {
    let baseScreen = document.getElementById("baseScreen");
    if (baseScreen && baseScreen.style.display !== "none") {
        upgradeBaseGraphics();
    } else {
        if (document.getElementById("megaGraphicsOverlay")) {
            document.getElementById("megaGraphicsOverlay").remove();
        }
    }
}, 500);
