import { CSSProperties, ReactNode } from "react"
import { FormElementPrimitiveValue, FormElementProps, FormElementValue } from "src/formElement/types.js"


export type ComplexInputProps<TValue=FormElementPrimitiveValue> =
  & Omit<FormElementProps<TValue, HTMLFieldSetElement>, `emptyValue`>
  & {
    label?: ReactNode,
    style?: CSSProperties,
    children?: ReactNode,
    stringify?: (value:FormElementValue) => string,
  }

export type WrappedComplexInputProps<TValue=FormElementPrimitiveValue> = Omit<ComplexInputProps<TValue>, `stringify`>
