import Form from "src"
import { Validator } from "src/formElement/types.js"
import { Input } from "./Input.js"
import { WrappedInputProps } from "./types.js"

const buildValidator = (originalValidator:Validator | undefined, errorMessage:string, overridedValdiator:(value)=>boolean) => (text:string) => {
  if (!overridedValdiator( text )) return errorMessage

  return originalValidator?.( text )
}

function File({ accept, ...inputProps }:WrappedInputProps<string | File> & { accept:string }) {
  return (
    <Input<string | File> {...inputProps} label={inputProps.label ?? inputProps.children}>
      {p => <input {...p} defaultValue={typeof p.defaultValue === `string` ? p.defaultValue : undefined} type="file" accept={accept} onInput={({ currentTarget:t }) => p.onInput( t.files?.[ 0 ] ?? null )} />}
    </Input>
  )
}



Form.inputs.Text = Text
// Form.inputs.Text.canBeComplex = true
export function Text( props:WrappedInputProps ) {
  return <Input {...props} children= {p => <input {...p} type="text" />} />
}

Form.inputs.Password = Password
// Form.inputs.Password.canBeComplex = true
export function Password( props:WrappedInputProps ) {
  return <Input {...props} children={p => <input {...p} type="password" />} />
}

Form.inputs.Number = Number
// Form.inputs.Number.canBeComplex = true
export function Number({ min, max, errorMessage = `It's not a number!`, ...restProps }:WrappedInputProps & { min:number, max:number, errorMessage?:string }) {
  const validator = buildValidator( restProps.validator, errorMessage, text => /-?\d+(?:\.\d+)?/.test( text ) )

  return (
    <Input {...restProps} validator={validator}>
      {p => <input {...p} type="number" min={min} max={max} />}
    </Input>
  )
}

Form.inputs.Email = Email
// Form.inputs.Text.canBeComplex = true
export function Email({ errorMessage = `It's not an email!`, ...restProps }:WrappedInputProps & { errorMessage?:string }) {
  const validator = buildValidator( restProps.validator, errorMessage, text => /\w+@\w+\.\w+/.test( text ) )

  return (
    <Input {...restProps} validator={validator}>
      {p => <input {...p} type="email" />}
    </Input>
  )
}

Form.inputs.Link = Link
// Form.inputs.Text.canBeComplex = true
export function Link({ errorMessage = `It's not an url!`, ...restProps }:WrappedInputProps & { errorMessage?:string }) {
  const validator = buildValidator( restProps.validator, errorMessage, text => /^https?:\/\/\S+/.test( text ) )

  return <Text {...restProps} validator={validator} />
}

Form.inputs.Textarea = Textarea
export function Textarea( props ) {
  return (
    <Input {...props}>
      {
        p => (
          <>
            {props.children || props.label ? <br /> : null}
            <textarea {...p} />
          </>
        )
      }
    </Input>
  )
}

Form.inputs.Image = Image
export function Image( props ) {
  return <File {...props} accept="image/png, image/jpeg, image/jpg" />
}

// Form.inputs.Phone = Phone
// export function Phone( props ) {
//   return (
//     <ComplexInput {...prepareComplexInputProps( props )}>
//       +
//       <Number name="countryCode" min={0} max={999} emptyValue="0" />
//       {` `}
//       <Number name="first_threeDigits" min={0} max={999} emptyValue="xxx" />
//       {` `}
//       <Number name="second_threeDigits" min={0} max={999} emptyValue="xxx" />
//       {` `}
//       <Number name="third_threeDigits" min={0} max={999} emptyValue="xxx" />
//     </ComplexInput>
//   )
// }

// Form.inputs.Time = Time
// // Form.inputs.Text.canBeComplex = true
// export function Time( props ) {
//   return (
//     <ComplexInput {...prepareComplexInputProps( props )}>
//       <Number name="hours" min={0} max={23} emptyValue="--" />
//       :
//       <Number name="minutes" min={0} max={59} emptyValue="--"  />
//     </ComplexInput>
//   )
// }

// Form.inputs.TimeRange = TimeRange
// export function TimeRange( props ) {
//   return (
//     <ComplexInput {...prepareComplexInputProps({ ...props, style:{ display:`flex` } })}>
//       <Time name="from" />
//       {` -- `}
//       <Time name="to" />
//     </ComplexInput>
//   )
// }
