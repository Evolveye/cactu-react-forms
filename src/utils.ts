import React from "react"


export const classNames = (...classNames) => classNames.filter( Boolean ).join( ` ` ) || undefined
export const isError = err => err !== true && (err === false || err)


export type InputValue = unknown
export type InputValues = { [key:string]: InputValue }
export type FormContextValue = {
  updateValues: (name:string, value:InputValue, meta?:{ [key:string]: InputValue }) => void,
  submit: (e:React.MouseEvent, handler:((values:InputValues) => void)) => void,
  fieldsErrorClassName: string,
  fieldsClassName?: string,
  showPlaceholder: boolean,
  values: InputValues,
}

export type FormSubmitProps = {
  children?: React.ReactChildren,
  className?: string,
  handler: (values:InputValues) => void,
}

export type InputProps<T=InputValue> = {
  name: string,
  children?: React.ReactChildren,
  style?: React.CSSProperties,
  className?: string,
  errorClassName?: string,
  inheritClassNames?: boolean,
  initialValue?: T,
  validator?: (value:InputValue) => boolean,
  placeholder?: string,
  label?: string | React.ReactChildren,
  emptyValue?: InputValue,
}

export type NativeInputProps<T=unknown> = {
  name: string,
  placeholder?: string,
  autoComplete?: string,
  defaultValue?: T,
  style?: React.CSSProperties,
  className?: string,
  onInput: (eOrValue:React.FormEvent<HTMLInputElement | HTMLTextAreaElement> | unknown) => void,
  onBlur: (eOrValue:React.FocusEvent<HTMLInputElement | HTMLTextAreaElement> | unknown) => void,
}



export const FormContext = React.createContext<Partial<FormContextValue>>({})
