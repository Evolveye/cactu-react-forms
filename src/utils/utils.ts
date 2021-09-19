import * as React from "react"
import { InputValue, InputValues } from "../input/InputValue"






export type FormContextValue = {
  updateValues: (name:string, value:InputValue | null, meta?:{ [key:string]: InputValue }) => void,
  submit: (e:React.MouseEvent, handler:((values:InputValues) => void)) => void,
  fieldsErrorClassName: string,
  fieldsClassName?: string,
  showPlaceholder: boolean,
  values: InputValues,
}


export type InputProps<TValue=InputValue> = {
  name: string,
  children?: React.ReactChildren,
  style?: React.CSSProperties,
  className?: string,
  errorClassName?: string,
  inheritClassNames?: boolean,
  initialValue?: TValue,
  validator?: (value:InputValue) => boolean,
  placeholder?: string,
  label?: string | React.ReactChildren,
  emptyValue?: InputValue,
  meta?: { [key:string]: string | number }
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
