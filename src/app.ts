import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

let bulbState = {
  kitchen: true,
  bedroom: true,
  hall: true,
};

// Broadcast latest bulb state to all connected clients
function broadcastState(state: typeof bulbState) {
  io.emit('bulb-state', state);
}


// SOCKET.IO: Send initial state + handle disconnect
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('bulb-state', bulbState);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


app.get('/', (req: Request, res: Response) => {
  res.send('Smart Home API is live!');
});

// Voice command API 
app.post('/api/voice-command', async (req: Request, res: Response) => {
  try {
    let { bulb, action } = req.body as { bulb: string; action: string };

    bulb = extractBulbName(bulb) || bulb;
    const isValidRoom = ['kitchen', 'bedroom', 'hall'].includes(bulb);
    const isValidAction = ['on', 'off'].includes(action);

    if (!isValidRoom || !isValidAction) {
      res.status(400).json({ message: 'Invalid command' });
      return;
    }

    bulbState = {
      ...bulbState,
      [bulb]: action === 'on',
    };

    broadcastState(bulbState);

    res.json({ success: true, state: bulbState });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { transcript } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      res.status(400).json({ message: 'Invalid request: transcript missing' });
      return;
    }

    const lower = transcript.toLowerCase();

    const bulb = extractBulbName(lower);
    let action: 'on' | 'off' | null = null;

    if (lower.includes('turn on') || lower.includes('switch on')) action = 'on';
    else if (lower.includes('turn off') || lower.includes('switch off')) action = 'off';

    if (!bulb || !action) {
      res.status(400).json({ message: 'Could not understand command' });
      return;
    }

    bulbState = {
      ...bulbState,
      [bulb]: action === 'on',
    };

    broadcastState(bulbState);

    res.json({ success: true, state: bulbState });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function extractBulbName(text: string): 'kitchen' | 'bedroom' | 'hall' | null {
  const lc = text.toLowerCase();
  if (lc.includes('kitchen')) return 'kitchen';
  if (lc.includes('bedroom')) return 'bedroom';
  if (lc.includes('hall')) return 'hall';
  return null;
}


const PORT = process.env.PORT || 8001;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
