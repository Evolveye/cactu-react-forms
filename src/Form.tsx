import { createContext, MouseEvent, ReactChildren, ReactNode, useState } from "react"
import { FormElementsValues, FormElementValue } from "./formElement/types"



const inputs: { [key:string]:ReactNode } = {}

type FormProps = {
  children: ReactChildren,
  className?: string,
  values?: FormElementsValues,
  fieldsClassName?: string,
  fieldsErrorClassName?: string,
  placeholders?: boolean,
}

type FormSubmitProps = {
  children?: ReactNode,
  className?: string,
  handler: (values:FormElementsValues) => void,
}

export type FormContextValue = {
  updateValues: (name:string, value:FormElementValue | null, meta?:{ [key:string]: unknown }) => void,
  submit: (e:MouseEvent, handler:((values:FormElementsValues) => void)) => void,
  fieldsErrorClassName: string,
  fieldsClassName?: string,
  showPlaceholder: boolean,
  values: FormElementsValues,
}

export const FormContext = createContext<Partial<FormContextValue>>({})

Form.inputs = inputs
export default function Form({
  children,
  className,
  fieldsClassName,
  fieldsErrorClassName,
  values = {},
  placeholders = false,
}:FormProps) {
  const [ fieldsValues, setValues ] = useState<FormElementsValues>({})

  const updateValues = (name:string, value:FormElementValue) => setValues( currentValues => ({
    ...currentValues,
    [ name ]: value,
  }) )

  const submit = async(e:MouseEvent, handler:(values:FormElementsValues) => void) => {
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
