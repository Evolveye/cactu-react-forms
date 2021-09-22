import * as React from "react"
import { FormElementValue, FormElementsValues } from "src/formElement/types"






export type FormContextValue = {
  updateValues: (name:string, value:FormElementValue | null, meta?:{ [key:string]: FormElementValue }) => void,
  submit: (e:React.MouseEvent, handler:((values:FormElementsValues) => void)) => void,
  fieldsErrorClassName: string,
  fieldsClassName?: string,
  showPlaceholder: boolean,
  values: FormElementsValues,
}


export type InputProps<TValue=FormElementValue> = {
  name: string,
  children?: React.ReactChildren,
  style?: React.CSSProperties,
  className?: string,
  errorClassName?: string,
  inheritClassNames?: boolean,
  initialValue?: TValue,
  validator?: (value:FormElementValue) => boolean,
  placeholder?: string,
  label?: string | React.ReactChildren,
  emptyValue?: FormElementValue,
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
