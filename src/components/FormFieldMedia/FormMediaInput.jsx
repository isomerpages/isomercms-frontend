import { Flex } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import PropTypes from "prop-types"

import { useFormContext } from "../Form/FormContext"
import FormInput from "../Form/FormInput"

const FormMediaInput = ({
  placeholder = "",
  value,
  register = () => {},
  id,
  onClick = () => {},
  inlineButtonText = "Choose Item",
}) => {
  const { isRequired, isDisabled } = useFormContext()

  return (
    <Flex>
      <FormInput
        placeholder={placeholder}
        value={value}
        id={id}
        alwaysDisabled
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register(id, { required: isRequired })}
      />
      {inlineButtonText && (
        <Button colorScheme="primary" onClick={onClick} isDisabled={isDisabled}>
          {inlineButtonText}
        </Button>
      )}
    </Flex>
  )
}

FormMediaInput.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  register: PropTypes.func,
  onClick: PropTypes.func,
  inlineButtonText: PropTypes.string,
}

export default FormMediaInput
