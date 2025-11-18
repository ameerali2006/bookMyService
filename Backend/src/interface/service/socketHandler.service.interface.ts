import { Server as IOServer, Socket } from 'socket.io';

export interface ISocketHandler {
  registerEvents(io: IOServer, onlineUsers: Map<string, { socketId: string; userType: string }>): void;
}
