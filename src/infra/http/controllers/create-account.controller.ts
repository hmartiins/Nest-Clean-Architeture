import { Body, Controller, Post, UsePipes } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBody = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@UsePipes(new ZodValidationPipe(createAccountBodySchema))
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  async handle(@Body() body: CreateAccountBody) {
    const { email, name, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) throw new Error()
  }
}
