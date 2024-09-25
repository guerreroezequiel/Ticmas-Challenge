import '@japa/runner'
import { ApiClient } from '@japa/api-client'
import { Assert } from '@japa/assert'

declare module '@japa/runner' {
    interface TestContext {
        client: ApiClient
        assert: Assert
    }
}