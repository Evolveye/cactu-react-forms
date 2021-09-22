import { Ref } from "react"

export type FormElementPrimitiveValue = number | string
export type FormElementValue<TValue=FormElementPrimitiveValue> = TValue | Promise<TValue>
export type FormElementsValues<TValue=FormElementPrimitiveValue> = { [key:string]: FormElementValue<TValue> | null }

export type ValidationError = string
export type Validator<TValue=FormElementPrimitiveValue> = (value:TValue) => ValidationError | undefined
export type FormElementProps<TValue=FormElementPrimitiveValue, TRef=unknown> = {
  name: string,
  className?: string,
  errorClassName?: string,
  inheritClassNames?: boolean,
  initialValue?: FormElementValue<TValue>,
  emptyValue?: TValue,
  meta?: { [key:string]: string | number }
  ref?: Ref<TRef>
  validator?: Validator<TValue>,
}
