import { ChangeHandler, RegisterOptions } from "react-hook-form"

// NOTE: Taken from the react-hook-forms docs located here: https://react-hook-form.com/api/useform/register
export type RegisterFunc = (
  name: string,
  rest?: RegisterOptions
) => {
  onChange: ChangeHandler
  onBlur: ChangeHandler
  ref: React.Ref<any>
  name: string
}
