import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'

import { describe, expect, it, beforeAll } from 'vitest'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

describe('Prisma Questions Repository (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let questionsRepository: QuestionsRepository
  let cacheRepository: CacheRepository

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = module.createNestApplication()
    studentFactory = module.get(StudentFactory)
    questionFactory = module.get(QuestionFactory)
    attachmentFactory = module.get(AttachmentFactory)
    questionAttachmentFactory = module.get(QuestionAttachmentFactory)
    questionsRepository = module.get(QuestionsRepository)
    cacheRepository = module.get(CacheRepository)

    await app.init()
  })

  it('should cache question details', async () => {
    const student = await studentFactory.makePrismaStudent()

    const attachment = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    await questionAttachmentFactory.makePrismaAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const slug = question.slug.value

    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    if (!cached) {
      throw new Error('Cached question details not found')
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    )
  })

  it('should return cached question details on subsequent calls', async () => {
    const student = await studentFactory.makePrismaStudent()

    const attachment = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    await questionAttachmentFactory.makePrismaAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const slug = question.slug.value

    let cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()

    await questionsRepository.findDetailsBySlug(slug)
    cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).not.toBeNull()

    const questionDetails = await questionsRepository.findDetailsBySlug(slug)

    if (!cached) {
      throw new Error('Cached question details not found')
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    )
  })

  it('should reset question details cache when saving a question', async () => {
    const student = await studentFactory.makePrismaStudent()

    const attachment = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    await questionAttachmentFactory.makePrismaAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    })

    const slug = question.slug.value

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    )

    await questionsRepository.save(question)

    const cached = await cacheRepository.get(`question:${slug}:details`)

    expect(cached).toBeNull()
  })
})
