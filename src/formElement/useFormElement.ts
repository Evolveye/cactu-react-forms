import { BaseSyntheticEvent, useContext, useEffect, useState } from "react"
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

  const updateValue = (newValue?:TValue | null, newFormValue?:TValue | null) => {
    if (newFormValue === undefined) newFormValue = newValue

    const meta = {
      name,
      value: newFormValue ? parse( newFormValue ) : emptyValue,
      optional: optional ?? ctx.defaultOptional ?? false,
      ...externalMeta,
    }

    ctx.updateValues?.( meta )

    if (newValue !== undefined && (newValue !== null || emptyValue !== undefined)) {
      setValue( newValue ?? inputify( emptyValue ) )
    }
  }

  useEffect( () => {
    if (fixedValue === emptyValue) return updateValue( undefined, null )

    const update = (v, doInputValue = false) => {
      const inputifiedValue = inputify( v )
      const validationValue = validator( inputifiedValue, parse )

      if (typeof validationValue === `string`) return updateValue( undefined, null )

      updateValue( inputifiedValue )
      if (doInputValue) setValue( inputifiedValue )
    }

    if (!isValuePromise) return update( fixedValue )

    let mounted = true

    updateValue( undefined, null )
    fixedValue.then( value => {
      if (mounted) update( value, true )
    } )

    return () => { mounted = false }
  }, [] )

  if (!name) console.error( `You have to pass "name" property to form element! Your field name will be "undefined"!` )

  if (!!inputify && !parse) console.error( `You have defined "inputify" prop but no "parse" prop. You need to define both ot them!` )
  else if (!!parse && !inputify) console.error( `You have defined "parse" prop but no "inputify" prop. You need to define both ot them!` )

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
      const validationValue = validator( newValueString, parse )

      if (typeof validationValue === `string`) {
        if (preventWrongValue) updateValue( undefined, null )
        else updateValue( newValueString, null )

        return
      }
      // }

      if (error) setError( null )

      const validationResult = {
        value: validationValue?.value === undefined ? newValueString : validationValue.value,
      }

      updateValue( validationResult.value )
    },
    checkObjIsEvent,
    extractValueFromEventOrReturnObj,
  }
}



function extractValueFromEventOrReturnObj( obj:unknown ) {
  const isObjEvent = checkObjIsEvent( obj )

  if (!isObjEvent) return obj

  if (obj.target && `value` in obj.target) return obj.target.value
  if (obj.currentTarget && `value` in obj.currentTarget) return obj.target.value

  return obj
}

function checkObjIsEvent( obj:unknown ): obj is BaseSyntheticEvent<InputEvent> {
  if (typeof obj !== `object` || obj == null) return false
  if (![ `SyntheticBaseEvent` ].includes( obj.constructor.name )) return false

  const probablyEvent = obj as { target?:{ value?:unknown }, currentTarget?:{ value?:unknown }}

  if (probablyEvent.target && `value` in probablyEvent.target) return true
  if (probablyEvent.currentTarget && `value` in probablyEvent.currentTarget) return true

  return false
}
