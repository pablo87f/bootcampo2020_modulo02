import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer.config';
import UserController from './app/controllers/user.controller';
import SessionController from './app/controllers/session.controller';

import authMiddleware from './app/middlewares/auth.middleware';
import FileController from './app/controllers/file.controller';
import ProviderController from './app/controllers/provider.controller';
import AppointmentController from './app/controllers/appointment.controller';
import ScheduleController from './app/controllers/schedule.controller';
import NotificationController from './app/controllers/notifications.controller';
import AvailableController from './app/controllers/available.controller';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
