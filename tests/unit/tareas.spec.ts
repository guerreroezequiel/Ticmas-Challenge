import Tarea from '#models/tarea'
import TareaRepository from '#repository/tareas_repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import TareaController from '#controllers/tarea_controller'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Tareas', () => {

  class FakeService extends TareaRepository {
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
  app.container.swap(TareaRepository, () => {
    return new FakeService()
  })

  test('get all users 2', async ({ assert }) => {


    const tareaController = new TareaController(new FakeService())
    const ctx = await testUtils.createHttpContext()
    ctx.params = { id: 1 }
    await tareaController.show(ctx)
    console.log(ctx.response.getBody())

    assert.equal(ctx.response.getStatus(), 200)
    assert.equal(ctx.response.getBody().id, 2)
  })

  test('get all users 1', async ({ assert }) => {
    const tareaController = new TareaController(new FakeService())
    const ctx = await testUtils.createHttpContext()
    await tareaController.show(ctx)
    console.log(ctx.response.getBody())
    assert.equal(ctx.response.getStatus(), 200)
    assert.equal(ctx.response.getBody().id, 'asdfsd')
  })

})
