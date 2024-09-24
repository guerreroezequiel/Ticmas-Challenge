import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Estado from './estado.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'


export default class Tarea extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare descripcion: string | null

    @column()
    declare estadoId: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @hasOne(() => Estado)
    declare estado: HasOne<typeof Estado>
}


