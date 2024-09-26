import Tarea from '#models/tarea'
import TareaRepository from '#repository/tareas_repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import TareaController from '#controllers/tarea_controller'
import testUtils from '@adonisjs/core/services/test_utils'
import EstadoRepository from '#repository/estados_repository'
import Estado from '#models/estado'

test.group('Tareas', () => {

  // FAKE TAREA REPOSITORY
  class FakeTareaRepository extends TareaRepository {
    async find(): Promise<Tarea | null> {
      const tarea = new Tarea()
      tarea.merge({
        id: 1,
        titulo: 'Tarea 1',
        descripcion: 'Descripción de la tarea 1',
        estadoId: 1,
        deleted: false,
      })

      return tarea
    }

    async getTareaById(): Promise<Tarea | null> {
      const tarea = new Tarea()
      tarea.merge({
        id: 1,
        titulo: 'Tarea 1',
        descripcion: 'Descripción de la tarea 1',
        estadoId: 1,
        deleted: false,
      })

      return tarea
    }
  }

  // FAKE ESTADO REPOSITORY
  class FakeEstadoRepository extends EstadoRepository {
    async find(): Promise<Estado | null> {
      const estado = new Estado()
      estado.merge({
        id: 2,
        nombre: 'Pendiente'
      })
      return estado
    }
  }

  // SWAP REPOSITORIES
  app.container.swap(TareaRepository, () => {
    return new FakeTareaRepository()
  })

  app.container.swap(EstadoRepository, () => {
    return new FakeEstadoRepository()
  })

  test('obtener todas las tareas', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()
    await tareaController.index(ctx)

  })

  test('get all users 1', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()
    await tareaController.show(ctx)
    console.log(ctx.response.getBody())
    assert.equal(ctx.response.getStatus(), 200)
    assert.equal(ctx.response.getBody().id, 'asdfsd')
  })

})
