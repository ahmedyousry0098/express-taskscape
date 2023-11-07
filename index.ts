process.on('uncaughtException', (err) => {
	console.error(err);
});

import express, { NextFunction, Request, Response } from 'express';
import { connectDB } from './DB/connection';
import { globalErrorHandler } from './src/utils/errHandling';
import organizationRoutes from './src/module/organization/organization.routes';
import adminRoutes from './src/module/admin/admin.routes';
import employeeRoutes from './src/module/employee/employee.routes';
import projectRouter from './src/module/project/project.routes';
import taskRouter from './src/module/task/task.routes';
import commentRouter from './src/module/comment/comment.routes';
import sprintRouter from './src/module/sprint/sprint.routes'
import { config } from 'dotenv';
import cors from 'cors';
import { initIo } from './src/utils/socket';
config({ path: './.env' });
const app = express();
const port = process.env.PORT;

app.use(
	cors({
		origin: '*',
		maxAge: 600,
	})
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connectDB();

app.use('/organization', organizationRoutes);
app.use('/admin', adminRoutes);
app.use('/employee', employeeRoutes);
app.use('/project', projectRouter);
app.use('/task', taskRouter);
app.use('/comment', commentRouter);
app.use('/sprint', sprintRouter);
app.use(globalErrorHandler);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
	return res.status(404).json({ message: 'In-valid Route Please Check URL Or Method' });
});

process.on('unhandledRejection', (err) => {
	console.error(`${err}`);
});

const httpServer = app.listen(port, () => {
	console.log(`app running on port ${port}`);
});

initIo(httpServer)