import { FormElementValue } from "src/formElement/types.js"
import { InputProps } from "src/input/types.js"

export type ComplexInputProps = InputProps & {
  stringify?: (value:FormElementValue) => string,
}
