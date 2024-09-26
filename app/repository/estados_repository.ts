import Estado from "#models/estado";

export default class EstadoRepository {
    constructor() {
    }

    async find(id: number) {
        return await Estado.find(id);
    }

    async save(estado: Estado): Promise<Estado> {
        return await estado.save()
    }
}