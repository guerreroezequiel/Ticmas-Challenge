import { HttpContext } from '@adonisjs/core/http'
import Tarea from '#models/tarea'

export default class TareasController {

    // CREAR UNA TAREA
    public async create({ request, response }: HttpContext) {
        const data = request.only(['descripcion', 'estadoId'])

        // Validar y combinar los datos
        const tarea = new Tarea()
        try {
            tarea.merge(data)
        } catch (error) {
            return response.status(400).json({ message: 'Error al procesar los datos', error: error.message })
        }

        // Guardar la tarea
        return tarea.save()
            .then((savedTarea) => {
                return response.status(201).json(savedTarea)
            })
            .catch((error) => {
                return response.status(500).json({ message: 'Error al crear la tarea', error: error.message })
            })
    }


    // ACTUALIZAR UNA TAREA
    public async update({ params, request, response }: HttpContext) {
        const id = params.id
        const data = request.only(['descripcion', 'estadoId'])

        // Buscar la tarea por ID
        const tarea = await Tarea.find(id)
        if (!tarea) {
            return response.status(404).json({ message: 'Tarea no encontrada' })
        }

        // Validar y combinar los datos
        try {
            tarea.merge(data)
        } catch (error) {
            return response.status(400).json({ message: 'Error al procesar los datos', error: error.message })
        }

        // Guardar la tarea actualizada
        return tarea.save()
            .then((updatedTarea) => {
                return response.status(200).json(updatedTarea)
            })
            .catch((error) => {
                return response.status(500).json({ message: 'Error al actualizar la tarea', error: error.message })
            })
    }


    // VER TODAS LAS TAREAS
    public async index({ response }: HttpContext) {
        return Tarea.query().preload('estado')
            .then((tareas) => {
                return response.status(200).json(tareas)
            })
            .catch((error) => {
                return response.status(500).json({ message: 'Error al obtener las tareas', error: error.message })
            })
    }

    // VER UNA TAREA
    public async show({ params, response }: HttpContext) {
        const id = params.id

        return Tarea.find(id)
            .then((tarea) => {
                if (!tarea) {
                    return response.status(404).json({ message: 'Tarea no encontrada' })
                }
                return response.status(200).json(tarea)
            })
            .catch((error) => {
                return response.status(500).json({ message: 'Error al obtener la tarea', error: error.message })
            })
    }

    // ELIMINAR UNA TAREA
    public async delete({ params, response }: HttpContext) {
        const id = params.id

        return Tarea.query().where('id', id).preload('estado').first()
            .then((tarea) => {
                if (!tarea) {
                    return response.status(404).json({ message: 'Tarea no encontrada' })
                }
                return tarea.delete().then(() => {
                    return response.status(200).json({ message: 'Tarea eliminada correctamente' })
                })
            })
            .catch((error) => {
                return response.status(500).json({ message: 'Error al eliminar la tarea', error: error.message })
            })
    }
}