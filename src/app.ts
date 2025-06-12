import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { json } from 'stream/consumers';
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

let bulbState: Record<string, boolean> = {
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

app.post('/api/voice-command', async (req: Request, res: Response): Promise<any> => {
  try {
      // const {bulb,action}=req.body.message.toolCalls[0].arguments
      // console.log(req.body)
      // const {bulb,action} =req.body
    console.log("data body",JSON.stringify(req.body))

    console.log('Received from Vapi:', { bulb, action });

    const isValidRoom = ['kitchen', 'bedroom', 'hall'].includes(bulb);
    const isValidAction = ['on', 'off'].includes(action);

    if (!isValidRoom || !isValidAction) {
      return res.status(400).json({ message: 'Invalid bulb or action' });
    }

    bulbState = {
      ...bulbState,
      [bulb]: action === 'on',
    };

    broadcastState(bulbState);

    return res.json({
      success: true,
      message: `Turned ${action} the ${bulb} light.`,
      state: bulbState,
    });

  } catch (error) {
    console.error('Error handling voice command:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// 
// app.post('/api/voice-command', async (req: Request, res: Response): Promise<any> => {
//   try {
//     // console.log('Raw body:', req.body);

    
  
//     const {bulb,action}=req.body.message.toolCalls[0].arguments
    

//     console.log('Extracted -> bulb:', bulb, 'action:', action);

//     if (!bulb || !action) {
//       return res.status(400).json({ message: 'Missing bulb or action' });
//     }

//     // Continue with bulb/action logic
   

//     return res.status(200).json({ message: `${bulb} bulb turned ${action}` });
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });






const PORT = process.env.PORT || 8001;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
