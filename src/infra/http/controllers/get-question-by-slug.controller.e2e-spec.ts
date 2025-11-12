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
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments'

describe('Get Question By Slug (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = module.createNestApplication()
    jwt = module.get(JwtService)
    studentFactory = module.get(StudentFactory)
    questionFactory = module.get(QuestionFactory)
    attachmentFactory = module.get(AttachmentFactory)
    questionAttachmentFactory = module.get(QuestionAttachmentFactory)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
      title: 'Question 1',
      slug: Slug.create('question-1'),
    })

    await questionAttachmentFactory.makePrismaAttachment({
      questionId: question.id,
      attachmentId: attachment1.id,
    })

    await questionAttachmentFactory.makePrismaAttachment({
      questionId: question.id,
      attachmentId: attachment2.id,
    })

    const response = await request(app.getHttpServer())
      .get('/questions/question-1')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'Question 1',
        author: expect.objectContaining({
          id: student.id.toString(),
          name: student.name,
        }),
        attachments: expect.arrayContaining([
          expect.objectContaining({ id: attachment1.id.toString() }),
          expect.objectContaining({ id: attachment2.id.toString() }),
        ]),
      }),
    })
  })
})
