import { MutableRefObject } from "react"
import { Validator } from "src/formElement/types.js"
import { Input } from "./Input.js"
import { EmailInputProps, InputAutocomplete, LinkInputProps, MediaInputProps, NumberInputProps, PasswordInputProps, TextInputProps } from "./types.js"



function buildValidator<TValue=string>( originalValidator:Validator<TValue> | undefined, overridedValdiator:(value:TValue) => (boolean | string | undefined) ) {
  return (data:TValue) => {
    const errorLike = overridedValdiator( data )

    if (typeof errorLike === `string`) return errorLike

    return originalValidator?.( data )
  }
}



export function Text({ errors, long = false, maxLength = Infinity, regExp, ref, emptyValue:userDefinedEmptyValue, ...restProps }:TextInputProps) {
  const emptyValue = userDefinedEmptyValue ?? ``
  const validator = buildValidator( restProps.validator, string => {
    if (string.length > maxLength) return errors?.maxLength ?? `String is too long`
    if (regExp && !regExp.test( string )) return errors?.regExp ?? `String not passed privided string`
  } )

  if (!long) return (
    <Input<string>
      ref={ref as MutableRefObject<HTMLInputElement>}
      {...restProps}
      emptyValue={emptyValue}
      validator={validator}
      render={p => <input {...p} type="text" />}
    />
  )

  return (
    <Input<string, HTMLTextAreaElement>
      ref={ref as MutableRefObject<HTMLTextAreaElement>}
      {...restProps}
      emptyValue={emptyValue}
      validator={validator}
      render={
        p => (
          <>
            {restProps.children || restProps.label ? <br /> : null}
            <textarea {...p} />
          </>
        )
      }
    />
  )
}


const MAX_SAFE_NUM = window?.Number.MAX_SAFE_INTEGER ??  1_000_000_000_000
const MIN_SAFE_NUM = window?.Number.MIN_SAFE_INTEGER ?? -1_000_000_000_000
export function Number({ errors, min = MIN_SAFE_NUM, max = MAX_SAFE_NUM, type = `int`, step, emptyValue, ...restProps }:NumberInputProps) {
  // TODO if (type !== `big int`) {
  if (min < MIN_SAFE_NUM) {
    console.warn( `Value of "min" parameter is lover than minimum safe number. Use "big int" input type.` )
  }

  if (max > MAX_SAFE_NUM) {
    console.warn( `Value of "max" parameter is bigger than maximum safe number. Use "big int" input type.` )
  }
  // }

  const validator = buildValidator<number>( restProps.validator, number => {
    if (typeof number !== `number`) return errors?.notANumber ?? `It's not a number!`
    if (type === `int` && Math.floor( number ) !== number) return errors?.wrongType ?? `Number should be an inteeger`
    if (max < number) return errors?.tooBig ?? `Number is too big`
    if (number < min) return errors?.tooLow ?? `Number is too small`
  } )

  return (
    <Input
      initialValue={0}
      {...restProps}
      emptyValue={emptyValue ?? 0}
      validator={validator}
      render={p => <input {...p} step={typeof step === `number` ? step : undefined} type="number" min={min} max={max}  />}
    />
  )
}


export function Password({ errors, required, emptyValue, ...restProps }:PasswordInputProps) {
  const validator = buildValidator( restProps.validator, text => {
    if (!required) return

    if (required.minLength) {
      if (text.length < required.minLength) return errors?.minLength ?? `Too short password`
    }

    if (required.numbers) {
      if (text.match( /\d/g )?.length ?? 0 < required.numbers) return errors?.numbers ?? `Too small count of numbers`
    }

    if (required.loverChars) {
      const sumOfLoverCaseChars = text.toLowerCase().split( `` ).reduce(
        (sum, char, i) => sum + (char === text[ i ] ? 1 : 0),
        0,
      )

      if (sumOfLoverCaseChars < required?.loverChars) return errors?.loverChars ?? `Too small count of lover case characters`
    }

    if (required.upperChars) {
      const sumOfLoverCaseChars = text.toUpperCase().split( `` ).reduce(
        (sum, char, i) => sum + (char === text[ i ] ? 1 : 0),
        0,
      )

      if (sumOfLoverCaseChars < required.upperChars) return errors?.upperChars ?? `Too small count of upper case characters`
    }

    if (required.specialChars) {
      const specialChars = new RegExp(`!@#$%^&*()+-=[]{};':",./<>?`.split( `` ).join( `|` ), `g`)

      if (text.match( specialChars )?.length ?? 0 < required.specialChars) return errors?.specialChars ?? `Too small count of special characters`
    }
  } )

  return (
    <Input
      autoComplete={InputAutocomplete.CURRENT_PASSWORD}
      {...restProps}
      emptyValue={emptyValue ?? ``}
      validator={validator}
      render={p => <input {...p} type="password" />}
    />
  )
}


export function Email({ error = `Invalid email`, emptyValue, ...restProps }:EmailInputProps) {
  const validator = buildValidator( restProps.validator, text => /\w+@\w+\.\w+/.test( text ) ? undefined : error )

  return (
    <Input
      autoComplete={InputAutocomplete.EMAIL}
      {...restProps}
      emptyValue={emptyValue ?? ``}
      validator={validator}
      render={p => <input {...p} type="email" />}
    />
  )
}


export function Link({ errors, protocol, emptyValue, ...restProps }:LinkInputProps) {
  const protocols = protocol ? (Array.isArray( protocol ) ? protocol : [ protocol ]) : undefined
  const validator = buildValidator( restProps.validator, text => {
    let url:URL

    try {
      url = new URL(text)
    } catch {
      return errors?.wrongURL ?? `Invalid URL`
    }

    if (protocol !== undefined && protocols!.some( p => url.protocol.startsWith( p ) )) return errors?.wrongProtocol ?? `Wrong protocol`
  } )

  return (
    <Text
      autoComplete={InputAutocomplete.URL}
      {...restProps}
      emptyValue={emptyValue ?? ``}
      validator={validator}
    />
  )
}


export function File({ audio, video, image, extensions, emptyValue, ...restProps }:MediaInputProps) {
  if (extensions?.some( e => !e.startsWith( `.` ) )) console.error( `Every file extension should start with "."` )

  const accept = [
    audio ? `audio/*` : undefined,
    video ? `video/*` : undefined,
    image ? `image/*` : undefined,
    ...(extensions ? extensions : []),
  ].filter( Boolean ).join( `, ` )

  return (
    <Input<string | File>
      {...restProps}
      emptyValue={emptyValue ?? ``}
      label={restProps.label ?? restProps.children}
      render={
        p => (
          <input
            {...p}
            type="file"
            accept={accept}
            value={typeof p.value === `string` ? p.value : undefined}
            onInput={({ currentTarget:t }) => p.onInput( t.files?.[ 0 ] ?? null )}
          />
        )
      }
    />
  )
}
