import { useState, useContext, useEffect, createContext, CSSProperties } from "react"
import { createClasName, FormContext } from "src/Form.js"
import useFormElement from "src/formElement/useFormElement.js"
import { SelectContext, SelectProps } from "./types.js"



const FormSelectContext = createContext<Partial<SelectContext>>( {} )

const fieldsetStyle:CSSProperties = {
  marginBottom: 10,
  padding: 5,
  width: `max-content`,
}

const legendStyle:CSSProperties = {
  fontWeight: `bold`,
}

const itemsStyle:CSSProperties = {
  display: `block`,
  marginLeft: 10,
}


export function Select({ children, fieldsClassName, multiple = false, label, ...formElementProps }:SelectProps) {
  const { name, className, getStyle, updateValue } = useFormElement( formElementProps )
  const [ checkedValues, setCheckedValues ] = useState<unknown[]>([])

  const overridedFormContextValue = {
    fieldsClassName,
    showPlaceholder: undefined,
    fieldsErrorClassName: undefined,
    values: undefined,
    updateValues: undefined,
    // updateValues: (name, value, checked) => {
    //   console.log({ name, value, checked })
    // },
  }

  const selectContextValue = {
    multiple,
    name,
    checkedValues,
    updateChecks( checked, value ) {
      setCheckedValues( checkedValues => {
        const newCheckedValues = multiple
          ? [ ...new Set( [ ...checkedValues, value ] ) ]
          : [ value ]

        if (!checked) {
          const index = newCheckedValues.indexOf( value )

          if (index >= 0) newCheckedValues.splice( index, 1 )
        }

        return newCheckedValues
      } )
    },
  }


  useEffect( () => {
    updateValue( checkedValues )
  }, [ JSON.stringify( checkedValues ) ] )

  return (
    <FormContext.Provider value={overridedFormContextValue}>
      <fieldset className={className} style={getStyle( fieldsetStyle )}>
        {label && <legend style={getStyle( legendStyle )}>{label}</legend>}

        <div style={getStyle( itemsStyle )}>
          <FormSelectContext.Provider value={selectContextValue}>
            {children}
          </FormSelectContext.Provider>
        </div>
      </fieldset>
    </FormContext.Provider>
  )
}

export function SelectItem({ children, value = children, checked = false, className = null }) {
  const formCtx = useContext( FormContext )
  const selectCtx = useContext( FormSelectContext )

  const fullClassName = createClasName( formCtx.fieldsClassName, className )
  const type = selectCtx.multiple ? `checkbox` : `radio`
  const isChecked = selectCtx.checkedValues?.includes( value )

  const handleChange = ({ target:{ checked } }) => selectCtx.updateChecks?.( checked, value )

  useEffect( () => {
    if (checked) selectCtx.updateChecks?.( true, value )
  }, [] )

  return (
    <label className={fullClassName} style={fullClassName ? undefined : { display:`block` }}>
      <input type={type} name={selectCtx.name} onChange={handleChange} checked={isChecked} /> {children}
    </label>
  )
}
