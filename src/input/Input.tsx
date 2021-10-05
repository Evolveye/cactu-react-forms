import { InputAutocomplete, InputProps, NativeInputProps } from "./types.js"
import useFormElement from "src/formElement/useFormElement.js"
import { CSSProperties } from "react"



const inputStyle:CSSProperties = {
  display: `block`,
  marginLeft: 10,
  marginBottom: 10,
}

const labelStyle:CSSProperties = {
  fontWeight: `bold`,
}

const errorStyle:CSSProperties = {
  color: `red`,
  fontSize: `0.8em`,
}


export function Input<TRef=HTMLInputElement, TValue=string, TParsedValue=TValue>({
  children,
  render,
  label = children,
  placeholder,
  innerRef,
  autoComplete = InputAutocomplete.OFF,
  ...inputBaseProps
}:InputProps<TRef, TValue, TParsedValue>) {
  const {
    name,
    className,
    error,
    value,
    getStyle,
    setError,
    validate,
    updateValue,
    checkObjIsEvent,
    extractValueFromEventOrReturnObj,
  } = useFormElement( inputBaseProps )

  const properties:NativeInputProps<TRef, TValue> = {
    name,
    placeholder,
    autoComplete,
    style: getStyle( inputStyle, !label ),
    className: label ? undefined : className,
    ref: innerRef,
    value,
    onInput: eOrValue => {
      if (checkObjIsEvent( eOrValue )) {
        const { data } = eOrValue.nativeEvent

        if (typeof value === `string` && typeof data === `string` && `+-.e`.includes( data )) {
          return updateValue( (value + data) as unknown as TValue )
        } else {
          const newValue = extractValueFromEventOrReturnObj( eOrValue ) as TValue

          return updateValue( newValue )
        }
      }

      updateValue( eOrValue as TValue )
    },
    onBlur: eOrValue => {
      const value = extractValueFromEventOrReturnObj( eOrValue ) as TValue
      const meybeError = validate( value )

      if (typeof meybeError === `string`) setError( meybeError )
    },
  }

  if (!render) {
    console.error( `You have to pass function children or "render" property to input` )
    return null
  }

  const content = (
    <>
      {label}
      {` `}
      {error && <span style={getStyle( errorStyle )}>{error}</span>}
      {render({ ...properties })}
    </>
  )

  return label
    ? <label className={label ? className : undefined} style={getStyle( labelStyle, !!label )}>{content}</label>
    : content
}
