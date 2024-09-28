import Estado from '#models/estado'
import Tarea from '#models/tarea';
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon';

export default class extends BaseSeeder {

    async run() {
        await Estado.createMany([
            { id: 1, nombre: 'en progreso' },
            { id: 2, nombre: 'pendiente' },
            { id: 3, nombre: 'completada' },
            { id: 4, nombre: 'eliminada' },
        ]);

        await Tarea.createMany([
            {
                titulo: 'Nueva Tarea 1',
                descripcion: 'Descripción de la nueva tarea 1',
                deleted: false,
                estadoId: 1,
                updatedAt: DateTime.fromISO('2024-09-28T00:16:36.000Z'),
                createdAt: DateTime.fromISO('2024-08-28T00:16:36.000Z'),
            },
            {
                titulo: 'Nueva Tarea 2',
                descripcion: 'Descripción de la nueva tarea 2',
                deleted: false,
                estadoId: 2,
                updatedAt: DateTime.fromISO('2024-09-28T00:16:36.000Z'),
                createdAt: DateTime.fromISO('2024-07-28T00:16:36.000Z'),
            },
            {
                titulo: 'Nueva Tarea 3',
                descripcion: 'Descripción de la nueva tarea 3',
                deleted: false,
                estadoId: 3,
                updatedAt: DateTime.fromISO('2024-09-28T00:16:36.000Z'),
                createdAt: DateTime.fromISO('2024-06-28T00:16:36.000Z'),
            },
        ]);

    }
}