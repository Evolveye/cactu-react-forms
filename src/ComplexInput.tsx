import React, { useContext, useEffect, useMemo, useState } from "react"
import { classNames, FormContext, FormContextValue, InputProps, InputValue, InputValues, isError, NativeInputProps } from "./utils"


type ComplexInputProps = {
  name: string,
  children?: React.ReactChildren,
  label?: string | React.ReactChildren,
  style?: React.CSSProperties,
  className?: string,
  errorClassName?: string,
  inheritClassNames?: boolean,
  initialValue?: InputValue,
  validator?: (value:string) => boolean,
  stringify?: (value:InputValue) => string,
}


export function Input({
  name,
  render,
  children,
  style,
  className,
  errorClassName,
  inheritClassNames,
  label = children,
  placeholder = ``,
  initialValue,
  emptyValue,
  validator,
}:InputProps & { render: (props:NativeInputProps) => JSX.Element }) {
  const ctx = useContext( FormContext )

  const fixedValue = initialValue ?? ctx.values?.[ name ]
  const isValuePromise = fixedValue instanceof Promise
  const [ value, setValue ] = useState( isValuePromise ? null : fixedValue )
  const [ error, setError ] = useState<null | string>( null )

  const inheritedClassNames = inheritClassNames ? {
    className: ctx.fieldsClassName || ``,
    errorClassName: ctx.fieldsErrorClassName || ``,
  } : {}

  const updateValues = (name:string, value:InputValue) => {
    ctx.updateValues?.( name, value ?? (emptyValue === undefined ? null : emptyValue) )
  }

  const fullClassName = classNames(
    inheritedClassNames.className,
    isError( error ) ? inheritedClassNames.errorClassName : undefined,
    className,
    isError( error ) ? errorClassName : undefined,
  )

  const properties:NativeInputProps = {
    name,
    placeholder,
    autoComplete: name,
    defaultValue: value,
    style,
    className: label ? undefined : fullClassName,
    onInput: ({ currentTarget:{ value } }) => {
      if (validator) {
        const error = validator( value )

        if (isError( error )) return updateValues( name, `` )
      }

      setError( null )
      updateValues( name, value )
    },
    onBlur: ({ currentTarget:{ value } }) => {
      if (!validator) return

      const error = validator( value )

      if (isError( error )) setError( typeof error === `boolean` ? `` : error )
    },
  }

  useEffect( () => {
    if (!isValuePromise) {
      if (validator && isError( validator( fixedValue ) )) updateValues( name, null )
      else updateValues( name, fixedValue )
    } else fixedValue.then( val => {
      if (validator && isError( validator( val ) )) updateValues( name, null )
      else {
        updateValues( name, val )
        setValue( val )
      }
    } )
  }, [] )

  const content = (
    <>
      {label} {render({ ...properties })}
      {error && <><br /><p>{error}</p></>}
    </>
  )

  return label
    ? <label className={label ? fullClassName : undefined}>{content}</label>
    : content
}

export function ComplexInput({
  name,
  children,
  label,
  className,
  inheritClassNames = true,
  style,
  initialValue,
  stringify: userDefinedStringify,
}:ComplexInputProps) {
  const ctx = useContext( FormContext )

  const fullClassName = classNames( inheritClassNames ? ctx.fieldsClassName : null, className )
  const { initialParts, staticParts, inputs } = getInputsAndPartsFromChildren( children )
  const finalStringify = getStringifier( initialParts, staticParts, userDefinedStringify )

  const [ parts, setParts ] = useState( initialParts )
  const { subinputs, initialValues } = usePreparedSubinputsData(
    inputs,
    initialValue ?? ctx.values?.[ name ],
    initialParts,
    staticParts,
  )

  const wrongGroupNames = useMemo(
    () => Object.keys( initialParts ).reduce( (bool, name) => bool || /[^a-z_]/i.test( name ), false ),
    [ Object.keys( initialParts ).join( `` ) ],
  )

  const stringifiedParts = finalStringify( parts )
  const overridedContextValue:Partial<FormContextValue> = {
    ...ctx,
    fieldsClassName: undefined,
    values: initialValues,
    updateValues: (name, value) => {
      console.log( 4, name, value )
      setParts( parts => ({ ...parts, [ name ]:value }) )
    },
  }


  useEffect( () => {
    ctx.updateValues?.( name, stringifiedParts )
  }, [ stringifiedParts ] )



  if (wrongGroupNames) return `Name property should pass "/[^a-z]/i" regexp test!`

  return (
    <FormContext.Provider value={overridedContextValue}>
      <fieldset className={fullClassName} style={style}>
        {label && <legend>{label}</legend>}
        {subinputs}
      </fieldset>
    </FormContext.Provider>
  )
}



