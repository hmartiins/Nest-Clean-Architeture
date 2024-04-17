import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/app.module'

import request from 'supertest'
import { PrismaService } from '@/prisma/prisma.service'
import { hash } from 'bcryptjs'

describe('Authenticate (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    prisma = module.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
