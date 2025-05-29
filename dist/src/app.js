"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
let bulbState = {
    kitchen: false,
    bedroom: false,
    hall: false,
};
//  broadcast latest bulb state to all clients
function broadcastState(state) {
    io.emit('bulb-state', state);
}
// 🔌 Socket.IO connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    // Send current bulb state to the newly connected client
    socket.emit('bulb-state', bulbState);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
function extractBulbName(text) {
    const lc = text.toLowerCase();
    if (lc.includes('kitchen'))
        return 'kitchen';
    if (lc.includes('bedroom'))
        return 'bedroom';
    if (lc.includes('hall'))
        return 'hall';
    return null;
}
app.post('/api/voice-command', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { bulb, action } = req.body;
        if (!['kitchen', 'bedroom', 'hall'].includes(bulb)) {
            const extracted = extractBulbName(bulb);
            if (extracted)
                bulb = extracted;
        }
        if (!['kitchen', 'bedroom', 'hall'].includes(bulb) || !['on', 'off'].includes(action)) {
            res.status(400).json({ message: 'Invalid command' });
            return;
        }
        const isOn = action === 'on';
        bulbState = Object.assign(Object.assign({}, bulbState), { [bulb]: isOn });
        broadcastState(bulbState);
        res.json({ success: true, state: bulbState });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
app.post('/webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transcript } = req.body;
        console.log(transcript);
        if (!transcript || typeof transcript !== 'string') {
            res.status(400).json({ message: 'Invalid request: transcript missing' });
            return;
        }
        const lower = transcript.toLowerCase();
        // Extract bulb name
        let bulb = null;
        if (lower.includes('kitchen'))
            bulb = 'kitchen';
        else if (lower.includes('bedroom'))
            bulb = 'bedroom';
        else if (lower.includes('hall'))
            bulb = 'hall';
        // Extract action
        let action = null;
        if (lower.includes('turn on') || lower.includes('switch on'))
            action = 'on';
        else if (lower.includes('turn off') || lower.includes('switch off'))
            action = 'off';
        if (!bulb || !action) {
            res.status(400).json({ message: 'Could not understand command' });
            return;
        }
        bulbState = Object.assign(Object.assign({}, bulbState), { [bulb]: action === 'on' });
        yield broadcastState(bulbState);
        res.json({ success: true, state: bulbState });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
server.listen(8001, () => console.log('Server running on http://localhost:8000'));
//# sourceMappingURL=app.js.map