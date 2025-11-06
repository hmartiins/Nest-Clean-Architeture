import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'

import request from 'supertest'
import { JwtService } from '@nestjs/jwt'

import { describe, expect, test, beforeAll } from 'vitest'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from 'test/factories/make-question'

describe('Upload Attachment (e2e)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = module.createNestApplication()
    jwt = module.get(JwtService)
    studentFactory = module.get(StudentFactory)

    await app.init()
  })

  test('[POST] /attachments', async () => {
    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.jpeg')

    expect(response.status).toBe(201)
  })
})