function getInputsAndPartsFromChildren( children:React.ReactNode | React.ReactNode[] ) {
  const initialParts:InputValues = {}
  const staticParts:string[] = []
  const inputs:React.ReactNode[] = []

  React.Children.forEach( children, (c, i) => {
    if (typeof c === `string`) return staticParts.push( c )
    else if (c == null || typeof c !== `object` || !(`props` in c)) return
    else if (i === 0) staticParts.push( `` )

    inputs.push( c )

    initialParts[ c.props.name ] = ``
  } )

  return { initialParts, staticParts, inputs }
}

function getStringifier( initialParts, staticParts, defaultStringifier ) {
  return defaultStringifier || (parts => {
    const groupsnames = Object.keys( initialParts )
    let string = ``

    for (let i = 0;  i < groupsnames.length;  i++) {
      string += (staticParts[ i ] || ``) + parts[ groupsnames[ i ]! ]
    }

    if (staticParts.length > 1) string += staticParts[ staticParts.length - 1 ]

    return string
  })
}

function usePreparedSubinputsData( inputs, initialValue, initialParts, staticParts ) {
  const subinputs = useMemo( () => {
    const children:(string | React.ReactNode)[] = []

    for (let i = 0;  i < inputs.length;  i++) {
      children.push( staticParts[ i ] || ``, inputs[ i ]! )
    }

    if (staticParts.length > 1) children.push( staticParts[ staticParts.length - 1 ]! )

    return children
  }, [ staticParts.join( `` ), inputs.join( `` ) ] )

  const initialValues = useMemo( () => {
    if (!initialValue) return {}

    const groupsnames = Object.keys( initialParts )
    let string = `^`

    for (let i = 0;  i < groupsnames.length;  i++) {
      string += (staticParts[ i ] || ``).replace( /[$^*+()[\]\\|.?]/g, m => `\\${m}` ) + `(?<${groupsnames[ i ]}>.*?)`
    }

    if (staticParts.length > 1) string += staticParts[ staticParts.length - 1 ]

    string += `$`

    const initialValues = new RegExp( string ).exec( initialValue )?.groups

    if (!initialValues) {
      console.warn( `Pased value is not correct` )
      return {}
    }

    return initialValues
  }, [ staticParts.join( `` ) ] )

  return { subinputs, initialValues }
}



// UNUSED This version of ComplexInput use "pattern" field to
//
// export function ComplexInput({
//   name,
//   pattern,
//   children = null,
//   label = null,
//   className = null,
//   inheritClassName = true,
//   style = null,
//   value = null,
//   stringify = null,
// }) {
//   if (!name) return getError( `You have to provide "name" property!` )
//   if (!pattern && !children) return getError( `You have to provide "pattern" or "children" property!` )


//   const ctx = useContext( FormContext )
//   const metadata = useMemo( () => meta, [] )
//   const fullClassName = classNames( inheritClassName ? ctx.fieldsClassName : null, className )

//   console.log( name, value, ctx.values[ name ] )

//   let initialParts = {}
//   let staticParts:string[] = []
//   let inputs:(React.ReactElement | null)[] = []


//   if (children) {
//     const childrenArr = React.Children.toArray( children )

//     childrenArr.forEach( (c, i) => {
//       if (typeof c === `string`) return staticParts.push( c )
//       else if (typeof c !== `object` || !(`props` in c)) return
//       else if (i === 0) staticParts.push( `` )

//       inputs.push( c )

//       initialParts[ c.props.name ] = ``
//     } )
//   } else { // if pattern
//     staticParts = useMemo( () => {
//       const parts = [ `` ]

