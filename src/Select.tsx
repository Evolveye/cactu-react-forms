import { useState, useContext, useEffect, ReactNode, createContext } from "react"
import { classNames, FormContext } from "./utils.js"

type SelectProps = {
  name: string,
  children: ReactNode,
  label?: ReactNode,
  className?: string,
  fieldsClassName?: string,
  multiple?: boolean,
}

type SelectContext = {
  name: string,
  multiple: boolean,
  checkedValues: unknown[]
  updateChecks: (checked:boolean, value:unknown) => void
}

const FormSelectContext = createContext<Partial<SelectContext>>( {} )

export function Select({ name, children = [], className = undefined, fieldsClassName = undefined, multiple = false, label = undefined }:SelectProps) {
  const formCtx = useContext( FormContext )
  const [ checkedValues, setCheckedValues ] = useState<unknown[]>([])
  const fullClassName = classNames( formCtx.fieldsClassName, className )

  const overridedFormContextValue = {
    ...formCtx,
    fieldsClassName,
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
    formCtx.updateValues?.( name, checkedValues )
  }, [ JSON.stringify( checkedValues ) ] )

  return (
    <FormContext.Provider value={overridedFormContextValue}>
      <fieldset className={fullClassName}>
        {label && <legend>{label}</legend>}

        <FormSelectContext.Provider value={selectContextValue}>
          {children}
        </FormSelectContext.Provider>
      </fieldset>
    </FormContext.Provider>
  )
}
export function SelectItem({ children, value = children, checked = false, className = null }) {
  const formCtx = useContext( FormContext )
  const selectCtx = useContext( FormSelectContext )

  const fullClassName = classNames( formCtx.fieldsClassName, className )
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
