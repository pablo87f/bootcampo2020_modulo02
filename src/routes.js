import { Router } from 'express';
import UserController from './app/controllers/user.controller';
import SessionController from './app/controllers/session.controller';

import authMiddleware from './app/middlewares/auth.middleware';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
