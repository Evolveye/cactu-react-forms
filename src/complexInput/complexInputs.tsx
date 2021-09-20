import Form from "src"
import { Number } from "src/input/inputs"
import { ComplexInput } from "./ComplexInput"

const prepareComplexInputProps = props => ({ ...props, label:(props.label ?? props.children), children:null })

Form.inputs.Phone = Phone
export function Phone( props ) {
  return (
    <ComplexInput {...prepareComplexInputProps( props )}>
      +
      <Number name="countryCode" min={0} max={999} emptyValue="0" />
      {` `}
      <Number name="first_threeDigits" min={0} max={999} emptyValue="xxx" />
      {` `}
      <Number name="second_threeDigits" min={0} max={999} emptyValue="xxx" />
      {` `}
      <Number name="third_threeDigits" min={0} max={999} emptyValue="xxx" />
    </ComplexInput>
  )
}

Form.inputs.Time = Time
// Form.inputs.Text.canBeComplex = true
export function Time( props ) {
  return (
    <ComplexInput {...prepareComplexInputProps( props )}>
      <Number name="hours" min={0} max={23} emptyValue="--" />
      :
      <Number name="minutes" min={0} max={59} emptyValue="--"  />
    </ComplexInput>
  )
}

Form.inputs.TimeRange = TimeRange
export function TimeRange( props ) {
  return (
    <ComplexInput {...prepareComplexInputProps({ ...props, style:{ display:`flex` } })}>
      <Time name="from" />
      {` -- `}
      <Time name="to" />
    </ComplexInput>
  )
}
