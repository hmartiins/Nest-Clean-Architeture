import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/app.module'

import request from 'supertest'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

import { describe, expect, test, beforeAll } from 'vitest'

describe('Fetch Recent Questions (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    prisma = module.get(PrismaService)
    jwt = module.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 1',
          content: 'This is the first question',
          slug: 'question-1',
          authorId: user.id,
        },
        {
          title: 'Question 2',
          content: 'This is the second question',
          slug: 'question-2',
          authorId: user.id,
        },
        {
          title: 'Question 3',
          content: 'This is the third question',
          slug: 'question-3',
          authorId: user.id,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 1' }),
        expect.objectContaining({ title: 'Question 2' }),
        expect.objectContaining({ title: 'Question 3' }),
      ],
    })
  })
})
