import { InputAutocomplete, InputProps, NativeInputProps } from "./types.js"
import useFormElement from "src/formElement/useFormElement.js"
import { FormElementPrimitiveValue } from "src/formElement/types.js"



export function Input<TValue=FormElementPrimitiveValue, TRef=HTMLInputElement>({
  children,
  render,
  style,
  label = children,
  placeholder,
  ref,
  autoComplete = InputAutocomplete.OFF,
  ...inputBaseProps
}:InputProps<TValue, TRef>) {
  const {
    name,
    className,
    error,
    value,
    setError,
    validator,
    updateValue,
    extractValueFromEventOrReturnObj,
  } = useFormElement( inputBaseProps )

  const properties:NativeInputProps<TValue, TRef> = {
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
      const meybeError = validator( value )

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
