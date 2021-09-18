import React, { useState } from "react"
import { FormContext, FormSubmitProps, InputValue, InputValues } from "./utils.js"


const inputs: { [key:string]:React.ReactNode } = {}

type FormProps = {
  children: React.ReactChildren,
  className?: string,
  values?: InputValues,
  fieldsClassName?: string,
  fieldsErrorClassName?: string,
  placeholders?: boolean,
}

Form.inputs = inputs
export default function Form({
  children,
  className,
  fieldsClassName,
  fieldsErrorClassName,
  values = {},
  placeholders = false,
}:FormProps) {
  const [ fieldsValues, setValues ] = useState<InputValues>({})

  const updateValues = (name:string, value:InputValue) => setValues( currentValues => ({
    ...currentValues,
    [ name ]: value,
  }) )

  const submit = async(e:React.MouseEvent, handler:(values:InputValues) => void) => {
    e.preventDefault()
    handler?.( fieldsValues )
  }

  return (
    <form className={className}>
      <FormContext.Provider value={{ updateValues, submit, fieldsClassName, fieldsErrorClassName, showPlaceholder:placeholders, values }}>
        {children}
      </FormContext.Provider>
    </form>
  )
}

export function Submit({ children, className, handler }:FormSubmitProps) {
  return (
    <FormContext.Consumer>
      {({ submit }) => <button type="submit" className={className} onClick={e => submit?.( e, handler )} children={children} />}
    </FormContext.Consumer>
  )
}
