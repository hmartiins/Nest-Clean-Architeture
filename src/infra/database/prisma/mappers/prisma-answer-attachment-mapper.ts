import { Attachment as PrismaAttachment } from '@prisma/client'

import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.')
    }

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityID(raw.answerId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
