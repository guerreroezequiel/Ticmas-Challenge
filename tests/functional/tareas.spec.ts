import { test } from '@japa/runner'

test.group('Tareas', () => {
  test('debería devolver la lista de tareas', async ({ client }) => {
    const response = await client.get('/tareas')

    // Asegúrate de que la respuesta tiene estado 200
    response.assertStatus(200)

    // Verificar que el cuerpo de la respuesta es un array
    assert.isArray(response.body())
  })
})