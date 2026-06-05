const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Dito itatabi pansamantala ang mga accounts (In-Memory Database para sa mabilisang deployment sa Render)
// Tandaan: Sa libreng Render instance, nabubura ito kapag natulog ang server. Sobrang ganda nito pang-testing!
let onlinePlayers = {};

// Generator para sa mga Pekeng Manlalaro (Bots) kapag walang ibang player sa database
function generateBotPlayer(stage) {
    const botNames = ["Baryo_Gisasing", "Lantang_Sibat", "Heneral_Tatsulok", "Mandirigmang_Ligaw", "Rajah_Higanti"];
    const randomName = botNames[Math.floor(Math.random() * botNames.length)] + "_" + Math.floor(Math.random() * 90 + 10);
    return {
        username: randomName,
        gold: 500 * stage,
        elixir: 500 * stage,
        stone: 200 * stage,
        currentStage: stage,
        troopLevels: { guerilla: stage, guard: stage, tank: stage },
        structures: [
            { id: 1, type: 'townhall', gridX: 4, gridY: 4, state: 'ready', progress: 100 },
            { id: 2, type: 'kubo', gridX: Math.floor(Math.random()*6+1), gridY: 2, state: 'ready', progress: 100 },
            { id: 3, type: 'gold_mine', gridX: 6, gridY: Math.floor(Math.random()*5+1), state: 'ready', progress: 100 },
            { id: 4, type: 'elixir_pump', gridX: 2, gridY: Math.floor(Math.random()*5+1), state: 'ready', progress: 100 }
        ]
    };
}

// ROUTE 1: Main Page Delivery
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ROUTE 2: ONLINE REGISTER
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, msg: "Kulang ang detalye ng Sundalo!" });
    }
    if (onlinePlayers[username.toLowerCase()]) {
        return res.json({ success: false, msg: "May gumagamit na ng pangalang ito!" });
    }

    // Default panimulang resources para sa bagong player
    onlinePlayers[username.toLowerCase()] = {
        username: username,
        password: password, // Simple plain text para sa mabilis na prototype ng bersyon 9
        gold: 1200,
        elixir: 1000,
        stone: 400,
        currentStage: 1,
        troopLevels: { guerilla: 1, guard: 1, tank: 1 },
        army: { guerilla: 15, guard: 12, tank: 5 },
        structures: [
            { id: 1, type: 'townhall', gridX: 4, gridY: 4, state: 'ready', progress: 100 },
            { id: 2, type: 'kubo', gridX: 2, gridY: 3, state: 'ready', progress: 100 },
            { id: 3, type: 'gold_mine', gridX: 6, gridY: 2, state: 'ready', progress: 100 },
            { id: 4, type: 'elixir_pump', gridX: 2, gridY: 6, state: 'ready', progress: 100 }
        ]
    };

    res.json({ success: true, msg: "Portal Matagumpay na Itinatag!" });
});

// ROUTE 3: ONLINE LOGIN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const account = onlinePlayers[username.toLowerCase()];
    
    if (!account || account.password !== password) {
        return res.json({ success: false, msg: "Maling Pangalan o Susi ng Password!" });
    }

    // Ibalik ang sineb na state ng player
    res.json({
        success: true,
        playerData: {
            username: account.username,
            gold: account.gold,
            elixir: account.elixir,
            stone: account.stone,
            currentStage: account.currentStage,
            troopLevels: account.troopLevels,
            army: account.army,
            structures: account.structures
        }
    });
});

// ROUTE 4: SYNC DATA (AUTOSAVE TO SERVER)
app.post('/api/sync', (req, res) => {
    const { username, gold, elixir, stone, currentStage, troopLevels, army, structures } = req.body;
    const key = username ? username.toLowerCase() : null;
    if (key && onlinePlayers[key]) {
        onlinePlayers[key].gold = gold;
        onlinePlayers[key].elixir = elixir;
        onlinePlayers[key].stone = stone;
        onlinePlayers[key].currentStage = currentStage;
        onlinePlayers[key].troopLevels = troopLevels;
        onlinePlayers[key].army = army;
        onlinePlayers[key].structures = structures;
        return res.json({ success: true });
    }
    res.json({ success: false, msg: "Hindi ma-sync ang data." });
});

// ROUTE 5: MATCHMAKING ENGINE (PvP)
app.post('/api/matchmake', (req, res) => {
    const { attackerName } = req.body;
    const allUsernames = Object.keys(onlinePlayers).filter(name => name !== attackerName.toLowerCase());

    // KUNG WALA PANG IBANG REAL PLAYERS NA NAG-REGISTER: Gumawa agad ng Ghost Bot Base!
    if (allUsernames.length === 0) {
        const activeUser = onlinePlayers[attackerName.toLowerCase()];
        const targetStage = activeUser ? activeUser.currentStage : 1;
        const botBase = generateBotPlayer(targetStage);
        return res.json({ success: true, isBot: true, opponent: botBase });
    }

    // Kung may ibang players, kumuha ng random na totoong player base
    const randomTargetKey = allUsernames[Math.floor(Math.random() * allUsernames.length)];
    const targetPlayer = onlinePlayers[randomTargetKey];
    
    res.json({
        success: true,
        isBot: false,
        opponent: {
            username: targetPlayer.username,
            structures: targetPlayer.structures,
            currentStage: targetPlayer.currentStage
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is deploy-ready and active on port ${PORT}`);
});
