import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'

import request from 'supertest'
import { JwtService } from '@nestjs/jwt'

import { describe, expect, test, beforeAll } from 'vitest'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from 'test/factories/make-question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

describe('Get Question By Slug (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = module.createNestApplication()
    jwt = module.get(JwtService)
    studentFactory = module.get(StudentFactory)
    questionFactory = module.get(QuestionFactory)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    await questionFactory.makePrismaQuestion({
      authorId: student.id,
      title: 'Question 1',
      slug: Slug.create('question-1'),
    })

    const response = await request(app.getHttpServer())
      .get('/questions/question-1')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({ title: 'Question 1' }),
    })
  })
})
