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
        .shop-scroll-container {
            max-height: 65vh;
            overflow-y: auto;
            padding-right: 5px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        /* Custom scrollbar para sa magandang UI */
        .shop-scroll-container::-webkit-scrollbar { width: 6px; }
        .shop-scroll-container::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 4px; }
        .shop-scroll-container::-webkit-scrollbar-thumb { background: #4ade80; border-radius: 4px; }
    </style>`;
    document.head.insertAdjacentHTML('beforeend', styleInject);
    
    const shopHTML = `
    <div id="shopOverlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: radial-gradient(circle at center, rgba(15, 23, 42, 0.98) 0%, rgba(3, 7, 18, 0.99) 100%); z-index: 99999; display: none; flex-direction: column; align-items: center; justify-content: center; box-sizing: border-box; backdrop-filter: blur(12px);">
        
        <div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(2, 6, 23, 0.99) 100%); border: 2px solid #4ade80; border-radius: 20px; padding: 22px; text-align: center; width: 92%; max-width: 370px; animation: neonPulse 3s infinite ease-in-out; display: flex; flex-direction: column; gap: 10px; box-sizing: border-box; position: relative;">
            
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #4ade80, transparent); animation: moveLine 2s infinite linear;"></div>

            <h2 style="font-family:'Cinzel', serif; color:#4ade80; margin:0; font-size:1.6rem; letter-spacing: 2px; text-shadow: 0 0 10px rgba(74,222,128,0.6), 0 4px 10px rgba(0,0,0,0.7);">PAMBANSANG SHOP</h2>
            <p style="font-size:0.75rem; color:#94a3b8; margin: -5px 0 5px 0; font-family:'Rajdhani', sans-serif; letter-spacing: 1px; text-transform: uppercase; font-weight: bold;">[ Black Market Weaponry & Logistics ]</p>
            
            <!-- SCROLL CONTAINER PARA KASYA LAHAT NG ITEMS -->
            <div class="shop-scroll-container">
                
                <!-- NEW CHARACTER: SNIPER (PALASO) -->
                <button class="shop-btn-premium" style="background: linear-gradient(135deg, #1e3a8a 0%, #172554 100%); border: 1px solid #3b82f6; border-radius: 8px; color: white; padding: 12px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: block; width: 100%; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); border-bottom: 4px solid #1e3a8a;" onclick="buyShopItem('premium_sniper')">
                    🏹 ELITE CROSSBOW SNIPER (PALASO)<br>
                    <span style="color:#93c5fd; font-size:0.65rem; font-weight:600; display:block; margin-top:3px; letter-spacing:0.5px;">🪙 250 GINTO | 🧪 100 ELIXIR</span>
                </button>

                <!-- NEW CHARACTER: COMMANDO (KANYON) -->
                <button class="shop-btn-premium" style="background: linear-gradient(135deg, #7c2d12 0%, #431407 100%); border: 1px solid #ea580c; border-radius: 8px; color: white; padding: 12px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: block; width: 100%; box-shadow: 0 4px 15px rgba(234, 88, 12, 0.3); border-bottom: 4px solid #7c2d12;" onclick="buyShopItem('premium_commando')">
                    💥 HEAVY MORTAR COMMANDO (KANYON)<br>
                    <span style="color:#ffedd5; font-size:0.65rem; font-weight:600; display:block; margin-top:3px; letter-spacing:0.5px;">🪙 500 GINTO | 🪨 100 BATO</span>
                </button>

                <!-- LOGISTICS & UPGRADES -->
                <button class="shop-btn-premium" style="background: linear-gradient(135deg, #b45309 0%, #451a03 100%); border: 1px solid #f59e0b; border-radius: 8px; color: white; padding: 12px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: block; width: 100%; box-shadow: 0 4px 15px rgba(180, 83, 9, 0.3); border-bottom: 4px solid #78350f;" onclick="buyShopItem('builder')">
                    👷 KONTRATA NG MANGGAGAWA (+1)<br>
                    <span style="color:#fef08a; font-size:0.65rem; font-weight:600; display:block; margin-top:3px; letter-spacing:0.5px;">🪙 300 GINTO | 🪨 150 BATO</span>
                </button>
                
                <button class="shop-btn-premium" style="background: linear-gradient(135deg, #0f766e 0%, #115e59 100%); border: 1px solid #06b6d4; border-radius: 8px; color: white; padding: 12px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: block; width: 100%; box-shadow: 0 4px 15px rgba(15, 118, 110, 0.3); border-bottom: 4px solid #134e4a;" onclick="buyShopItem('shield')">
                    🛡️ SHIELD BOOST (10 MINUTO)<br>
                    <span style="color:#a5f3fc; font-size:0.65rem; font-weight:600; display:block; margin-top:3px; letter-spacing:0.5px;">🧪 250 ELIXIR</span>
                </button>
                
                <button class="shop-btn-premium" style="background: linear-gradient(135deg, #be185d 0%, #831843 100%); border: 1px solid #f472b6; border-radius: 8px; color: white; padding: 12px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; display: block; width: 100%; box-shadow: 0 4px 15px rgba(190, 24, 93, 0.3); border-bottom: 4px solid #9d174d;" onclick="buyShopItem('instant_army')">
                    📦 REINFORCEMENT ARMY PACK<br>
                    <span style="color:#fbcfe8; font-size:0.65rem; font-weight:600; display:block; margin-top:3px; letter-spacing:0.5px;">🪙 400 GINTO</span>
                </button>

            </div>
            
            <hr style="border:0; border-top: 1px solid rgba(255,255,255,0.08); margin: 3px 0;">

            <button class="shop-btn-premium" style="background: #1e293b; border: 1px solid #475569; border-radius: 8px; color: #cbd5e1; padding: 10px; font-family: 'Rajdhani', sans-serif; font-weight: bold; font-size: 0.85rem; cursor: pointer; width: 100%; text-transform: uppercase; letter-spacing: 1px;" onclick="toggleShop(false)">
                ❌ BUMALIK SA RADAR KAMP
            </button>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', shopHTML);
});

