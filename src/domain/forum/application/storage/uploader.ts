export interface UploadPrarams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(params: UploadPrarams): Promise<{ url: string }>
}
