/**
 * ENRUTADOR DE USURARIOs
 */

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';
import userController from '../controllers/user';
import { auth } from '../middlewares/auth';

// Middleware
//  auth, grant(['ADMIN']), si no se pone gran, es porque es que esta implícito role(['user'])

// Cargamos el enrutador
const userRouter = express.Router();

// GET Obtiene un elemento por por ID: Solo autenticado
userRouter.get('/:id', auth, userController.findById);

// POST Añadir Elemento. Solo autenticado
userRouter.post('/register', userController.add);

// PUT Modifica un elemento por ID. Solo autenticado
userRouter.put('/:id', auth, userController.update);

// DELETE Elimina un elemento por ID. Solo autenticado
userRouter.delete('/:id', auth, userController.remove);

// POST Descarga un fichero dado su ID
userRouter.post('/login', userController.login);

// Exprotamos el módulo
export default userRouter;
