import { Server } from "socket.io";
import {Server as httpServer} from 'http'
import { ResponseError } from "./errHandling";

let io: Server;
export const initIo = (httpServer: httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    })
    return io
}

export const getIo = () => {
    if (!io) {
        throw new ResponseError('Io Stablish Faild')
    }
    return io
}