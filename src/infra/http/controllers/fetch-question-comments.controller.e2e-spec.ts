import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'

import request from 'supertest'
import { JwtService } from '@nestjs/jwt'

import { describe, expect, test, beforeAll } from 'vitest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'

describe('Fetch Question Comments (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = module.createNestApplication()
    jwt = module.get(JwtService)
    studentFactory = module.get(StudentFactory)
    questionFactory = module.get(QuestionFactory)
    questionCommentFactory = module.get(QuestionCommentFactory)

    await app.init()
  })

  test('[GET] /questions/:id/comments', async () => {
    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    await Promise.all([
      questionCommentFactory.makePrismaQuestionComment({
        authorId: student.id,
        questionId: question.id,
        content: 'Comment 1',
      }),
      questionCommentFactory.makePrismaQuestionComment({
        authorId: student.id,
        questionId: question.id,
        content: 'Comment 2',
      }),
    ])

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: 'Comment 2' }),
        expect.objectContaining({ content: 'Comment 1' }),
      ]),
    })
  })
})
