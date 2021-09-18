import React, { useContext, useEffect, useState } from "react"
import { classNames, FormContext, InputProps, InputValue, isError, NativeInputProps } from "./utils"



export function Input({
  name,
  render,
  children,
  style,
  className,
  errorClassName,
  inheritClassNames,
  label = children,
  placeholder = ``,
  initialValue,
  emptyValue,
  validator,
}:InputProps & { render: (props:NativeInputProps) => JSX.Element }) {
  const ctx = useContext( FormContext )

  const fixedValue = initialValue ?? ctx.values?.[ name ]
  const isValuePromise = fixedValue instanceof Promise
  const [ value, setValue ] = useState( isValuePromise ? null : fixedValue )
  const [ error, setError ] = useState<null | string>( null )

  const inheritedClassNames = inheritClassNames ? {
    className: ctx.fieldsClassName || ``,
    errorClassName: ctx.fieldsErrorClassName || ``,
  } : {}

  const updateValues = (name:string, value:InputValue) => {
    ctx.updateValues?.( name, value ?? (emptyValue === undefined ? null : emptyValue) )
  }

  const fullClassName = classNames(
    inheritedClassNames.className,
    isError( error ) ? inheritedClassNames.errorClassName : undefined,
    className,
    isError( error ) ? errorClassName : undefined,
  )

  const properties:NativeInputProps = {
    name,
    placeholder,
    autoComplete: name,
    defaultValue: value,
    style,
    className: label ? undefined : fullClassName,
    onInput: ({ currentTarget:{ value } }) => {
      if (validator) {
        const error = validator( value )

        if (isError( error )) return updateValues( name, `` )
      }

      setError( null )
      updateValues( name, value )
    },
    onBlur: ({ currentTarget:{ value } }) => {
      if (!validator) return

      const error = validator( value )

      if (isError( error )) setError( typeof error === `boolean` ? `` : error )
    },
  }

  useEffect( () => {
    if (!isValuePromise) {
      if (validator && isError( validator( fixedValue ) )) updateValues( name, null )
      else updateValues( name, fixedValue )
    } else fixedValue.then( val => {
      if (validator && isError( validator( val ) )) updateValues( name, null )
      else {
        updateValues( name, val )
        setValue( val )
      }
    } )
  }, [] )

  const content = (
    <>
      {label} {render({ ...properties })}
      {error && <><br /><p>{error}</p></>}
    </>
  )

  return label
    ? <label className={label ? fullClassName : undefined}>{content}</label>
    : content
}
