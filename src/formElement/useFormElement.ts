import { useContext, useEffect, useState } from "react"
import { createClasName, FormContext } from "src/Form.js"
import { FormElementPrimitiveValue, FormElementProps } from "./types.js"



export default function useFormElement<TValue=FormElementPrimitiveValue>({
  name,
  className,
  errorClassName,
  inheritClassNames = true,
  initialValue,
  emptyValue,
  meta: externalMeta,
  optional,
  preventWrongValue = false,
  validator = () => undefined,
}:FormElementProps<TValue>) {
  const ctx = useContext( FormContext )

  const fixedValue = (initialValue ?? ctx.values?.[ name ] ?? emptyValue) as TValue
  const isValuePromise = fixedValue instanceof Promise
  const [ value, setValue ] = useState( isValuePromise ? emptyValue : fixedValue )
  const [ error, setError ] = useState<string | null>( null )
  const inheritedClassNames = inheritClassNames ? {
    className: ctx.fieldsClassName,
    errorClassName: ctx.fieldsErrorClassName,
  } : {}

  const fullClassName = createClasName(
    inheritedClassNames.className,
    error ? inheritedClassNames.errorClassName : undefined,
    className,
    error ? errorClassName : undefined,
  )

  const updateValue = (newValue:TValue | null, newFormValue:TValue | null = newValue) => {
    const meta = {
      name,
      value: newFormValue ?? emptyValue,
      optional: optional ?? ctx.defaultOptional ?? false,
      ...externalMeta,
    }

    ctx.updateValues?.( meta )
    if (newValue !== null) setValue( newValue )
  }

  useEffect( () => {
    if (fixedValue === emptyValue) return updateValue( null )

    if (!isValuePromise) {
      const error = validator( fixedValue )

      if (error) return updateValue( null )

      return updateValue( fixedValue )
    }

    updateValue( null )
    fixedValue.then( value => {
      const error = validator( value )

      if (error) return updateValue( null )

      updateValue( value )
      setValue( value )
    } )
  }, [] )

  if (!name) console.error( `You have to pass "name" property to form element! Your field name will be "undefined"!` )

  return {
    name,
    className: fullClassName,
    value,
    error,
    showPlaceholder: ctx.showPlaceholder ?? false,
    setError,
    validator,
    updateValue( newValue:TValue | null ) {
      if (newValue !== null) {
        const maybeError = validator( newValue )

        if (maybeError) {
          if (preventWrongValue) updateValue( null )
          else updateValue( newValue, null )

          return
        }
      }

      if (error) setError( null )

      updateValue( newValue )
    },
    findValueError,
    extractValueFromEventOrReturnObj,
  }
}



function findValueError( value, validator ) {
  try {
    validator?.( value )
  } catch (err) {
    return err
  }

  return null
}

function extractValueFromEventOrReturnObj( obj:unknown ) {
  if (typeof obj !== `object` || obj == null) return obj
  if (![ `SyntheticBaseEvent` ].includes( obj.constructor.name )) return obj

  const probablyEvent = obj as { target?:{ value?:unknown }, currentTarget?:{ value?:unknown }}

  if (probablyEvent.target && `value` in probablyEvent.target) return probablyEvent.target.value
  if (probablyEvent.currentTarget && `value` in probablyEvent.currentTarget) return probablyEvent.currentTarget.value

  return obj
}
