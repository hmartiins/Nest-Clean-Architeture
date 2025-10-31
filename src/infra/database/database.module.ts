import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-coments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'

@Module({
  providers: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
  ],
})
export class DatabaseModule {}
