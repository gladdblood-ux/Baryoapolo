// ==========================================
// BARYO APOLO: ULTRA PREMIUM GRAPHICS SHOP (shop.js)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // Nag-inject din tayo ng kaunting CSS animation para sa neon pulse effect
    const styleInject = `
    <style>
        @keyframes neonPulse {
            0% { box-shadow: 0 0 15px rgba(74, 222, 128, 0.2), inset 0 0 10px rgba(74, 222, 128, 0.1); }
            50% { box-shadow: 0 0 30px rgba(74, 222, 128, 0.5), inset 0 0 15px rgba(74, 222, 128, 0.3); }
            100% { box-shadow: 0 0 15px rgba(74, 222, 128, 0.2), inset 0 0 10px rgba(74, 222, 128, 0.1); }
        }
        .shop-btn-premium {
            transition: transform 0.1s ease, filter 0.2s ease !important;
        }
        .shop-btn-premium:active {
            transform: scale(0.95) translateY(2px) !important;
            filter: brightness(1.3);
        }
    </style>`;
    document.head.insertAdjacentHTML('beforeend', styleInject);
    
    const shopHTML = `
    <div id="shopOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: radial-gradient(circle at center, rgba(15, 23, 42, 0.98) 0%, rgba(3, 7, 18, 0.99) 100%); z-index: 99999; display: none; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box; backdrop-filter: blur(12px);">
        
        <div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.99) 100%); border: 2px solid #4ade80; border-radius: 20px; padding: 25px; text-align: center; width: 90%; max-width: 350px; animation: neonPulse 3s infinite ease-in-out; display: flex; flex-direction: column; gap: 14px; box-sizing: border-box; position: relative;">
            
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #4ade80, transparent); animation: moveLine 2s infinite linear;"></div>

            <h2 style="font-family:'Cinzel', serif; color:#4ade80; margin:0; font-size:1.8rem; letter-spacing: 2px; text-shadow: 0 0 10px rgba(74,222,128,0.6), 0 4px 10px rgba(0,0,0,0.7);">PAMBANSANG SHOP</h2>
            <p style="font-size:0.8rem; color:#94a3b8; margin: -5px 0 5px 0; font-family:'Rajdhani', sans-serif; letter-spacing: 1px; text-transform: uppercase; font-weight: bold;">[ Black Market Weaponry & Logistics ]</p>
            
            <button class="shop-btn-premium" style="background: linear-gradient(135deg, #b45309 0%, #451a03 100%); border: 1px solid #f59e0b; border-radius: 8px; color: white; padding: 14px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: block; width: 100%; box-shadow: 0 4px 15px rgba(180, 83, 9, 0.3); border-bottom: 4px solid #78350f;" onclick="buyShopItem('builder')">
                👷 KONTRATA NG MANGGAGAWA (+1)<br>
                <span style="color:#fef08a; font-size:0.65rem; font-weight:600; display:block; margin-top:3px; letter-spacing:0.5px;">🪙 300 GINTO | 🪨 150 BATO</span>
            </button>
            
            <button class="shop-btn-premium" style="background: linear-gradient(135deg, #0f766e 0%, #115e59 100%); border: 1px solid #06b6d4; border-radius: 8px; color: white; padding: 14px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: block; width: 100%; box-shadow: 0 4px 15px rgba(15, 118, 110, 0.3); border-bottom: 4px solid #134e4a;" onclick="buyShopItem('shield')">
                🛡️ SHIELD BOOST (10 MINUTO)<br>
                <span style="color:#a5f3fc; font-size:0.65rem; font-weight:600; display:block; margin-top:3px; letter-spacing:0.5px;">🧪 250 ELIXIR</span>
            </button>
            
            <button class="shop-btn-premium" style="background: linear-gradient(135deg, #be185d 0%, #831843 100%); border: 1px solid #f472b6; border-radius: 8px; color: white; padding: 14px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: block; width: 100%; box-shadow: 0 4px 15px rgba(190, 24, 93, 0.3); border-bottom: 4px solid #9d174d;" onclick="buyShopItem('instant_army')">
                📦 REINFORCEMENT ARMY PACK<br>
                <span style="color:#fbcfe8; font-size:0.65rem; font-weight:600; display:block; margin-top:3px; letter-spacing:0.5px;">🪙 400 GINTO</span>
            </button>
            
            <hr style="border:0; border-top: 1px solid rgba(255,255,255,0.08); margin: 5px 0;">

            <button class="shop-btn-premium" style="background: #1e293b; border: 1px solid #475569; border-radius: 8px; color: #cbd5e1; padding: 12px; font-family: 'Rajdhani', sans-serif; font-weight: bold; font-size: 0.85rem; cursor: pointer; width: 100%; text-transform: uppercase; letter-spacing: 1px;" onclick="toggleShop(false)">
                ❌ BUMALIK SA RADAR KAMP
            </button>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', shopHTML);
});

// 2. CONTROLLER FUNCTIONS (STAYED SAME)
function toggleShop(show) {
    let shop = document.getElementById("shopOverlay");
    if (shop) {
        shop.style.display = show ? "flex" : "none";
    }
}

function buyShopItem(itemType) {
    if (typeof gameData === 'undefined') return;
    
    switch (itemType) {
        case 'builder':
            if (gameData.gold >= 300 && gameData.stone >= 150) {
                gameData.gold -= 300;
                gameData.stone -= 150;
                baseBuilders.push({ id: baseBuilders.length + 1, x: 150, y: 150, state: 'idle', targetId: null, frame: 0 });
                alert("📢 Tagumpay! Nadagdagan ng isang masipag na Manggagawa ang iyong kampo.");
                updateShopHUD();
            } else {
                alert("❌ Kulang ang iyong Ginto o Bato!");
            }
            break;
            
        case 'shield':
            if (gameData.elixir >= 250) {
                gameData.elixir -= 250;
                alert("📢 Tagumpay! Aktibo na ang Shield Boost sa loob ng 10 minuto.");
                updateShopHUD();
            } else {
                alert("❌ Kulang ang iyong Elixir!");
            }
            break;
            
        case 'instant_army':
            if (gameData.gold >= 400) {
                gameData.gold -= 400;
                gameData.army.guerilla += 5;
                gameData.army.guard += 3;
                gameData.army.tank += 1;
                alert("📢 Dumating na ang mga reinforcement! +5 Archer, +3 Swordsman, at +1 Tank.");
                updateShopHUD();
            } else {
                alert("❌ Kulang ang iyong Ginto!");
            }
            break;
    }
}

function updateShopHUD() {
    if (document.getElementById("bGold")) document.getElementById("bGold").innerText = "🪙 " + gameData.gold;
    if (document.getElementById("bElixir")) document.getElementById("bElixir").innerText = "🧪 " + gameData.elixir;
    if (document.getElementById("bStone")) document.getElementById("bStone").innerText = "🪨 " + gameData.stone;
    
    if (document.getElementById("builderLabel")) {
        document.getElementById("builderLabel").innerText = baseBuilders.length + "/" + baseBuilders.length + " Handa";
    }
    
    if (document.getElementById("armyCount")) {
        let totalArmy = gameData.army.guerilla + gameData.army.guard + gameData.army.tank;
        document.getElementById("armyCount").innerText = totalArmy;
    }
}