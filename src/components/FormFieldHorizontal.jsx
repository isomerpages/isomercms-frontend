import { forwardRef } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import FormInput from "./Form/FormInput"

// This component is a thin wrapper over the basic FormInput.
// It serves to apply additional UI styling over the base FormInput.
// Because of this, any additional props are forwarded to the base FormInput for consumption
const FormFieldHorizontal = forwardRef((args, ref) => (
  <div className={elementStyles.formHorizontal}>
    <FormInput
      className={elementStyles.formHorizontalInput}
      {...args}
      ref={ref}
    />
  </div>
))

export default FormFieldHorizontal
