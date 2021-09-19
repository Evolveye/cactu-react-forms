import { useState, useContext, useMemo, useEffect, cloneElement, isValidElement, Children, createElement } from "react"
import { classNames, FormContext } from "./utils/utils.js"

export function ComplexFieldset({
  name,
  children,
  className,
  fieldsClassName,
  value = [],
  initialCount = value.length || 1,
  label = undefined,
}) {
  const ctx = useContext( FormContext )
  const [ fieldsValues, setFieldsValues ] = useState({})
  const [ fieldsCount, setFieldsCount ] = useState( initialCount )

  const fullClassName = classNames( ctx.fieldsClassName, className )
  const overridedFormContextValue = {
    ...ctx,
    fieldsClassName,
    updateValues: (name, value, meta) => {
      if (!meta || typeof meta.fieldsetKey !== `number`) return

      setFieldsValues( currentValues => ({
        ...currentValues,

        [ meta.fieldsetKey ]: {
          ...currentValues[ meta.fieldsetKey ],
          [ name ]: value,
        },
      }) )
    },
  }

  const fields = useMemo( () => Array.from( { length:fieldsCount }, (_, i) => {
    const fieldValues = value[ i ] ?? {}
    const childrenArr = Children.toArray( children )
    const copiedChildren = childrenArr.map( child => {
      if (isValidElement( child )) return cloneElement( child, { meta:{ fieldsetKey:i }, value:fieldValues[ child.props.name ] } )

      return child
    } )

    return childrenArr.length > 1 ? createElement( `fieldset`, { key:i }, copiedChildren ) : copiedChildren
  } ), [ fieldsCount ] )


  useEffect( () => {
    ctx.updateValues?.( name, Object.values( fieldsValues ) )
  }, [ JSON.stringify( fieldsValues ) ] )

  useEffect( () => {
    setFieldsValues( oldValues => {
      let i = fieldsCount

      while (oldValues[ i ]) delete oldValues[ i++ ]

      return { ...oldValues }
    } )
  }, [ fieldsCount ] )


  return (
    <fieldset className={fullClassName}>
      {label && <legend>{label}</legend>}
      <FormContext.Provider value={overridedFormContextValue}>
        {fields}
      </FormContext.Provider>

      <button onClick={e => { e.preventDefault(); setFieldsCount( count => count - 1 ) }} disabled={fieldsCount === 0}>Less</button>
      <button onClick={e => { e.preventDefault(); setFieldsCount( count => count + 1 ) }}>More</button>
    </fieldset>
  )
}