//       let brackets = 0
//       let escapeMode = false
//       for (const char of pattern) {
//         if (char === `<`) {
//           if (!escapeMode) {
//             if (brackets === 0) parts.push( `` )
//             brackets++
//           }
//         } else if (char === `>`) {
//           if (!escapeMode && brackets > 0) brackets--
//         } else if (char === `\\` && !escapeMode) escapeMode = true
//         else if (brackets === 0) {
//           escapeMode = false
//           parts[ parts.length - 1 ] += char
//         }
//       }

//       return parts
//     }, [ pattern ] )

//     const groups = useMemo( () => {
//       type Group = { name:string, type:string }

//       const groups:Group[] = []
//       const extractGroupsReg = /<(.+?)>/g
//       const groupTypeReg = /^(.+)(:[A-Z]\w+)?$/
//       let match:RegExpExecArray | null = null

//       do {
//         match = extractGroupsReg.exec( pattern )

//         if (!match) continue

//         const [ groupName, groupType = `Text` ] = groupTypeReg.exec( match[ 1 ]! )!.slice( 1 )

//         groups.push({ name:groupName!, type:groupType })
//       } while (match)

//       return groups
//     }, [ pattern ] )

//     inputs = groups.map( ({ name, type }) => {
//       const { inputs } = Form
//       const Tag = inputs[ type ]?.canBeComplex ? inputs[ type ] : null

//       return Tag ? <Tag key={name} name={name} /> : null
//     } )

//     initialParts = useMemo( () => {
//       return groups.reduce( (obj, { name }) => ({ ...obj, [ name ]:`` }), {} )
//     }, [ pattern ] )
//   }


//   const wrongGroupNames = useMemo( () => Object.keys( initialParts ).reduce( (bool, name) => bool || /[^a-z_]/i.test( name ), false ), [ pattern ] )
//   if (wrongGroupNames) return getError( `Name property should pass "/[^a-z]/i" regexp test!` )

//   const finalStringify = stringify || (parts => {
//     const groupsnames = Object.keys( initialParts )
//     let string = ``

//     for (let i = 0;  i < groupsnames.length;  i++) {
//       string += (staticParts[ i ] || ``) + parts[ groupsnames[ i ]! ]
//     }

//     if (staticParts.length > 1) string += staticParts[ staticParts.length - 1 ]

//     return string
//   })

//   const [ parts, setParts ] = useState( initialParts )
//   const stringifiedParts = finalStringify( parts )

//   const builtChildren = useMemo( () => {
//     const children:(string | React.ReactElement)[] = []

//     for (let i = 0;  i < inputs.length;  i++) {
//       children.push( staticParts[ i ] || ``, inputs[ i ]! )
//     }

//     if (staticParts.length > 1) children.push( staticParts[ staticParts.length - 1 ]! )

//     return children
//   }, [ pattern ] )


//   useEffect( () => {
//     ctx.updateValues( name, stringifiedParts, metadata )
//   }, [ stringifiedParts ] )


//   const initialValues = useMemo( () => {
//     const concreteValue = value ?? ctx.values[ name ]

//     if (!concreteValue) return {}

//     const groupsnames = Object.keys( initialParts )
//     let string = `^`

//     for (let i = 0;  i < groupsnames.length;  i++) {
//       string += (staticParts[ i ] || ``).replace( /[$^*+()[\]\\|.?]/g, m => `\\${m}` ) + `(?<${groupsnames[ i ]}>.*?)`
//     }

//     if (staticParts > 1) string += staticParts[ staticParts.length - 1 ]

//     string += `$`

//     const initialValues = new RegExp( string ).exec( concreteValue )?.groups

//     if (!initialValues) {
//       console.warn( `Pased value is not correct` )
//       return {}
//     }

//     return initialValues
//   }, [] )

//   const overridedContextValue = {
//     ...ctx,
//     fieldsClassName: null,
//     values: initialValues,
//     updateValues: (name, value) => {
//       console.log( 4, name, value )
//       setParts( parts => ({ ...parts, [ name ]:value }) )
//     },
//   }

//   return (
//     <FormContext.Provider value={overridedContextValue}>
//       <fieldset className={fullClassName} style={style}>
//         {label && <legend>{label}</legend>}
//         {builtChildren}
//       </fieldset>
//     </FormContext.Provider>
//   )
// }