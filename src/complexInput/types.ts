import { CSSProperties, MutableRefObject, ReactNode } from "react"
import { FormElementProps, FormElementValue } from "src/formElement/types.js"


export type ComplexInputProps<TValue=string> =
  & Omit<FormElementProps<TValue>, `emptyValue`>
  & {
    ref?: MutableRefObject<HTMLFieldSetElement | null>
    label?: ReactNode,
    style?: CSSProperties,
    children?: ReactNode,
    stringify?: (value:FormElementValue) => string,
  }

export type WrappedComplexInputProps<TValue=string> = Omit<ComplexInputProps<TValue>, `stringify`>
