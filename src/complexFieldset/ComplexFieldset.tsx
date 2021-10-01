import { useState, useMemo, useEffect, cloneElement, isValidElement, Children, createElement } from "react"
import { FormContext, FormContextValue } from "src/Form.js"
import useFormElement from "src/formElement/useFormElement"
import { ComplexFieldsetProps } from "./types"

export function ComplexFieldset({
  children,
  initialValue = [],
  fieldsClassName,
  fieldsErrorClassName,
  initialCount = (Array.isArray( initialValue ) && initialValue.length) ? initialValue.length : 1,
  label = undefined,
  ref,
  ...formElementProps
}:ComplexFieldsetProps) {
  const { className, value, updateValue } = useFormElement({ ...formElementProps, initialValue })
  const [ fieldsValues, setFieldsValues ] = useState({})
  const [ fieldsCount, setFieldsCount ] = useState( initialCount )

  const overridedFormContextValue:Partial<FormContextValue> = {
    fieldsClassName,
    fieldsErrorClassName,
    updateValues: ({ name, value, fieldsetKey }) => {
      if (typeof fieldsetKey !== `number`) return

      setFieldsValues( currentValues => ({
        ...currentValues,

        [ fieldsetKey ]: {
          ...currentValues[ fieldsetKey ],
          [ name ]: value,
        },
      }) )
    },
  }

  const fields = useMemo( () => Array.from( { length:fieldsCount }, (_, i) => {
    const fieldValues = value?.[ i ] ?? {}
    const childrenArr = Children.toArray( children )
    const copiedChildren = childrenArr.map( child => {
      if (isValidElement( child )) return cloneElement( child, { meta:{ fieldsetKey:i }, value:fieldValues[ child.props.name ] } )

      return child
    } )

    return childrenArr.length > 1 ? createElement( `fieldset`, { key:i }, copiedChildren ) : copiedChildren
  } ), [ fieldsCount ] )


  useEffect( () => {
    updateValue( Object.values( fieldsValues ) )
  }, [ JSON.stringify( fieldsValues ) ] )

  useEffect( () => {
    setFieldsValues( oldValues => {
      let i = fieldsCount

      while (oldValues[ i ]) delete oldValues[ i++ ]

      return { ...oldValues }
    } )
  }, [ fieldsCount ] )


  return (
    <fieldset className={className} ref={ref}>
      {label && <legend>{label}</legend>}
      <FormContext.Provider value={overridedFormContextValue}>
        {fields}
      </FormContext.Provider>

      <button onClick={e => { e.preventDefault(); setFieldsCount( count => count - 1 ) }} disabled={fieldsCount === 0}>Less</button>
      <button onClick={e => { e.preventDefault(); setFieldsCount( count => count + 1 ) }}>More</button>
    </fieldset>
  )
}
