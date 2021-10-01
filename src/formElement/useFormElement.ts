import { useContext, useEffect, useState } from "react"
import { createClasName, FormContext } from "src/Form.js"
import { FormElementProps, FormElementValue } from "./types.js"



export default function useFormElement<TValue=string, TParsedValue=TValue>({
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
  inputify = x => x as unknown as TValue,
  parse = x => x as unknown as TParsedValue,
}:FormElementProps<TValue, TParsedValue>) {
  const ctx = useContext( FormContext )

  const fixedValue = (initialValue ?? ctx.values?.[ name ] ?? emptyValue) as FormElementValue<TParsedValue>
  const isValuePromise = fixedValue instanceof Promise
  const [ value, setValue ] = useState( inputify( isValuePromise ? emptyValue : fixedValue ) )
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

  const updateValue = (newValue:TParsedValue | null, newFormValue:TParsedValue | null = newValue) => {
    const meta = {
      name,
      value: newFormValue ?? emptyValue,
      optional: optional ?? ctx.defaultOptional ?? false,
      ...externalMeta,
    }

    ctx.updateValues?.( meta )

    if (newValue !== null) {
      setValue( inputify( newValue ) )
    }
  }

  useEffect( () => {
    if (fixedValue === emptyValue) return updateValue( null )

    if (!isValuePromise) {
      const error = validator( inputify( fixedValue ), parse )

      if (error) return updateValue( null )

      return updateValue( fixedValue )
    }

    updateValue( null )
    fixedValue.then( value => {
      const error = validator( inputify( value ), parse )

      if (error) return updateValue( null )

      updateValue( value )
      setValue( inputify( value ) )
    } )
  }, [] )

  if (!name) console.error( `You have to pass "name" property to form element! Your field name will be "undefined"!` )

  if (!!inputify && !parse) console.error( `Yu have defined "inputify" prop but no "parse" prop. You need to define both ot them!` )
  else if (!!parse && !inputify) console.error( `Yu have defined "parse" prop but no "inputify" prop. You need to define both ot them!` )

  return {
    name,
    className: fullClassName,
    value,
    error,
    showPlaceholder: ctx.showPlaceholder ?? false,
    setError,
    validate: (value: TValue) => validator( value, parse ),
    parse,
    inputify,
    updateValue( newValueString:TValue ) {
      // if (newValueString !== null) {
      const maybeError = validator( newValueString, parse )

      if (maybeError) {
        if (preventWrongValue) updateValue( null )
        else updateValue( parse( newValueString ), null )

        return
      }
      // }

      if (error) setError( null )

      updateValue( parse( newValueString ) )
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
