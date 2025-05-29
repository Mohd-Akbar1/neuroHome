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
  kitchen: false,
  bedroom: false,
  hall: false,
};

//  broadcast latest bulb state to all clients
function broadcastState(state: {
  kitchen: boolean;
  bedroom: boolean;
  hall: boolean;
}) {
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


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


function extractBulbName(text: string): 'kitchen' | 'bedroom' | 'hall' | null {
  const lc = text.toLowerCase();
  if (lc.includes('kitchen')) return 'kitchen';
  if (lc.includes('bedroom')) return 'bedroom';
  if (lc.includes('hall')) return 'hall';
  return null;
}

app.post('/api/voice-command', async (req: Request, res: Response): Promise<void> => {
  try {
    let { bulb, action } = req.body as { bulb: string; action: string };

 
    if (!['kitchen', 'bedroom', 'hall'].includes(bulb)) {
      const extracted = extractBulbName(bulb);
      if (extracted) bulb = extracted;
    }

    if (!['kitchen', 'bedroom', 'hall'].includes(bulb) || !['on', 'off'].includes(action)) {
      res.status(400).json({ message: 'Invalid command' });
      return;
    }

    const isOn = action === 'on';

    bulbState = {
      ...bulbState,
      [bulb]: isOn,
    };

    broadcastState(bulbState);

    res.json({ success: true, state: bulbState });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  try {
    const { transcript } = req.body;

    console.log(transcript);

    if (!transcript || typeof transcript !== 'string') {
      res.status(400).json({ message: 'Invalid request: transcript missing' });
      return;
    }

    const lower = transcript.toLowerCase();

    // Extract bulb name
    let bulb: 'kitchen' | 'bedroom' | 'hall' | null = null;
    if (lower.includes('kitchen')) bulb = 'kitchen';
    else if (lower.includes('bedroom')) bulb = 'bedroom';
    else if (lower.includes('hall')) bulb = 'hall';

    // Extract action
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

    await broadcastState(bulbState);

    res.json({ success: true, state: bulbState });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



server.listen(8001, () => console.log('Server running on http://localhost:8000'));
