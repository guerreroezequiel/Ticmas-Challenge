import { HttpContext } from '@adonisjs/core/http'
import Tarea from '#models/tarea'
import Estado from '#models/estado'
import { DateTime } from 'luxon'

export default class TareasController {

    // CREAR UNA TAREA
    public async create({ request, response }: HttpContext) {
        const data = request.only(['titulo', 'descripcion', 'estadoId'])

        try {
            const tarea = new Tarea()
            tarea.merge(data)
            const savedTarea = await tarea.save()

            return response.status(201).json(savedTarea)
        } catch (error) {
            if (error.messages) {
                return response.status(400).json({ message: 'Error al procesar los datos', error: error.messages })
            }
            return response.status(500).json({ message: 'Error al crear la tarea', error: error.message })
        }
    }


    // ACTUALIZAR UNA TAREA
    public async update({ params, request, response }: HttpContext) {
        const data = request.only(['titulo', 'descripcion', 'estadoId'])

        try {
            const tarea = await Tarea.find(params.id)
            if (!tarea) {
                return response.status(404).json({ message: 'Tarea no encontrada' })
            }

            tarea.merge(data) // Actualiza los campos de la tarea con los datos recibidos
            const updatedTarea = await tarea.save()

            return response.status(200).json(updatedTarea)
        } catch (error) {
            if (error.messages) {
                return response.status(400).json({ message: 'Error al procesar los datos', error: error.messages })
            }
            return response.status(500).json({ message: 'Error al actualizar la tarea', error: error.message })
        }
    }


    // VER TODAS LAS TAREAS
    public async index({ response }: HttpContext) {
        try {
            const tareas = await Tarea.query()
                .preload('estado', (query) => {
                    query.select('nombre')
                })

            const tareasConEstado = tareas.map(tarea => {
                const tareaJson = tarea.toJSON()
                tareaJson.estadoNombre = tarea.estado.nombre
                delete tareaJson.estado
                return tareaJson
            })

            return response.status(200).json(tareasConEstado)
        } catch (error) {
            return response.status(500).json({ message: 'Error al obtener las tareas', error: error.message })
        }
    }


    // VER UNA TAREA
    public async show({ params, response }: HttpContext) {
        const id = params.id

        try {
            const tarea = await Tarea.query()
                .where('id', id)
                .preload('estado', (query) => {
                    query.select('nombre')
                }).first()

            if (!tarea) {
                return response.status(404).json({ message: 'Tarea no encontrada' })
            }

            const tareaJson = tarea.toJSON()
            tareaJson.estadoNombre = tarea.estado.nombre
            delete tareaJson.estado

            return response.status(200).json(tareaJson)
        } catch (error) {
            return response.status(500).json({ message: 'Error al obtener la tarea', error: error.message })
        }
    }


    // VER TAREAS POR ID DE ESTADO
    public async indexByEstado({ params, response }: HttpContext) {
        const estadoId = params.estadoId

        try {
            const tareas = await Tarea.query()
                .where('estadoId', estadoId)
                .preload('estado', (query) => {
                    query.select('nombre')
                })

            const tareasConEstado = tareas.map(tarea => {
                const tareaJson = tarea.toJSON()
                tareaJson.estadoNombre = tarea.estado.nombre
                delete tareaJson.estado

                return tareaJson
            })

            return response.status(200).json(tareasConEstado)
        } catch (error) {
            return response.status(500).json({ message: 'Error al obtener las tareas por estado', error: error.message })
        }
    }


    // ELIMINAR UNA TAREA
    public async delete({ params, response }: HttpContext) {
        const id = params.id

        try {
            const tarea = await Tarea.query().where('id', id).preload('estado').first()
            if (!tarea) {
                return response.status(404).json({ message: 'Tarea no encontrada' })
            }
            await tarea.delete()
            return response.status(200).json({ message: 'Tarea eliminada correctamente' })
        } catch (error) {
            return response.status(500).json({ message: 'Error al eliminar la tarea', error: error.message })
        }
    }


    // CAMBIAR EL ESTADO DE UNA TAREA
    async cambiarEstado({ params, request, response }: HttpContext) {
        try {
            const tarea = await Tarea.find(params.id);
            if (!tarea) {
                return response.status(404).json({ message: 'Tarea no encontrada' });
            }

            const { estadoId } = request.only(['estadoId']);
            const estado = await Estado.find(estadoId);

            if (!estado) {
                return response.status(400).json({ message: 'Estado no encontrado' });
            }

            tarea.estadoId = estadoId;
            await tarea.save();

            return response.json({ message: 'Estado actualizado correctamente', tarea });
        } catch (error) {
            return response.status(500).json({ message: 'Error al actualizar el estado', error });
        }
    }

    // CALCULAR TIEMPO PASADO DESDE LA CREACION DE UNA TAREA   
    public async tiempoPasado({ params, response }: HttpContext) {
        const id = params.id

        try {
            // Buscar la tarea por ID
            const tarea = await Tarea.find(id);
            if (!tarea) {
                return response.status(404).json({ message: 'Tarea no encontrada' });
            }

            // Calcular la diferencia en días, horas y minutos
            const diff = DateTime.now().diff(tarea.createdAt, ['days', 'hours', 'minutes']).toObject();
            const tiempoPasadoFormateado = `${Math.floor(diff.days ?? 0)} días, ${Math.floor(diff.hours ?? 0)} horas, ${Math.floor(diff.minutes ?? 0)} minutos`;

            return response.status(200).json({
                tiempoPasado: tiempoPasadoFormateado,
                fechaActual: DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
                fechaCreacion: tarea.createdAt.toFormat('dd/MM/yyyy HH:mm')
            });
        } catch (error) {
            console.error('Error al obtener el tiempo pasado:', error);
            return response.status(500).json({ message: 'Error al obtener el tiempo pasado', error: error.message });
        }
    }
}