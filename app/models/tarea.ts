import { BaseModel, belongsTo, column, } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Estado from './estado.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'


export default class Tarea extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare titulo: string

    @column()
    declare descripcion: string | null

    @column()
    declare estadoId: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => Estado)
    declare estado: BelongsTo<typeof Estado>

    public serializeExtras() {
        return {
            createdAt: this.createdAt.toFormat('dd/MM/yyyy HH:mm'), // Formateo automático al serializar
            updatedAt: this.updatedAt.toFormat('dd/MM/yyyy HH:mm'),
        }
    }
}


