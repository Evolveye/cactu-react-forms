import { CSSProperties, ReactNode } from "react"
import { FormElementPrimitiveValue, FormElementProps, FormElementValue } from "src/formElement/types.js"



export type WrappedComplexInputProps<TValue=FormElementPrimitiveValue> = FormElementProps<TValue, HTMLFieldSetElement> & {
  label?: ReactNode,
  children?: ReactNode,
  style?: CSSProperties,
}

export type ComplexInputProps<TValue=FormElementPrimitiveValue> = WrappedComplexInputProps<TValue> & {
  stringify?: (value:FormElementValue) => string,
  children?: ReactNode,
}
