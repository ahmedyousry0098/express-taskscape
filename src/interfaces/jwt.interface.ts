import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../constants/user.role';

export interface IJwtPayload extends JwtPayload {
	id: string;
	email: string;
	role: UserRole;
}
