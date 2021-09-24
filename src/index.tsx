import Form, { Submit } from "./Form.js"

import * as inputs from "./input/inputs.js"
import * as complexInputs from "./complexInput/complexInputs.js"
import * as complexFieldset from "./complexFieldset/ComplexFieldset.js"
import * as selectElements from "./select/Select.js"

export * from "./input/inputs.js"
export * from "./complexInput/complexInputs.js"
export * from "./complexFieldset/ComplexFieldset.js"
export * from "./select/Select.js"

export default Form
export { Submit, Form }
export const elements = {
  Submit,
  ...inputs,
  ...complexInputs,
  ...complexFieldset,
  ...selectElements,
}
