import { createContext, MouseEvent, ReactChildren, ReactNode, Ref, useContext, useState } from "react"
import { FormElementMeta, FormElementsValues } from "./formElement/types"



export const createClasName = (...classNames:(string | null | undefined)[]) => classNames.filter( Boolean ).join( ` ` ) || undefined
export const isError = err => err !== true && (err === false || err)

type FormValuesUpdater = (meta:FormElementMeta<unknown>) => void
type FormValuesGetter = () => FormElementsValues<unknown>
type FormProps = {
  children: ReactChildren,
  className?: string,
  values?: FormElementsValues,
  fieldsClassName?: string,
  fieldsErrorClassName?: string,
  defaultOptional?: boolean,
  placeholders?: boolean,
  allowPredefinedStyle?: boolean,
  ref?:Ref<HTMLFormElement>
}

type FormSubmitProps = {
  children?: ReactNode,
  className?: string,
  fullData?: boolean,
  handler: (values:FormElementsValues<unknown>) => void,
}

export type FormContextValue = {
  updateValues: FormValuesUpdater,
  getElementsData: FormValuesGetter,
  allowPredefinedStyle?: boolean,
  fieldsErrorClassName: string,
  fieldsClassName?: string,
  showPlaceholder: boolean,
  defaultOptional: boolean,
  values: {[key:string]: unknown},
}

export const FormContext = createContext<Partial<FormContextValue>>({})

export const Form:(properties:FormProps) => JSX.Element = ({
  children,
  className,
  fieldsClassName,
  fieldsErrorClassName,
  values = {},
  placeholders = false,
  defaultOptional = false,
  allowPredefinedStyle,
  ref,
}) => {
  const [ fieldsValues, setValues ] = useState<FormElementsValues<unknown>>({})

  const updateValues:FormValuesUpdater = meta => setValues( currentValues => ({
    ...currentValues,
    [ meta.name ]: meta,
  }) )

  const getElementsData:FormValuesGetter = () => fieldsValues

  const ContextValue = {
    updateValues,
    getElementsData,
    fieldsClassName,
    fieldsErrorClassName,
    showPlaceholder: placeholders,
    allowPredefinedStyle,
    defaultOptional,
    values,
  }

  return (
    <form className={className} ref={ref}>
      <FormContext.Provider value={ContextValue}>
        {children}
      </FormContext.Provider>
    </form>
  )
}

export function Submit({ children, className, fullData = false, handler }:FormSubmitProps) {
  const { getElementsData } = useContext( FormContext )

  const submit = (e:MouseEvent) => {
    e.preventDefault()

    const fieldsValues = getElementsData?.() ?? {}

    const data = fullData
      ? fieldsValues
      : Object.entries( fieldsValues ).reduce( (obj, [ name, { value } ]) => ({ ...obj, [ name ]:value }), {} )

    handler?.( data )
  }

  return <button type="submit" className={className} onClick={submit} children={children} />
}

export default Form
