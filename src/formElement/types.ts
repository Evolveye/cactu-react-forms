import { MutableRefObject } from "react"


export type FormElementPrimitiveValue = number | string
export type FormElementValue<TValue=FormElementPrimitiveValue> = TValue | Promise<TValue>
export type FormElementMeta<TValue=FormElementPrimitiveValue> = {
  name: string,
  value: FormElementValue<TValue> | null,
  optional: boolean,
  [key:string]: unknown,
}

export type FormElementsValues<TValue=FormElementPrimitiveValue> = Record<string, FormElementMeta<TValue>>

export type ValidationError = string
export type Validator<TValue=FormElementPrimitiveValue> = (value:TValue) => ValidationError | undefined
export type FormElementProps<TValue=FormElementPrimitiveValue, TRef=unknown> = {
  name: string,
  className?: string,
  errorClassName?: string,
  inheritClassNames?: boolean,
  initialValue?: FormElementValue<TValue>,
  emptyValue?: TValue,
  meta?: { [key:string]: unknown }
  optional?: boolean,
  ref?: MutableRefObject<TRef | null>
  validator?: Validator<TValue>,
}
