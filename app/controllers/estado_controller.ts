import { HttpContext } from '@adonisjs/core/http'
import Estado from '#models/estado'

export default class EstadoController {

    // CREAR UN ESTADO
    public async create({ request, response }: HttpContext) {
        const data = request.only(['nombre'])

        try {
            const estado = new Estado()
            estado.merge(data)

            const savedEstado = await estado.save()
            return response.status(201).json(savedEstado)
        } catch (error) {
            if (error.messages) {
                return response.status(400).json({ message: 'Error al procesar los datos', error: error.messages })
            }
            return response.status(500).json({ message: 'Error al crear el estado', error: error.message })
        }
    }

    // ACTUALIZAR UN ESTADO
    public async update({ params, request, response }: HttpContext) {
        const id = params.id
        const data = request.only(['nombre'])

        try {
            const estado = await Estado.find(id)
            if (!estado) {
                return response.status(404).json({ message: 'Estado no encontrado' })
            }

            estado.merge(data) // Actualiza los campos del estado con los datos recibidos
            const updatedEstado = await estado.save()
            return response.status(200).json(updatedEstado)
        } catch (error) {
            if (error.messages) {
                return response.status(400).json({ message: 'Error al procesar los datos', error: error.messages })
            }
            return response.status(500).json({ message: 'Error al actualizar el estado', error: error.message })
        }
    }


    // VER TODOS LOS ESTADOS
    public async index({ response }: HttpContext) {
        try {
            const estados = await Estado.query()

            const estadosJson = estados.map(estado => estado.toJSON())

            return response.status(200).json(estadosJson)
        } catch (error) {
            return response.status(500).json({ message: 'Error al obtener los estados', error: error.message })
        }
    }

    // VER UN ESTADO
    public async show({ params, response }: HttpContext) {
        const id = params.id

        try {
            const estado = await Estado.find(id)
            if (!estado) {
                return response.status(404).json({ message: 'Estado no encontrado' })
            }

            const estadoJson = estado.toJSON()

            return response.status(200).json(estadoJson)
        } catch (error) {
            return response.status(500).json({ message: 'Error al obtener el estado', error: error.message })
        }
    }

    // ELIMINAR UN ESTADO
    public async delete({ params, response }: HttpContext) {
        const id = params.id

        try {
            const estado = await Estado.find(id)
            if (!estado) {
                return response.status(404).json({ message: 'Estado no encontrado' })
            }
            await estado.delete()
            return response.status(200).json({ message: 'Estado eliminado correctamente' })
        } catch (error) {
            return response.status(500).json({ message: 'Error al eliminar el estado', error: error.message })
        }
    }
}