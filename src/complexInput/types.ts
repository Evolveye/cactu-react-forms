import { FormElementValue } from "src/formElement/types"
import { InputProps } from "src/input/types"

export type ComplexInputProps = InputProps & {
  stringify?: (value:FormElementValue) => string,
}
