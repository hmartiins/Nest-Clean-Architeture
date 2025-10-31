import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterStudentUseCase } from './register-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let fakeHasher: FakeHasher
let inMemoryStudentsRepository: InMemoryStudentsRepository

let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const student = inMemoryStudentsRepository.items[0]

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(student.password).toBe(hashedPassword)
  })
})
