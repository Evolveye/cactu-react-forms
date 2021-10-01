import { MutableRefObject, ReactNode } from "react"
import { FormElementProps } from "src/formElement/types"

export type ComplexFieldsetInitialValue = { [key:string]:unknown }[]

export type ComplexFieldsetProps = FormElementProps<ComplexFieldsetInitialValue> & {
  ref?: MutableRefObject<HTMLFieldSetElement | null>
  label:ReactNode
  initialCount: number
  children: ReactNode
  fieldsClassName?: string
  fieldsErrorClassName?: string
}

