import { ComplexInput } from "./ComplexInput.js"
import Form from "./Form.js"
import { Input } from "./Input.js"
import { InputProps } from "./utils.js"

const prepareComplexInputProps = props => ({ ...props, label:(props.label ?? props.children), children:null })
const buildValidator = (originalValidator, errorMessage, overridedValdiator) => text => {
  const isOk = overridedValdiator( text )

  if (!isOk) return errorMessage ?? (typeof isOk === `string` ? isOk : false)

  return typeof originalValidator === `function` ? originalValidator( text ) : true
}



function File({ accept, ...inputProps }:InputProps<string[]> & { accept:string }) {
  return (
    <Input
      {...inputProps}
      render={
        ({ defaultValue:unknownDefVal, ...p }) => {
          let defaultValue

          if ([ `string`, `number` ].includes( typeof unknownDefVal )) defaultValue = unknownDefVal
          if (Array.isArray( unknownDefVal ) && unknownDefVal.every( x => typeof x === `string` )) {
            defaultValue = unknownDefVal
          }

          return <input {...p} type="file" accept={accept} defaultValue={defaultValue} onInput={({ currentTarget:t }) => p.onInput( t.files?.[ 0 ] )} />
        }
      }
    />
  )
}



Form.inputs.Text = Text
// Form.inputs.Text.canBeComplex = true
export function Text( props:InputProps ) {
  return (
    <Input
      {...props}
      render={
        ({ defaultValue:unknownDefVal, ...p }) => {
          let defaultValue

          if ([ `string` ].includes( typeof unknownDefVal )) defaultValue = unknownDefVal

          return <input {...p} type="text" defaultValue={defaultValue} />
        }
      }
    />
  )
}

Form.inputs.Password = Password
// Form.inputs.Password.canBeComplex = true
export function Password( props:InputProps ) {
  return (
    <Input
      {...props}
      render={
        ({ defaultValue:unknownDefVal, ...p }) => {
          let defaultValue

          if ([ `string` ].includes( typeof unknownDefVal )) defaultValue = unknownDefVal

          return <input {...p} type="password" defaultValue={defaultValue} />
        }
      }
    />
  )
}

Form.inputs.Number = Number
// Form.inputs.Number.canBeComplex = true
export function Number({ min, max, errorMessage = `It's not a number!`, ...restProps }:InputProps & { min:number, max:number, errorMessage?:string }) {
  const validator = buildValidator( restProps.validator, errorMessage, text => /-?\d+(?:\.\d+)?/.test( text ) )

  return (
    <Input
      {...restProps}
      validator={validator}
      render={
        ({ defaultValue:unknownDefVal, ...p }) => {
          let defaultValue

          if ([ `number` ].includes( typeof unknownDefVal )) defaultValue = unknownDefVal

          return <input {...p} type="number" defaultValue={defaultValue} min={min} max={max} />
        }
      }
    />
  )
}

Form.inputs.Email = Email
// Form.inputs.Text.canBeComplex = true
export function Email({ errorMessage, ...restProps }:InputProps & { errorMessage?:string }) {
  const validator = buildValidator( restProps.validator, errorMessage, text => /\w+@\w+\.\w+/.test( text ) )

  return (
    <Input
      {...restProps}
      validator={validator}
      render={
        ({ defaultValue:unknownDefVal, ...p }) => {
          let defaultValue

          if ([ `string` ].includes( typeof unknownDefVal )) defaultValue = unknownDefVal

          return <input {...p} type="email" defaultValue={defaultValue} />
        }
      }
    />
  )
}

Form.inputs.Link = Link
// Form.inputs.Text.canBeComplex = true
export function Link({ errorMessage, ...restProps }:InputProps & { errorMessage?:string }) {
  const validator = buildValidator( restProps.validator, errorMessage, text => /^https?:\/\/\S+/.test( text ) )

  return <Text {...restProps} validator={validator} />
}

Form.inputs.Textarea = Textarea
export function Textarea( props ) {
  return (
    <Input
      {...props}
      render={
        ({ defaultValue:unknownDefVal, ...p }) => {
          let defaultValue

          if ([ `string` ].includes( typeof unknownDefVal )) defaultValue = unknownDefVal

          return (
            <>
              {props.children || props.label ? <br /> : null}
              <textarea {...p} defaultValue={defaultValue} />
            </>
          )
        }
      }
    />
  )
}

Form.inputs.Image = Image
export function Image( props ) {
  return <File {...props} accept="image/png, image/jpeg, image/jpg" />
}

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
