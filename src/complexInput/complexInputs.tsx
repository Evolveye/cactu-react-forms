import { Number } from "src/input/inputs.js"
import ComplexInput from "./ComplexInput.js"
import { ComplexInputProps, WrappedComplexInputProps } from "./types.js"



const prepareComplexInputProps = (props:WrappedComplexInputProps):ComplexInputProps =>
  ({ ...props, label:(props.label ?? props.children), children:undefined })



export function Phone( props:WrappedComplexInputProps ) {
  return (
    <ComplexInput {...prepareComplexInputProps( props )}>
      +
      <Number name="countryCode" min={0} max={999} />
      {` `}
      <Number name="first_threeDigits" min={0} max={999} />
      {` `}
      <Number name="second_threeDigits" min={0} max={999} />
      {` `}
      <Number name="third_threeDigits" min={0} max={999} />
    </ComplexInput>
  )
}

// Form.inputs.Text.canBeComplex = true
export function Time( props:WrappedComplexInputProps ) {
  return (
    <ComplexInput {...prepareComplexInputProps( props )}>
      <Number name="hours" style={{ padding:`0 5px`, width:33, textAlign:`right` }} min={0} max={23} />
      :
      <Number name="minutes" style={{ padding:`0 5px`, width:33, textAlign:`left` }} min={0} max={59} />
    </ComplexInput>
  )
}

export function TimeRange( props:WrappedComplexInputProps ) {
  return (
    <ComplexInput {...prepareComplexInputProps( props )}>
      <Time name="from" />
      {` -- `}
      <Time name="to" />
    </ComplexInput>
  )
}
