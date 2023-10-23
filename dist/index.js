"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.on('uncaughtException', (err) => {
    console.error(err);
});
const express_1 = __importDefault(require("express"));
const connection_1 = require("./DB/connection");
const errHandling_1 = require("./src/utils/errHandling");
const organization_routes_1 = __importDefault(require("./src/module/organization/organization.routes"));
const admin_routes_1 = __importDefault(require("./src/module/admin/admin.routes"));
// import employeeRoutes from './src/module/employee/employee.routes';
const employee_routes_1 = __importDefault(require("./src/module/employee/employee.routes"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
(0, dotenv_1.config)({ path: './.env' });
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)({
    origin: '*',
    maxAge: 600,
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
(0, connection_1.connectDB)();
app.use('/organization', organization_routes_1.default);
app.use('/admin', admin_routes_1.default);
app.use('/employee', employee_routes_1.default);
app.use(errHandling_1.globalErrorHandler);
app.all('*', (req, res, next) => {
    return res.status(404).json({ message: 'page not found' });
});
process.on('unhandledRejection', (err) => {
    console.error(`${err}`);
});
app.listen(port, () => {
    console.log(`app running on port ${port}`);
});
