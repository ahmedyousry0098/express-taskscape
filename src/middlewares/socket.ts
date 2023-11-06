import { AdminModel } from "../../DB/model/admin.model"
import { EmployeeModel, EmployeeSchemaType } from "../../DB/model/employee.model"
import { UserRole } from "../constants/user.role"
import { IJwtPayload } from "../interfaces/jwt.interface"
import { getIo } from "../utils/socket"
import * as jwt from 'jsonwebtoken'

export const socketAuth = async (token: string, socketId: string) => {
    if (!token) {
        getIo().emit('authFail', {message: 'Authenticaton Faild'})
        return false
    }
    const decoded = jwt.verify(token, `${process.env.JWT_SIGNATURE}`) as IJwtPayload
    if (!decoded?._id) {
        getIo().emit('authFail', {message: 'Authenticaton Faild'})
        return false
    }
    if (decoded.role == UserRole.ADMIN) {
        const admin = await AdminModel.findByIdAndUpdate(
            decoded._id,
            {
                socketId
            },
            {new: true}
        ).select('-password')
        if (!admin) {
            getIo().emit('authFail', {message: 'Authenticaton Faild'})
            return false
        }
        return admin
    }
    if (Object.values(UserRole).includes(decoded.role )) {
        const employee = await EmployeeModel.findByIdAndUpdate<EmployeeSchemaType>(
            decoded._id,
            {
                socketId
            },
            {new: true}
        ).select('-password')
        
        if (!employee) {
            getIo().emit('authFail', {message: 'Authenticaton Faild'})
            return false
        } 
        return employee
    }
    getIo().emit('authFail', {message: 'Authenticaton Faild'})
    return false
}
