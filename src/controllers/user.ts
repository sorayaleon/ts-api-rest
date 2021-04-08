/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import ListaUsers from '../mocks/users';
import User from '../interfaces/user';

// Comprueba que la entrada es correcta de datos. Es auxiliar
const checkBody = (req: Request) => req.body.nombre && req.body.nombre.trim().length > 0
  && req.body.email && req.body.email.trim().length > 0
  && req.body.password && req.body.email.trim().length > 0;

/**
 * CONTROLADOR DE USUARIOS
 */

class UserController {
  /**
   * Obtiene el elemento por el ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento JSON
   */
  public async findById(req: Request, res: Response) {
    try {
      const data = ListaUsers.find((user) => user.id === req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún/a usuario/a con ID: ${req.params.id}`,
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
        data: null,
      });
    }
  }

  /**
   * Añade un elemento
   * @param req Request
   * @param res Response
   * @returns 201 si OK y elemento nuevo JSON
   */
  public async add(req: Request, res: Response) {
    try {
      if (!checkBody(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'Faltan campos obligatorios como nombre, email o passowrd',
        });
      }
      const data: User = {
        id: Date.now().toString(),
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        fecha: new Date(),
        role: req.body.role || 'USER',
      };
      ListaUsers.push(data);
      return res.status(201).json(data);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
        data: null,
      });
    }
  }

  /**
   * Actualiza un elemento dado su ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento nuevo JSON
   */
  public async update(req: Request, res: Response) {
    try {
      const index = ListaUsers.findIndex((user) => user.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún/a usuario/a con ID: ${req.params.id}`,
        });
      }
      if (!checkBody(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'Faltan campos obligatorios como nombre, email o passowrd',
        });
      }
      let data = ListaUsers[index];
      data = {
        id: data.id,
        nombre: req.body.nombre || data.nombre,
        email: req.body.email || data.nombre,
        password: req.body.password || data.password,
        fecha: req.body.fecha || data.fecha,
        role: req.body.role || data.role,
      };
      ListaUsers[index] = data;
      return res.status(200).json(data);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
        data: null,
      });
    }
  }

  /**
   * Elimina un elemento dado su ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento nuevo JSON
   */
  public async remove(req: Request, res: Response) {
    try {
      const index = ListaUsers.findIndex((user) => user.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún/a usuario/a con ID: ${req.params.id}`,
        });
      }
      const data = ListaUsers[index];
      ListaUsers.splice(index, 1);
      return res.status(200).json(data);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
        data: null,
      });
    }
  }

  /**
   * Realiza el login y devuleve el token
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento nuevo JSON
   */
  public async login(req: Request, res: Response) {
    try {
      if (!checkBody(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'Faltan campos obligatorios como nombre, email o passowrd',
        });
      }
      const data = ListaUsers.find((user) => user.id === req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún/a usuario/a con ID: ${req.params.id}`,
        });
      }
      return res.status(200).json(data);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
        data: null,
      });
    }
  }
}

// Exportamos el módulo
export default new UserController();
