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

    async getEstadoByName(nombre: string) {
        return await Estado.query().where('nombre', nombre).first()
    }
}