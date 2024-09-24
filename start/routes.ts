import TareasController from '#controllers/tarea_controller'
import router from '@adonisjs/core/services/router'

//TAREAS
router.get('/tareas', [TareasController, 'index'])
router.get('/tareas/:id', [TareasController, 'show'])
router.post('/tareas', [TareasController, 'create'])
router.put('/tareas/:id', [TareasController, 'update'])
router.delete('/tareas/:id', [TareasController, 'delete'])

//ESTADOS
router.get('/estados', [TareasController, 'index'])
router.get('/estados/:id', [TareasController, 'show'])
router.post('/estados', [TareasController, 'create'])
router.put('/estados/:id', [TareasController, 'update'])
router.delete('/estados/:id', [TareasController, 'delete'])

