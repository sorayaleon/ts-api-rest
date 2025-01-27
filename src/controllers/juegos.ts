/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import ListaJuegos from '../mocks/juegos';
import Juego from '../interfaces/juego';

// Comprueba que la entrada es correcta de datos. Es auxiliar
const checkBody = (req: Request) => req.body.titulo && req.body.titulo.trim().length > 0;

/**
 * CONTROLADOR DE JUEGOS
 */

class JuegosController {
  /**
   * Obtiene todos los elementos existentes
   * @param req Request
   * @param res Response
   * @returns 200 si OK y lista JSON
   */
  public async findAll(req: Request, res: Response) {
    return res.status(200).json(ListaJuegos);
  }

  /**
   * Obtiene el elemento por el ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento JSON
   */
  public async findById(req: Request, res: Response) {
    try {
      const data = ListaJuegos.find((juego) => juego.id === req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún juego con ID: ${req.params.id}`,
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
          mensaje: 'El título del juego es un campo obligatorio',
        });
      }
      const data: Juego = {
        id: Date.now().toString(),
        titulo: req.body.titulo,
        descripcion: req.body.descripcion || undefined,
        plataforma: req.body.plataforma || undefined,
        fecha: req.body.fecha || new Date(),
        activo: Boolean(req.body.activo) || false,
        imagen: req.body.imagen || undefined,
        usuarioId: req.body.usuarioId || req.user.id,
      };
      ListaJuegos.push(data);
      return res.status(201).json(data);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
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
      // Existe
      const index = ListaJuegos.findIndex((juego) => juego.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún juego con ID: ${req.params.id}`,
        });
      }
      let data = ListaJuegos[index];
      // Tenemos permiso
      if (req.user.id !== data.usuarioId) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Están todos los datos
      if (!checkBody(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'El título del juego es un campo obligatorio',
        });
      }
      // Realizamos la acción
      data = {
        id: data.id,
        titulo: req.body.titulo,
        descripcion: req.body.descripcion || data.descripcion,
        plataforma: req.body.plataforma || data.plataforma,
        fecha: req.body.fecha || data.fecha,
        activo: Boolean(req.body.activo) || data.activo,
        imagen: req.body.imagen || data.imagen,
        usuarioId: data.usuarioId,
      };
      ListaJuegos[index] = data;
      return res.status(200).json(data);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
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
      // Existe
      const index = ListaJuegos.findIndex((juego) => juego.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún juego con ID: ${req.params.id}`,
        });
      }
      const data = ListaJuegos[index];
      // Tenemos permiso
      if (req.user.id !== data.usuarioId) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Realizamos la acción
      ListaJuegos.splice(index, 1);
      return res.status(200).json(data);
    } catch (err) {
      console.log(err.toString());
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
      });
    }
  }
}

// Exportamos el módulo
export default new JuegosController();
