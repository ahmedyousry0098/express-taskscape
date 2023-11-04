import { EmployeeModel, EmployeeSchemaType } from "../../DB/model/employee.model"
import { IJwtPayload } from "../interfaces/jwt.interface"
import { getIo } from "../utils/socket"
import * as jwt from 'jsonwebtoken'
export const socketEmpAuth = async (token: string, socketId: string) => {
    if (!token) {
        return getIo().emit('authFail', {message: 'Authenticaton Faild'})
    }
    const decoded = jwt.verify(token, `${process.env.JWT_SIGNATURE}`) as IJwtPayload
    if (!decoded?._id) {
        return getIo().emit('authFail', {message: 'Authenticaton Faild'})
    }
    const employee = await EmployeeModel.findByIdAndUpdate<EmployeeSchemaType>(
        decoded._id, 
        {
            socketId
        },
        {new: true}
    ).select('-password')
    if (!employee) {
        return getIo().emit('authFail', {message: 'Authenticaton Faild'})
    }
}
