import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import { app } from '../src/app'
import request from 'supertest'

describe('Meals', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meals', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'Frango com batata doce',
        description: 'Receita de frango com batata doce',
        rating: 5,
        type: 'within diet',
      })
      .expect(201)
  })

  it('should be able to list all meals', async () => {
    const createMealsResponse = await request(app.server).post('/meals').send({
      name: 'Frango com batata doce',
      description: 'Receita de frango com batata doce',
      rating: 5,
      type: 'within diet',
    })

    const cookies = createMealsResponse.headers['set-cookie']

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Frango com batata doce',
        description: 'Receita de frango com batata doce',
        rating: 5,
        type: 'within diet',
      }),
    ])
  })

  it('should be able to get a specific meals', async () => {
    const createMealsResponse = await request(app.server).post('/meals').send({
      name: 'Frango com batata doce',
      description: 'Receita de frango com batata doce',
      rating: 5,
      type: 'within diet',
    })

    const cookies = createMealsResponse.headers['set-cookie']

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealsResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMealsResponse.body.meal[0]).toEqual(
      expect.objectContaining({
        name: 'Frango com batata doce',
        description: 'Receita de frango com batata doce',
      }),
    )
  })
})
