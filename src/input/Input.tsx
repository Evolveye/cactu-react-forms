import { InputAutocomplete, InputProps, NativeInputProps } from "./types.js"
import useFormElement from "src/formElement/useFormElement.js"



export function Input<TRef=HTMLInputElement, TValue=string, TParsedValue=TValue>({
  children,
  render,
  style,
  label = children,
  placeholder,
  ref,
  autoComplete = InputAutocomplete.OFF,
  ...inputBaseProps
}:InputProps<TRef, TValue, TParsedValue>) {
  const {
    name,
    className,
    error,
    value,
    setError,
    validate,
    updateValue,
    extractValueFromEventOrReturnObj,
  } = useFormElement( inputBaseProps )

  const properties:NativeInputProps<TRef, TValue> = {
    name,
    placeholder,
    autoComplete,
    style,
    className: label ? undefined : className,
    ref,
    value,
    onInput: eOrValue => {
      const value = extractValueFromEventOrReturnObj( eOrValue ) as TValue

      updateValue( value )
    },
    onBlur: eOrValue => {
      const value = extractValueFromEventOrReturnObj( eOrValue ) as TValue
      const meybeError = validate( value )

      if (meybeError) setError( meybeError )
    },
  }

  if (!render) {
    console.error( `You have to pass function children or "render" property to input` )
    return null
  }

  const content = (
    <>
      {label} {render({ ...properties })}
      {error && <><br /><p>{error}</p></>}
    </>
  )

  return label
    ? <label className={label ? className : undefined}>{content}</label>
    : content
}
