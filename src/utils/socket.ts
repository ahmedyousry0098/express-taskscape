import { Server } from "socket.io";
import {Server as httpServer} from 'http'
import { ResponseError } from "./errHandling";
import { socketAuth } from "../middlewares/socket";
import { EmployeeModel, IEmployeeDocument } from "../../DB/model/employee.model";
import { NotificationModel } from "../../DB/model/notification.model";

let io: Server;
export const initIo = (httpServer: httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    })
    io.on('connection', (socket) => {
        const socketId = socket.id
        socket.on('updateSocketId', async ({token}) => {
            const user = await socketAuth(token, socketId)
            if (!user) return
        })
        
        socket.on('fetchNotifications', async ({_id, userRole = 'employee'}) => {
            if (userRole == 'employee') {
                const user = await EmployeeModel.findById(_id)
                if (!user) {
                    console.log('user not found');
                    return 
                }
                const myNotifications = await NotificationModel.find({to: user._id})
                io.to(user.socketId).emit('listenToNotificatons', {myNotifications})
            }
        })

        socket.on('markNotificationsRead', async ({_id, userRole = 'employee'}) => {
            await NotificationModel.updateMany({to: userRole._id}, {isReaded: true})
        })
    })
    return io
}

export const getIo = () => {
    if (!io) {
        throw new ResponseError('Io Stablish Faild')
    }
    return io
}