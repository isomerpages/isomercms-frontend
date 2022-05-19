import { Flex, HStack } from "@chakra-ui/react"
import { Input, Button } from "@opengovsg/design-system-react"
import PropTypes from "prop-types"

const InputWithButton = ({
  type,
  placeholder,
  value,
  onChange,
  buttonText,
  loadingText,
  isLoading,
  isDisabled,
}) => (
  <Flex dir="row">
    <HStack width="100%" paddingEnd="4px" paddingStart="1px">
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <Button type="submit" colorScheme="primary" isDisabled={isDisabled}>
        {isLoading ? loadingText : buttonText}
      </Button>
    </HStack>
  </Flex>
)

InputWithButton.defaultProps = {
  type: "text",
  placeholder: "",
  buttonText: "Submit",
  loadingText: "Loading",
  isLoading: false,
  isDisabled: false,
}

InputWithButton.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  loadingText: PropTypes.string,
  buttonText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
}

export default InputWithButton
