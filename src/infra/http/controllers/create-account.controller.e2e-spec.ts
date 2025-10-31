import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'

import request from 'supertest'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { describe, expect, test, beforeAll } from 'vitest'

describe('Create Account (e2e)', () => {
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

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Test User',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.status).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: 'johndoe@example.com' },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
