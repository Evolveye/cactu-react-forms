export {}
// import { FocusEvent, FormEvent, useContext, useEffect, useState } from "react"
// import { FormContext, InputProps, NativeInputProps } from "./utils/utils.js"
// import useInputBaseData from "./input/useInputData.js"


// const isEvent = something => true
//   && something
//   && typeof something === `object`
//   && [ `SyntheticBaseEvent` ].includes( something.constructor.name )


// export function Input({
//   render,
//   children,
//   style,
//   label = children,
//   placeholder,
//   ...inputBaseProps
// }:InputProps & { render: (props:NativeInputProps) => JSX.Element }) {
//   const inputData = useInputBaseData( inputBaseProps )

//   const properties:NativeInputProps = {
//     name,
//     placeholder,
//     autoComplete: name,
//     defaultValue: value,
//     style,
//     className: label ? undefined : fullClassName,
//     onInput: eOrValue => {
//       const value = extractValueFromEventOrReturnObj

//       if (validator) {
//         const error = validator( value )

//         if (isError( error )) return updateValues( name, `` )
//       }

//       setError( null )
//       updateValues( name, value )
//     },
//     onBlur: eOrValue => {
//       const value = isEvent( eOrValue )
//         ? (eOrValue as unknown as FocusEvent<HTMLInputElement | HTMLTextAreaElement>).currentTarget?.value
//         : eOrValue

//       if (!validator) return

//       const error = validator( value )

//       if (isError( error )) setError( typeof error === `boolean` ? `` : error )
//     },
//   }

//   const content = (
//     <>
//       {label} {render({ ...properties })}
//       {error && <><br /><p>{error}</p></>}
//     </>
//   )

//   if (!name) {
//     console.error( `You have to pass "name" property to input` )
//     return null
//   }

//   return label
//     ? <label className={label ? fullClassName : undefined}>{content}</label>
//     : content
// }
