const express = require('express');
const app = express();

// IMPORTANT: Binubuksan nito ang server para tanggapin ang requests galing sa kahit anong domain (CORS)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Simpleng memory storage para sa database
let playersDatabase = {};

// Default route para macheck kung buhay ang server
app.get('/', (req, res) => {
    res.send({ status: "online", game: "Baryo Apolo Online Backend Engine v9.5 ready" });
});

// API endpoint para sa Register
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, msg: "Kulang ang username o password!" });
    }
    
    const userKey = username.toLowerCase();
    if (playersDatabase[userKey]) {
        return res.json({ success: false, msg: "Ang pangalang ito ay nakuha na ng ibang mandirigma!" });
    }

    // Gagawa ng panibagong default player profile sa server cloud
    playersDatabase[userKey] = {
        username: username,
        password: password,
        gold: 1500,
        elixir: 1200,
        stone: 500,
        currentStage: 1,
        troopLevels: { guerilla: 1, guard: 1, tank: 1 },
        army: { guerilla: 10, guard: 10, tank: 2 },
        structures: [
            { id: 1, type: "townhall", gridX: 3, gridY: 3, state: "ready", progress: 100 }
        ]
    };

    res.json({ success: true, msg: `Matagumpay ang paglikha ng Portal para kay Sundalong ${username}!` });
});

// API endpoint para sa Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, msg: "Punan ang lahat ng kahon!" });
    }

    const userKey = username.toLowerCase();
    const account = playersDatabase[userKey];

    if (!account || account.password !== password) {
        return res.json({ success: false, msg: "Maling pangalan o password key!" });
    }

    res.json({ success: true, msg: "Konektado na sa server cloud!", playerData: account });
});

// API endpoint para sa Data Sync
app.post('/api/sync', (req, res) => {
    const { username, gold, elixir, stone, currentStage, troopLevels, army, structures } = req.body;
    const userKey = username ? username.toLowerCase() : null;

    if (userKey && playersDatabase[userKey]) {
        playersDatabase[userKey].gold = gold;
        playersDatabase[userKey].elixir = elixir;
        playersDatabase[userKey].stone = stone;
        playersDatabase[userKey].currentStage = currentStage;
        playersDatabase[userKey].troopLevels = troopLevels;
        playersDatabase[userKey].army = army;
        playersDatabase[userKey].structures = structures;
        return res.json({ success: true, msg: "Cloud backup synced!" });
    }
    res.status(400).json({ success: false, msg: "User session expired." });
});

// Matchmaking Endpoint
app.post('/api/matchmake', (req, res) => {
    const { attackerName } = req.body;
    
    const botOpponent = {
        username: "Heneral_Batas",
        structures: [
            { id: 1, type: "townhall", gridX: 4, gridY: 2, state: "ready", progress: 100 },
            { id: 2, type: "kubo", gridX: 2, gridY: 4, state: "ready", progress: 100 },
            { id: 3, type: "gold_mine", gridX: 5, gridY: 1, state: "ready", progress: 100 },
            { id: 4, type: "elixir_pump", gridX: 1, gridY: 3, state: "ready", progress: 100 }
        ]
    };

    res.json({ success: true, opponent: botOpponent, isBot: true });
});

// CRITICAL FOR RENDER: Kinukuha nito ang dynamic port ng Render environment.
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running live on port ${PORT}`);
});
