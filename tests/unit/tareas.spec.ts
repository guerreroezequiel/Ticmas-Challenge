import Tarea from '#models/tarea'
import TareaRepository from '#repository/tareas_repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import TareaController from '#controllers/tarea_controller'
import testUtils from '@adonisjs/core/services/test_utils'
import EstadoRepository from '#repository/estados_repository'
import Estado from '#models/estado'


test.group('Tareas', (group) => {

  // FAKE TAREA REPOSITORY
  class FakeTareaRepository extends TareaRepository {

    private tareas: Tarea[] = []

    public async getTareasPorEstado(estadoId: number): Promise<Tarea[]> {
      return this.tareas.filter(tarea => tarea.estadoId === estadoId)
    }
  }

  // FAKE ESTADO REPOSITORY
  class FakeEstadoRepository extends EstadoRepository {

    private estados: Estado[] = [];

    // Buscar estado por nombre
    public async getEstadoByName(nombre: string): Promise<Estado | null> {
      return this.estados.find(estado => estado.nombre === nombre) || null
    }
  }
  // SWAP REPOSITORIES
  group.setup(() => {
    app.container.swap(TareaRepository, () => new FakeTareaRepository())
    app.container.swap(EstadoRepository, () => new FakeEstadoRepository())
  })



  ////////////TESTS////////////

  // TEST: INDEX
  test('obtener todas las tareas', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    await tareaController.index(ctx)

    const tareas = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 200)
    assert.isArray(tareas)
    assert.isNotEmpty(tareas)
    console.log(tareas.length)
  })


  // TEST: SHOW
  test('obtener una tarea específica', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 1 }

    await tareaController.show(ctx)

    const responseBody = ctx.response.getBody()
    console.log(responseBody)
    assert.equal(ctx.response.getStatus(), 200)
    assert.isObject(responseBody)
    assert.property(responseBody, 'id')
    assert.equal(responseBody.id, ctx.params.id)
    assert.property(responseBody, 'titulo')
    assert.property(responseBody, 'estadoId')
    assert.property(responseBody, 'updatedAt')
    assert.property(responseBody, 'createdAt')
    assert.property(responseBody, 'deleted')
  })


  // TEST: SHOW 404
  test('devolver un 404 si la tarea no se encuentra', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 999 }

    await tareaController.show(ctx)

    assert.equal(ctx.response.getStatus(), 404)
    assert.equal(ctx.response.getBody().message, 'Tarea no encontrada')
  })


  // TEST: CREATE
  test('crear una tarea', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.request.updateBody({
      titulo: 'Nueva Tarea',
      descripcion: 'Descripción de la nueva tarea',
      estadoId: 1
    })

    await tareaController.create(ctx)

    const responseBody = ctx.response.getBody()
    console.log(responseBody)

    assert.equal(ctx.response.getStatus(), 201)
    assert.isObject(responseBody)
    assert.property(responseBody.$attributes, 'id')
    assert.isNumber(responseBody.$attributes.id)
    assert.equal(responseBody.$attributes.titulo, ctx.request.body().titulo)
    assert.equal(responseBody.$attributes.descripcion, ctx.request.body().descripcion)
    assert.equal(responseBody.$attributes.estadoId, ctx.request.body().estadoId)
  })


  // TEST: UPDATE
  test('actualizar una tarea', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 1 }

    ctx.request.updateBody({
      titulo: 'Tarea 1 Actualizada',
      descripcion: 'Descripción de la tarea 1 actualizada'
    })
    await tareaController.update(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 200)
    assert.isObject(responseBody)
    assert.equal(responseBody.id, 1)
    assert.equal(responseBody.titulo, 'Tarea 1 Actualizada')
    assert.equal(responseBody.descripcion, 'Descripción de la tarea 1 actualizada')
  })


  // TEST: DELETE
  test('eliminar una tarea (borrado lógico)', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 1 }

    await tareaController.delete(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 200)
    assert.isObject(responseBody)
    assert.equal(responseBody.message, 'Tarea marcada como eliminada correctamente')
  })


  // TEST: CAMBIAR ESTADO
  test('cambiar el estado de una tarea', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 1 }
    ctx.request.updateBody({ estadoId: 1 })

    await tareaController.cambiarEstado(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 200)
    assert.isObject(responseBody)
    assert.equal(responseBody.message, 'Estado actualizado correctamente')
    assert.equal(responseBody.tarea.estadoId, 1)
  })

  // TEST: TIEMPO PASADO
  test('calcular tiempo pasado desde la creación de una tarea', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 1 }

    await tareaController.tiempoPasado(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 200)
    assert.isObject(responseBody)
    assert.property(responseBody, 'tiempoPasado')
    assert.property(responseBody, 'fechaActual')
    assert.property(responseBody, 'fechaCreacion')
  })

  // TEST: INDEX BY ESTADO
  test('debería devolver tareas cuando el estado pendiente', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())

    const ctx = await testUtils.createHttpContext()

    // Simular los parámetros de la solicitud
    ctx.params = { estado: 'pendiente' }
    await tareaController.indexByEstado(ctx)

    const responseBody = ctx.response.getBody()
    console.log(responseBody)
    // Verificar el estado de la respuesta
    assert.equal(ctx.response.getStatus(), 200)
    assert.isArray(responseBody)
    assert.lengthOf(responseBody, 1)  // Cambia según cuántas tareas tienes
    assert.property(responseBody[0], 'titulo')
    assert.property(responseBody[0], 'estadoNombre')
    // assert.equal(responseBody[0].estadoNombre, 'Pendiente')
  })

  // TEST: INDEX BY ESTADO 404
  // test('debería devolver 404 cuando el estado no existe', async ({ assert }) => {
  //   const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
  //   const ctx = await testUtils.createHttpContext()

  //   ctx.params = { estado: 'no se va a hacer' }

  //   await tareaController.indexByEstado(ctx)

  //   const responseBody = ctx.response.getBody()

  //   assert.equal(ctx.response.getStatus(), 404)
  //   assert.property(responseBody, 'message')
  //   assert.equal(responseBody.message, 'Estado no encontrado')
  // })

  // TEST: INDEX BY ESTADO 404
  // test('debería devolver 404 cuando no hay tareas para el estado proporcionado', async ({ assert }) => {
  //   const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
  //   const ctx = await testUtils.createHttpContext()

  //   ctx.params = { estado: 'Eliminada' }  // Asumimos que no hay tareas completadas en el repositorio

  //   await tareaController.indexByEstado(ctx)

  //   const responseBody = ctx.response.getBody()

  //   assert.equal(ctx.response.getStatus(), 404)
  //   assert.property(responseBody, 'message')
  //   assert.equal(responseBody.message, 'No se encontraron tareas para el estado proporcionado')
  // })

})