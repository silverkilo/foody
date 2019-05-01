const request = require('supertest')
const app = require('../../index')
const seed = require('../../seed')
let agent;


beforeEach(async () => {
    agent = request.agent(app)
    await seed()
})

describe('Categories', () => {
    describe('GET', () => {
        test('Returns all categories', async () => {
            const { body } = await agent.get('/api/categories').expect(200)

            console.log(body)
        })
    })
})