export interface MiddlewareError {
  code: number
  message: string
  name?: string
}

export interface ErrorDto {
  message: string
}

export interface MiddlewareErrorDto {
  error: {
    code: number
    message: string
    name?: string
  }
}
