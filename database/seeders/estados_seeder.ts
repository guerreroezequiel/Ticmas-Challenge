import Estado from '#models/estado'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Estado.createMany([
      { nombre: 'en progreso' },
      { nombre: 'pendiente' },
      { nombre: 'completada' },
      { nombre: 'eliminada' },
    ])
  }
}