// NOTE: If it returns true, it is a valid value.
// Otherwise, it is invalid and we should reject.
// This is inline w/ validation libraries.
export type Validator = (value: string) => boolean
export type WithValidator<T> = T & { validate?: Record<string, Validator> }
