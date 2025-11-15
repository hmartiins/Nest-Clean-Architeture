import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { AppModule } from '@/infra/app.module'

import request from 'supertest'
import { JwtService } from '@nestjs/jwt'

import { describe, expect, test, beforeAll } from 'vitest'
import { StudentFactory } from 'test/factories/make-student'
import { DatabaseModule } from '@/infra/database/database.module'
import { NotificationFactory } from 'test/factories/make-notification'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Read Notification (e2e)', () => {
  let prisma: PrismaService
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory],
    }).compile()

    app = module.createNestApplication()
    prisma = module.get(PrismaService)
    jwt = module.get(JwtService)
    studentFactory = module.get(StudentFactory)
    notificationFactory = module.get(NotificationFactory)

    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const student = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: student.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: student.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.status).toBe(204)

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: { recipientId: student.id.toString() },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
