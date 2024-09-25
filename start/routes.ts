import EstadoController from '#controllers/estado_controller'
import TareaController from '#controllers/tarea_controller'
import router from '@adonisjs/core/services/router'

//TAREAS
router.get('/tareas', [TareaController, 'index'])
router.get('/tareas/:id', [TareaController, 'show'])
router.post('/tareas', [TareaController, 'create'])
router.put('/tareas/:id', [TareaController, 'update'])
router.delete('/tareas/:id', [TareaController, 'delete'])
router.get('/tareas/estado/:estadoId', [TareaController, 'indexByEstado'])
router.put('/tareas/:id/cambiar-estado', [TareaController, 'cambiarEstado']);
router.get('/tareas/:id/tiempo-pasado', [TareaController, 'tiempoPasado']);

//ESTADOS
router.get('/estados', [EstadoController, 'index'])
router.get('/estados/:id', [EstadoController, 'show'])
router.post('/estados', [EstadoController, 'create'])
router.put('/estados/:id', [EstadoController, 'update'])
router.delete('/estados/:id', [EstadoController, 'delete'])

