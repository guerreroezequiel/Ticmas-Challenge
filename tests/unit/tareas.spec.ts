import TareaRepository from '#repository/tareas_repository'
import { test } from '@japa/runner'
import TareaController from '#controllers/tarea_controller'
import testUtils from '@adonisjs/core/services/test_utils'
import EstadoRepository from '#repository/estados_repository'
import Estado from '#models/estado'
import EstadoController from '#controllers/estado_controller'



test.group('Tareas', (group) => {

  // Iniciar una transacción global para cada grupo de pruebas, apunta a la base de datos de testing
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  ////////////TESTS////////////

  // TEST: comprobar tareas
  test('obtener todas las tareas', async ({ assert }) => {
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())
    const ctx = await testUtils.createHttpContext()

    await tareaController.index(ctx)

    const tareas = ctx.response.getBody()
    console.log('tareas:' + tareas.length)

    assert.equal(ctx.response.getStatus(), 200)
    assert.isArray(tareas)
    assert.isNotEmpty(tareas)
  })

  //TEST: comprobar estados
  test('comprobar estados', async ({ assert }) => {
    const estadoController = new EstadoController()
    const ctx = await testUtils.createHttpContext()

    await estadoController.index(ctx)

    const responseBody = ctx.response.getBody()
    console.log('estados:' + responseBody.length)

    assert.equal(ctx.response.getStatus(), 200)
    assert.isArray(responseBody)
    assert.isNotEmpty(responseBody)
    responseBody.forEach((estado: Estado) => {
      assert.property(estado, 'id')
      assert.property(estado, 'nombre')
    })
  })


  // TEST: SHOW
  test('obtener una tarea específica', async ({ assert }) => {
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 1 }

    await tareaController.show(ctx)

    const responseBody = ctx.response.getBody()

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
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 999 }

    await tareaController.show(ctx)

    assert.equal(ctx.response.getStatus(), 404)
    assert.equal(ctx.response.getBody().message, 'Tarea no encontrada')
  })


  // TEST: CREATE
  test('crear una tarea', async ({ assert }) => {
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.request.updateBody({
      titulo: 'Nueva Tarea',
      descripcion: 'Descripción de la nueva tarea',
      estadoId: 1
    })

    await tareaController.create(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 201)
    assert.isObject(responseBody)
    assert.property(responseBody.$attributes, 'id')
    assert.isNumber(responseBody.$attributes.id)
    assert.equal(responseBody.$attributes.titulo, ctx.request.body().titulo)
    assert.equal(responseBody.$attributes.descripcion, ctx.request.body().descripcion)
    assert.equal(responseBody.$attributes.estadoId, ctx.request.body().estadoId)
  })


  // TEST: UPDATE titulo o descripción
  test('actualizar una tarea', async ({ assert }) => {
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())
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
    assert.equal(responseBody.id, ctx.params.id)
    assert.equal(responseBody.titulo, ctx.request.body().titulo)
    assert.equal(responseBody.descripcion, ctx.request.body().descripcion)
  })


  // TEST: DELETE
  test('eliminar una tarea (borrado lógico)', async ({ assert }) => {
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 2 }

    await tareaController.delete(ctx)

    const responseBody = ctx.response.getBody()
    assert.equal(ctx.response.getStatus(), 200)
    assert.equal(ctx.response.getStatus(), 200)
    assert.isObject(responseBody)
    assert.equal(responseBody.deletedTarea.$attributes.id, ctx.params.id)
    assert.equal(responseBody.deletedTarea.$attributes.deleted, true)
  })


  // TEST: actualizar ESTADO
  test('cambiar el estado de una tarea', async ({ assert }) => {
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 1 }
    ctx.request.updateBody({ estadoId: 3 })

    await tareaController.cambiarEstado(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 200)
    assert.isObject(responseBody)
    assert.equal(responseBody.message, 'Estado actualizado correctamente')
    assert.equal(responseBody.tarea.estadoId, ctx.request.body().estadoId)
  })

  // TEST: TIEMPO PASADO
  test('calcular tiempo pasado desde la creación de una tarea', async ({ assert }) => {
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())
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
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())

    const ctx = await testUtils.createHttpContext()

    // Simular los parámetros de la solicitud
    ctx.params = { estado: 'pendiente' }
    await tareaController.indexByEstado(ctx)

    const responseBody = ctx.response.getBody()
    // Verificar el estado de la respuesta
    assert.equal(ctx.response.getStatus(), 200)
    assert.isArray(responseBody)
    assert.lengthOf(responseBody, 1)  // Cambia según cuántas tareas tienes
    assert.property(responseBody[0], 'titulo')
    assert.property(responseBody[0], 'estadoNombre')
    // assert.equal(responseBody[0].estadoNombre, 'Pendiente')
  })

  // TEST: INDEX BY ESTADO 404
  test('debería devolver 404 cuando el estado no existe', async ({ assert }) => {
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { estado: 'no se va a hacer' }

    await tareaController.indexByEstado(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 404)
    assert.property(responseBody, 'message')
    assert.equal(responseBody.message, 'Estado no encontrado')
  })

  // TEST: INDEX BY ESTADO 404
  test('debería devolver 404 cuando no hay tareas para el estado proporcionado', async ({ assert }) => {
    const tareaController = new TareaController(new TareaRepository(), new EstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { estado: 'eliminada' }  // Asumimos que no hay tareas con estado eliminada en el repositorio

    await tareaController.indexByEstado(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 404)
    assert.property(responseBody, 'message')
    assert.equal(responseBody.message, 'No se encontraron tareas para el estado proporcionado')
  })


})