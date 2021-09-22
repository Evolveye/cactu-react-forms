import { InputAutocomplete, InputProps, NativeInputProps } from "./types.js"
import useFormElement from "src/formElement/useFormElement.js"
import { FormElementPrimitiveValue } from "src/formElement/types.js"



export function Input<TValue=FormElementPrimitiveValue>({
  children: render,
  // render = children,
  style,
  label,
  placeholder,
  autoComplete = InputAutocomplete.OFF,
  ...inputBaseProps
}:InputProps<TValue>) {
  const {
    name,
    initialPrimitiveValue,
    className,
    error,
    setError,
    validator,
    updateValues,
    extractValueFromEventOrReturnObj,
  } = useFormElement( inputBaseProps )

  const properties:NativeInputProps<TValue> = {
    name,
    placeholder,
    autoComplete,
    style,
    className: label ? undefined : className,
    onInput: eOrValue => {
      const value = extractValueFromEventOrReturnObj( eOrValue ) as TValue
      const meybeError = validator( value )

      if (meybeError) return updateValues( name, null )
      if (error) setError( null )

      updateValues( name, value )
    },
    onBlur: eOrValue => {
      const value = extractValueFromEventOrReturnObj( eOrValue ) as TValue
      const meybeError = validator( value )

      if (meybeError) setError( meybeError )
    },
  }

  if (initialPrimitiveValue !== undefined) properties.defaultValue = initialPrimitiveValue

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
