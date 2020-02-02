import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/user.controller';
import SessionController from './app/controllers/session.controller';

import authMiddleware from './app/middlewares/auth.middleware';
import FileController from './app/controllers/file.controller';
import ProviderController from './app/controllers/provider.controller';
import AppointmentController from './app/controllers/appointment.controller';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.get('/providers', ProviderController.index);

routes.post('/appointments', AppointmentController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
