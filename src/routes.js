import Router from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);
routes.post('/sessions', SessionController.store);

// global middleware
routes.use(authMiddleware);

// local middleware
// routes.put('/users', authMiddleware, UserController.update);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.get('/providers', ProviderController.index);
routes.get('/appointments', AppointmentController.index);
routes.get('/schedule', ScheduleController.index);
routes.post('/appointments', AppointmentController.store);
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
