import socketio from "socket.io-client";
import { BASE_URL } from '../middlewares/constant';
import React from 'react';

export const socket = socketio.connect(BASE_URL);
export const SocketContext = React.createContext();

