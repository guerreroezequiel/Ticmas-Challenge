import Tarea from '#models/tarea';

export default class TareaRepository {
    constructor() {
    }

    async find(id: number) {
        return await Tarea.find(id);
    }

    async getTareaById(id: number) {
        const tarea = await Tarea.query()
            .where('id', id)
            .preload('estado', (query) => {
                query.select('nombre')
            }).first();
        return tarea;
    }
}