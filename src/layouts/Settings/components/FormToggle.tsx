import { Switch, SwitchProps } from "@chakra-ui/react"
import { Controller, useFormContext } from "react-hook-form"

export interface FormToggleProps extends Omit<SwitchProps, "value"> {
  name: string
}
export const FormToggle = ({ name, ...rest }: FormToggleProps): JSX.Element => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return <Switch {...field} {...rest} isChecked={!!field.value} />
      }}
    />
  )
}
