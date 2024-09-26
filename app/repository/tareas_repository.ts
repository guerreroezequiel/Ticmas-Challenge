import Tarea from '#models/tarea';

export default class TareaRepository {
    constructor() {
    }

    async find(id: number) {
        return await Tarea.find(id);
    }

    async getTareaConEstado(id: number) {
        const tarea = await Tarea.query()
            .where('id', id)
            .preload('estado', (query) => {
                query.select('nombre')
            }).first();
        return tarea;
    }

    async getTareasConEstado() {
        const tarea = await Tarea.query()
            .preload('estado', (query) => {
                query.select('nombre')
            })
        return tarea;
    }

    async getTareasPorEstado(estadoId: number) {
        const tarea = await Tarea.query()
            .where('estadoId', estadoId)
            .preload('estado', (query) => {
                query.select('nombre')
            })
        return tarea;
    }

    async save(tarea: Tarea): Promise<Tarea> {
        return await tarea.save()
    }
}