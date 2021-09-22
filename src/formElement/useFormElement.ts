import { useContext, useEffect, useState } from "react"
import { FormContext } from "src/Form.js"
import { createClasName } from "../utils/helpers.js"
import { FormElementPrimitiveValue, FormElementProps } from "./types.js"



export default function useFormElement<TValue=FormElementPrimitiveValue>({
  name,
  className,
  errorClassName,
  inheritClassNames = true,
  initialValue,
  emptyValue,
  meta,
  validator = () => undefined,
}:FormElementProps<TValue>) {
  const ctx = useContext( FormContext )

  const fixedValue = (initialValue ?? ctx.values?.[ name ] ?? null) as TValue | undefined
  const isValuePromise = fixedValue instanceof Promise
  const [ value, setValue ] = useState( isValuePromise ? null : fixedValue )
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

  const updateValues = (name:string, value:TValue | null) => {
    ctx.updateValues?.( name, value ?? (emptyValue === undefined ? null : emptyValue), meta )
  }

  useEffect( () => {
    if (!fixedValue) return

    if (!isValuePromise) {
      const error = validator( fixedValue )

      if (error) return updateValues( name, null )

      return updateValues( name, fixedValue )
    }

    fixedValue.then( value => {
      const error = validator( value )

      if (error) return updateValues( name, null )

      updateValues( name, value )
      setValue( value )
    } )
  }, [] )

  if (!name) console.error( `You have to pass "name" property to form element! Your field name will be "undefined"!` )

  return {
    name,
    className: fullClassName,
    value,
    initialPrimitiveValue: fixedValue,
    error,
    showPlaceholder: ctx.showPlaceholder,
    setError,
    validator,
    updateValues,
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

  const probablyEvent = obj as { currentTarget?:{ value?:unknown }}

  if (probablyEvent.currentTarget?.value) return probablyEvent.currentTarget.value

  return obj
}
