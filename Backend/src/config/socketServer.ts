import { createServer } from 'http';

import { SocketCore } from './socket.io';
import { bookingSocket } from './di/resolver';
import app from '../app';

const server = createServer(app);
const socketCore = new SocketCore(server);
socketCore.registerHandler(bookingSocket);

// Initialize chythathu
socketCore.initialize();

export const io = socketCore.getIO();
export const onlineWorkers = socketCore.getOnlineUsers();
export const socketServer = server;

export default socketCore;
