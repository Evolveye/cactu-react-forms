import { useState, useContext, useEffect, createContext } from "react"
import { FormContext } from "src/Form.js"
import useFormElement from "src/formElement/useFormElement.js"
import { createClasName } from "src/utils/helpers.js"
import { SelectContext, SelectProps } from "./types.js"



const FormSelectContext = createContext<Partial<SelectContext>>( {} )



Select.Select = Select
export function Select({ children, fieldsClassName, multiple = false, label, ...formElementProps }:SelectProps) {
  const { name, classname, updateValues } = useFormElement( formElementProps )
  const [ checkedValues, setCheckedValues ] = useState<unknown[]>([])

  const overridedFormContextValue = {
    fieldsClassName,
    showPlaceholder: undefined,
    fieldsErrorClassName: undefined,
    values: undefined,
    updateValues: (name, value, checked) => {
      console.log({ name, value, checked })
    },
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
    updateValues( name, checkedValues )
  }, [ JSON.stringify( checkedValues ) ] )

  return (
    <FormContext.Provider value={overridedFormContextValue}>
      <fieldset className={classname}>
        {label && <legend>{label}</legend>}

        <FormSelectContext.Provider value={selectContextValue}>
          {children}
        </FormSelectContext.Provider>
      </fieldset>
    </FormContext.Provider>
  )
}

Select.Item = SelectItem
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
      {children} <input type={type} name={selectCtx.name} onChange={handleChange} checked={isChecked} />
    </label>
  )
}
