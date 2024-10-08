import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import testUtils from '@adonisjs/core/services/test_utils'

export const plugins: Config['plugins'] = [
  assert(),
  apiClient({ baseURL: "http://localhost:3333" }), // Configura la baseURL para el cliente
  pluginAdonisJS(app),
]

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    () => testUtils.db('testing').migrate(),
    () => testUtils.db('testing').seed(),
  ],
  teardown: [],
}



export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['functional',].includes(suite.name)) {
    console.log('Starting the HTTP server')
    return suite.setup(() => testUtils.httpServer().start())
  }
}