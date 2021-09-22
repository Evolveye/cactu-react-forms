import { createContext, MouseEvent, ReactChildren, ReactNode, Ref, useState } from "react"
import { FormElementsValues } from "./formElement/types"



export const createClasName = (...classNames:(string | null | undefined)[]) => classNames.filter( Boolean ).join( ` ` ) || undefined
export const isError = err => err !== true && (err === false || err)
const inputs: { [key:string]:ReactNode } = {}

type FormProps = {
  children: ReactChildren,
  className?: string,
  values?: FormElementsValues,
  fieldsClassName?: string,
  fieldsErrorClassName?: string,
  placeholders?: boolean,
  ref?:Ref<HTMLFormElement>
}

type FormSubmitProps = {
  children?: ReactNode,
  className?: string,
  handler: (values:FormElementsValues) => void,
}

export type FormContextValue = {
  updateValues: (name:string, value:unknown, meta?:{ [key:string]: unknown }) => void,
  submit: (e:MouseEvent, handler:((values:FormElementsValues<unknown>) => void)) => void,
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
  ref,
}:FormProps) {
  const [ fieldsValues, setValues ] = useState<FormElementsValues<unknown>>({})

  const updateValues = (name:string, value:unknown) => setValues( currentValues => ({
    ...currentValues,
    [ name ]: value,
  }) )

  const submit = async(e:MouseEvent, handler:(values:FormElementsValues<unknown>) => void) => {
    e.preventDefault()
    handler?.( fieldsValues )
  }

  return (
    <form className={className} ref={ref}>
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
