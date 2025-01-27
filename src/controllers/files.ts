/* eslint-disable class-methods-use-this */
import { Request, Response } from 'express';
import { v1 as uuidv1 } from 'uuid';
import fs from 'fs';
import env from '../env';
import ListaFiles from '../mocks/files';
import File from '../interfaces/file';

// Comprueba que la entrada es correcta de datos. Es auxiliar. En este caso solo acepto un fichero
const checkFile = (req: Request) => req.files && Object.keys(req.files).length !== 0 && req.files.file;
// Devuleve la url completa de una petición
const getFullUrl = (req: Request) => `${req.protocol}://${req.headers.host}${req.originalUrl}`;

/**
 * CONTROLADOR DE FICHEROS
 */

class FilesController {
  /**
   * Obtiene todos los elementos existentes
   * @param req Request
   * @param res Response
   * @returns 200 si OK y lista JSON
   */
  public async findAll(req: Request, res: Response) {
    return res.status(200).json(ListaFiles);
  }

  /**
   * Obtiene el elemento por el ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento JSON
   */
  public async findById(req: Request, res: Response) {
    try {
      // Existe
      const data = ListaFiles.find((file) => file.id === req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      // Tenemos permiso
      if (req.user.id !== data.usuarioId) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Acción
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
      // Todos los datos
      if (!checkFile(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'No hay fichero para subir o no se ha insertado el campo file',
        });
      }
      // Accion
      const file: any = req.files?.file;
      let fileName = file.name.replace(/\s/g, ''); // Si tienes espacios en blanco se los quitamos
      const fileExt = fileName.split('.').pop(); // Nos quedamos con su extension
      fileName = `${uuidv1()}.${fileExt}`; // this.getStorageName(file);
      file.mv(env.STORAGE + fileName);

      const data: File = {
        id: fileName,
        nombre: fileName,
        url: `${getFullUrl(req)}download/${fileName}`,
        fecha: new Date(),
        usuarioId: req.user.id || undefined,
      };
      ListaFiles.push(data);
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
      // Existe
      const index = ListaFiles.findIndex((file) => file.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      const data = ListaFiles[index];
      // Tenemos permiso
      if (req.user.id !== data.usuarioId) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Todos los campos
      if (!checkFile(req)) {
        return res.status(422).json({
          success: false,
          mensaje: 'No hay fichero para subir o no se ha insertado el campo file',
        });
      }
      // Acción
      const file: any = req.files?.file;
      file.mv(env.STORAGE + data.nombre);
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
      // Existe
      const index = ListaFiles.findIndex((file) => file.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      const data = ListaFiles[index];
      // Tenemos permiso
      // Tenemos permiso
      if (req.user.id !== data.usuarioId) {
        return res.status(403).json({
          success: false,
          mensaje: 'No tienes permisos para realizar esta acción',
        });
      }
      // Acción
      ListaFiles.splice(index, 1);
      fs.unlinkSync(env.STORAGE + data.nombre);
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
   * Descarga el elemento por el ID
   * @param req Request
   * @param res Response
   * @returns 200 si OK y elemento JSON
   */
  public async download(req: Request, res: Response) {
    try {
      const data = ListaFiles.find((file) => file.id === req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          mensaje: `No se ha encontrado ningún fichero con ID: ${req.params.id}`,
        });
      }
      return res.status(200).download(env.STORAGE + data.nombre);
    } catch (err) {
      return res.status(500).json({
        success: false,
        mensaje: err.toString(),
        data: null,
      });
    }
  }
}

// Exportamos el módulo
export default new FilesController();
