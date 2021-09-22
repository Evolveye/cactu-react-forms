import { ReactNode } from "react"
import { FormElementProps } from "src/formElement/types.js"

export type SelectProps = FormElementProps<unknown> & {
  children: ReactNode,
  label?: ReactNode,
  fieldsClassName?: string,
  multiple?: boolean,
}

export type SelectContext = {
  name: string,
  multiple: boolean,
  checkedValues: unknown[]
  updateChecks: (checked:boolean, value:unknown) => void
}
