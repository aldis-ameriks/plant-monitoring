import { FastifyInstance } from 'fastify'
import { Knex } from 'knex'
import * as seeds from '../../test-helpers/seeds'
import { setupGraphql } from '../../test-helpers/setupGraphql'
import { ReadingEntity } from '../../types/entities'

const gql = setupGraphql()

let app: FastifyInstance
let knex: Knex

beforeEach(() => {
  app = gql.app
  knex = gql.knex
})

describe('Device.lastReading', () => {
  const id = seeds.device.id
  const query = `
      query {
        device(id: "${id}") {
          id
          lastReading {
            time          
            light
            moisture
            temperature
            batteryVoltage
          }
        }
      }
`

  test('returns null when there are no readings', async () => {
    const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    const parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        device: {
          id,
          lastReading: null
        }
      }
    })
  })

  test('returns last reading', async () => {
    const reading = {
      ...seeds.reading,
      time: new Date(),
      battery_voltage: '1',
      light: '2',
      moisture: '3',
      temperature: '4'
    }
    const past = new Date()
    past.setDate(past.getDate() - 1)
    const reading2 = {
      ...seeds.reading,
      time: past,
      battery_voltage: '11',
      light: '22',
      moisture: '33',
      temperature: '44'
    }

    await knex<ReadingEntity>('readings').insert([reading, reading2])

    let result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    let parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        device: {
          id,
          lastReading: {
            batteryVoltage: parseFloat(reading.battery_voltage),
            light: parseFloat(reading.light),
            moisture: parseFloat(reading.moisture),
            temperature: parseFloat(reading.temperature),
            time: reading.time.toISOString()
          }
        }
      }
    })

    const reading3 = {
      ...seeds.reading,
      time: new Date(),
      battery_voltage: '111',
      light: '222',
      moisture: '333',
      temperature: '444'
    }
    await knex<ReadingEntity>('readings').insert(reading3)

    result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        device: {
          id,
          lastReading: {
            batteryVoltage: parseFloat(reading3.battery_voltage),
            light: parseFloat(reading3.light),
            moisture: parseFloat(reading3.moisture),
            temperature: parseFloat(reading3.temperature),
            time: reading3.time.toISOString()
          }
        }
      }
    })
  })
})

describe('Device.lastWateredTime', () => {
  const id = seeds.device.id
  const query = `
      query {
        device(id: "${id}") {
          id
          lastWateredTime
        }
      }
`

  test('has never been watered', async () => {
    const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    const parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        device: {
          id,
          lastWateredTime: null
        }
      }
    })
  })

  test('has been watered very long ago', async () => {
    const time1 = new Date()
    time1.setDate(time1.getDate() - 361)
    const reading1 = { ...seeds.reading, time: time1, moisture: '1' }

    const time2 = new Date()
    time2.setDate(time2.getDate() - 360)
    const reading2 = { ...seeds.reading, time: time2, moisture: '40' }

    await knex('readings').insert([reading1, reading2])

    const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    const parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        device: {
          id,
          lastWateredTime: null
        }
      }
    })
  })

  test('has been watered', async () => {
    const time1 = new Date()
    time1.setDate(time1.getDate() - 11)
    const reading1 = { ...seeds.reading, time: time1, moisture: '1' }

    const time2 = new Date()
    time2.setDate(time2.getDate() - 10)
    const reading2 = { ...seeds.reading, time: time2, moisture: '40' }

    await knex('readings').insert([reading1, reading2])

    const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    const parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        device: {
          id,
          lastWateredTime: time2.toISOString()
        }
      }
    })
  })
})

describe('Device.readings', () => {
  const id = seeds.device.id
  const query = `
      query {
        device(id: "${id}") {
          id
          readings {
            time
            temperature
            moisture
            light
            batteryVoltage
          }
        }
      }
`

  test('works when there are no readings', async () => {
    await knex('readings').where('device_id', seeds.device.id).del()
    const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    const parsedBody = JSON.parse(result.body)
    expect(parsedBody).toEqual({
      data: {
        device: {
          id,
          readings: []
        }
      }
    })
  })

  test('returns time bucketed daily readings', async () => {
    await knex('readings').where('device_id', seeds.device.id).del()

    const reading1 = {
      ...seeds.reading,
      time: new Date('2022-12-25T12:00:00.000Z'),
      moisture: '10',
      battery_voltage: 1,
      light: 100,
      temperature: 20
    }
    const reading2 = {
      ...seeds.reading,
      time: new Date('2022-12-25T12:00:00.001Z'),
      moisture: '20',
      battery_voltage: 2,
      light: 200,
      temperature: 40
    }
    await knex('readings').insert([reading1, reading2])

    const result = await app.inject({ method: 'POST', url: '/graphql', payload: { query } })
    const parsedBody = JSON.parse(result.body)
    expect(parsedBody.data.device.readings.length).toBeGreaterThan(1)
    expect(parsedBody.data.device.readings[0]).toMatchObject({
      batteryVoltage: 1.5,
      light: 150,
      moisture: 15,
      temperature: 30
    })
  })
})
