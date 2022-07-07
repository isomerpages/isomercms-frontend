import { AxiosError } from "axios"

export const isAxiosError = (err: unknown): err is AxiosError => {
  return (err as AxiosError).isAxiosError
}