function toggleShop(show) {
    let shop = document.getElementById("shopOverlay");
    if (shop) {
        shop.style.display = show ? "flex" : "none";
    }
}

function buyShopItem(itemType) {
    if (typeof gameData === 'undefined') return;

    // Siguraduhing handa ang lagayan ng premium troops sa gameData para hindi mag-crash
    if (!gameData.army.premium_sniper) gameData.army.premium_sniper = 0;
    if (!gameData.army.premium_commando) gameData.army.premium_commando = 0;
    
    switch (itemType) {
        case 'premium_sniper':
            if (gameData.gold >= 250 && gameData.elixir >= 100) {
                gameData.gold -= 250;
                gameData.elixir -= 100;
                gameData.army.premium_sniper += 1;
                alert("🏹 Sniper Nakuha! May dagdag kang Elite Crossbow Sniper sa iyong imbentaryo.");
                updateShopHUD();
            } else {
                alert("❌ Kulang ang iyong Ginto o Elixir para sa Sniper!");
            }
            break;

        case 'premium_commando':
            if (gameData.gold >= 500 && gameData.stone >= 100) {
                gameData.gold -= 500;
                gameData.stone -= 100;
                gameData.army.premium_commando += 1;
                alert("💥 Commando Nakuha! Handa nang magpaulan ng Kanyon ang iyong bagong kawal.");
                updateShopHUD();
            } else {
                alert("❌ Kulang ang iyong Ginto o Bato para sa Commando!");
            }
            break;

        case 'builder':
            if (gameData.gold >= 300 && gameData.stone >= 150) {
                gameData.gold -= 300;
                gameData.stone -= 150;
                if (typeof baseBuilders !== 'undefined') {
                    baseBuilders.push({ id: baseBuilders.length + 1, x: 150, y: 150, state: 'idle', targetId: null, frame: 0 });
                }
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

    // Awtomatikong magse-save kung ang saveGame() function ay nakakabit sa index.html mo
    if (typeof saveGame === 'function') saveGame();
}

function updateShopHUD() {
    if (document.getElementById("bGold")) document.getElementById("bGold").innerText = "🪙 " + gameData.gold;
    if (document.getElementById("bElixir")) document.getElementById("bElixir").innerText = "🧪 " + gameData.elixir;
    if (document.getElementById("bStone")) document.getElementById("bStone").innerText = "🪨 " + gameData.stone;
    
    if (document.getElementById("builderLabel") && typeof baseBuilders !== 'undefined') {
        document.getElementById("builderLabel").innerText = baseBuilders.length + "/" + baseBuilders.length + " Handa";
    }
    
    if (document.getElementById("armyCount")) {
        let sniperCount = gameData.army.premium_sniper || 0;
        let commandoCount = gameData.army.premium_commando || 0;
        let totalArmy = gameData.army.guerilla + gameData.army.guard + gameData.army.tank + sniperCount + commandoCount;
        document.getElementById("armyCount").innerText = totalArmy;
    }

    // Kung may updateBattleHUD function ka sa iyong battle controls, tinatawagan din ito
    if (typeof updateBattleHUD === 'function') updateBattleHUD();
}
