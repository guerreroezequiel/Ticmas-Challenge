import Tarea from '#models/tarea'
import TareaRepository from '#repository/tareas_repository'
import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'
import TareaController from '#controllers/tarea_controller'
import testUtils from '@adonisjs/core/services/test_utils'
import EstadoRepository from '#repository/estados_repository'
import Estado from '#models/estado'
import { DateTime } from 'luxon'


test.group('Tareas', () => {

  // FAKE TAREA REPOSITORY
  class FakeTareaRepository extends TareaRepository {

    private tareas: Tarea[] = [
      {
        id: 1,
        titulo: 'Tarea 1',
        descripcion: 'Descripción de la tarea 1',
        estadoId: 1,
        deleted: false,
        createdAt: DateTime.fromISO("2024-09-26T20:21:27.218+00:00"),
        updatedAt: DateTime.now(),
      } as Tarea,
      {
        id: 2,
        titulo: 'Tarea 2',
        descripcion: 'Descripción de la tarea 2',
        estadoId: 2,
        deleted: false,
        createdAt: DateTime.fromISO("2024-09-26T20:21:27.218+00:00"),
        updatedAt: DateTime.now(),
      } as Tarea,
    ];

    // Buscar tarea por ID
    public async find(id: number): Promise<Tarea | null> {
      return this.tareas.find(tarea => tarea.id === id) || null;
    }

    // Guardar tarea
    public async save(tarea: Tarea): Promise<Tarea> {
      const index = this.tareas.findIndex(t => t.id === tarea.id);

      if (index === -1) {
        tarea.id = this.tareas.length + 1;
        this.tareas.push(tarea);
      } else {
        this.tareas[index] = tarea;
      }

      return tarea;
    }

    public async getTareasPorEstado(estadoId: number): Promise<Tarea[]> {
      return this.tareas.filter(tarea => tarea.estadoId === estadoId)
    }

  }

  // FAKE ESTADO REPOSITORY
  class FakeEstadoRepository extends EstadoRepository {

    private estados: Estado[] = [
      { id: 1, nombre: 'En Progreso' } as Estado,
      { id: 2, nombre: 'Pendiente' } as Estado,
      { id: 3, nombre: 'Completada' } as Estado,
      { id: 4, nombre: 'Eliminada' } as Estado,
    ];

    // Buscar estado por ID
    public async find(id: number): Promise<Estado | null> {
      return this.estados.find(estado => estado.id === id) || null;
    }

    // Buscar estado por nombre
    public async getEstadoByName(nombre: string): Promise<Estado | null> {
      return this.estados.find(estado => estado.nombre === nombre) || null
    }
  }
  // SWAP REPOSITORIES
  app.container.swap(TareaRepository, () => new FakeTareaRepository())
  app.container.swap(EstadoRepository, () => new FakeEstadoRepository())





  // TEST: INDEX
  test('obtener todas las tareas', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    await tareaController.index(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 200)
    assert.isArray(responseBody)
    assert.isNotEmpty(responseBody)
    assert.property(responseBody[0], 'id')
    assert.property(responseBody[0], 'titulo')
    assert.property(responseBody[0], 'descripcion')
  })


  // TEST: SHOW
  test('obtener una tarea específica', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { id: 1 }

    await tareaController.show(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 200)
    assert.isObject(responseBody)
    assert.equal(responseBody.id, 1)
    assert.equal(responseBody.titulo, 'Tarea 1')
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

    assert.equal(ctx.response.getStatus(), 201)
    assert.isObject(responseBody)
    assert.property(responseBody, 'id')
    assert.equal(responseBody.titulo, 'Nueva Tarea')
    assert.equal(responseBody.descripcion, 'Descripción de la nueva tarea')
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
    ctx.params = { estado: 'Pendiente' }

    await tareaController.indexByEstado(ctx)

    const responseBody = ctx.response.getBody()

    // Verificar el estado de la respuesta
    assert.equal(ctx.response.getStatus(), 200)
    assert.isArray(responseBody)
    assert.lengthOf(responseBody, 1)  // Cambia según cuántas tareas tienes
    assert.property(responseBody[0], 'titulo')
    assert.property(responseBody[0], 'estadoNombre')
    assert.equal(responseBody[0].estadoNombre, 'Pendiente')
  })

  // TEST: INDEX BY ESTADO 404
  test('debería devolver 404 cuando el estado no existe', async ({ assert }) => {
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
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
    const tareaController = new TareaController(new FakeTareaRepository(), new FakeEstadoRepository())
    const ctx = await testUtils.createHttpContext()

    ctx.params = { estado: 'Eliminada' }  // Asumimos que no hay tareas completadas en el repositorio

    await tareaController.indexByEstado(ctx)

    const responseBody = ctx.response.getBody()

    assert.equal(ctx.response.getStatus(), 404)
    assert.property(responseBody, 'message')
    assert.equal(responseBody.message, 'No se encontraron tareas para el estado proporcionado')
  })

})