import app from '../src/server'
import request from 'supertest'
import { ItemSelectionInput } from '../src/Entities/Input/ItemSelectionInput'
import { ItemFactory } from './Factories/ItemFactory'

describe('Warehouse optimization test!', () => {
  const itemFactory = new ItemFactory()

  it('Will throw an error if input is an empty object', async () => {
    const response = await request(app).post('/fill-inventory')

    expect(response.status).toBe(400)
    expect(response.text).toContain('Request body cannot be an empty object')
  })

  it('Will throw an error if items is an empty array', async () => {
    const input = {
      totalSpace: 200,
      items: [],
    }
    const response = await request(app).post('/fill-inventory').send(input)

    expect(response.status).toBe(400)
    expect(response.text).toContain('items must not be an empty array')
  })

  it('Will throw an error if items array contains null or undefined', async () => {
    const nullInput = {
      totalSpace: 200,
      items: [null],
    }

    const undefinedInput = {
      totalSpace: 200,
      items: [undefined],
    }
    const nullResponse = await request(app).post('/fill-inventory').send(nullInput)
    const undefinedResponse = await request(app).post('/fill-inventory').send(undefinedInput)

    expect(nullResponse.status).toBe(500)
    expect(nullResponse.text).toContain('Array cannot contain null or undefined values')

    expect(undefinedResponse.status).toBe(500)
    expect(undefinedResponse.text).toContain('Array cannot contain null or undefined values')
  })

  it('Will throw an error if total space is out of bounds', async () => {
    const item = itemFactory.create()
    const minTotalSpaceInput = new ItemSelectionInput({
      totalSpace: 20,
      items: [item],
    })

    const maxTotalSpaceInput = new ItemSelectionInput({
      totalSpace: 500,
      items: [item],
    })

    const lessThanMinSpaceResponse = await request(app).post('/fill-inventory').send(minTotalSpaceInput)
    const moreThanMinSpaceResponse = await request(app).post('/fill-inventory').send(maxTotalSpaceInput)

    expect(lessThanMinSpaceResponse.status).toBe(400)
    expect(lessThanMinSpaceResponse.text).toContain('totalSpace must not be less than 50')

    expect(moreThanMinSpaceResponse.status).toBe(400)
    expect(moreThanMinSpaceResponse.text).toContain('totalSpace must not be greater than 400')
  })

  it('Should return status 200 if it was a success', async () => {
    const item = itemFactory.create()

    const input = new ItemSelectionInput({
      totalSpace: 200,
      items: [item],
    })
    const response = await request(app).post('/fill-inventory').send(input)

    expect(response.status).toBe(200)
  })
})
