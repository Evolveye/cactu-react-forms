import { CSSProperties, FocusEvent, FormEvent, MutableRefObject, ReactNode } from "react"
import { FormElementProps } from "src/formElement/types.js"



export enum InputAutocomplete {
  OFF = `off`,
  ON = `on`,
  NAME = `name`,
  HONORIFIC_PREFIX = `honorific-prefix`,
  GIVEN_NAME = `given-name`,
  ADDITIONAL_NAME = `additional-name`,
  FAMILI_NAME = `famili-name`,
  HONORIFIC_SUFFIX = `honorific-suffix`,
  NICKNAME = `nickname`,
  EMAIL = `email`,
  USERNAME = `username`,
  NEW_PASSWORD = `new-password`,
  CURRENT_PASSWORD = `current-password`,
  ONE_TIME_CODE = `one-time-code`,
  ORGANISATION_TITLE = `organisation-title`,
  ORGANISATION = `organisation`,
  STREET_ADDRESS = `street-address`,
  ADDRESS_LINE1 = `address-line1`,
  ADDRESS_LINE2 = `address-line2`,
  ADDRESS_LINE3 = `address-line3`,
  ADDRESS_LEVEL4 = `address-level4`,
  ADDRESS_LEVEL3 = `address-level3`,
  ADDRESS_LEVEL2 = `address-level2`,
  ADDRESS_LEVEL1 = `address-level1`,
  COUNTRY = `country`,
  POSTAL_CODE = `postal-code`,
  CC_NAME = `cc-name`,
  CC_GIVEN_NAME = `cc-given-name`,
  CC_ADDITIONAL_NAME = `cc-additional-name`,
  CC_FAMILY_NAME = `cc-family-name`,
  CC_NUMBER = `cc-number`,
  CC_EXP = `cc-exp`,
  CC_EXP_MONTH = `cc-exp-month`,
  CC_EXP_YEAR = `cc-exp-year`,
  CC_CSC = `cc-csc`,
  CC_TYPE = `cc-type`,
  TRANSACTION_CURRENCY = `transaction-currency`,
  TRANSACTION_AMOUNT = `transaction-amount`,
  LANGUAGE = `language`,
  BDAY = `bday`,
  BDAY_DAY = `bday-day`,
  BDAY_MONTH = `bday-month`,
  BDAY_YEAR = `bday-year`,
  SEX = `sex`,
  TEL = `tel`,
  TEL_COUNTRY_CODE = `tel-country-code`,
  TEL_NATIONAL = `tel-national`,
  TEL_AREA_CODE = `tel-area-code`,
  TEL_LOCAL = `tel-local`,
  TEL_EXTENSION = `tel-extension`,
  IMPP = `impp`,
  URL = `url`,
  PHOTO = `photo`,
}

export type NativeInputProps<TRef=HTMLInputElement, TValue=string> = {
  ref?: MutableRefObject<TRef | null>
  name: string,
  placeholder?: string,
  autoComplete?: string,
  value?:TValue,
  style?: CSSProperties,
  className?: string,
  onInput: (eOrValue:FormEvent<HTMLInputElement | HTMLTextAreaElement> | TValue | null) => void,
  onBlur: (eOrValue:FocusEvent<HTMLInputElement | HTMLTextAreaElement> | TValue | null) => void,
}

export type InputProps<TRef=HTMLInputElement, TValue=string, TParsedValue=TValue> = FormElementProps<TValue, TParsedValue> & {
  ref?: MutableRefObject<TRef | null>
  label?: ReactNode,
  style?: CSSProperties,
  placeholder?: string,
  autoComplete?: InputAutocomplete,
  children?: ReactNode, // ((props:NativeInputProps<TValue, TRef>) => JSX.Element) | null,
  render?: ((props:NativeInputProps<TRef, TValue>) => JSX.Element) | null,
}

export type WrappedInputProps<TRef=HTMLInputElement, TValue=string, TParsedValue=TValue> =
  & Omit<InputProps<TRef, TValue, TParsedValue>, `emptyValue` | `render`>
  & { emptyValue?:TParsedValue }



//
// Inputs
//



export type NumberRange = {
  length: number,
  step: number,
}

export type TextInputProps = WrappedInputProps<HTMLInputElement | HTMLTextAreaElement> & {
  errors?: {
    maxLength?: string,
    regExp?: string,
  },
  long?: boolean,
  maxLength?: number,
  regExp?: RegExp,
}

export type NumberInputProps = WrappedInputProps<HTMLInputElement, string, number> & {
  errors?: {
    notANumber?: string,
    wrongType?: string,
    tooBig?: string,
    tooLow?: string,
  },
  min?: number,
  max?: number,
  type?: `int` | `float`,
  // TODO type?: `big int` | `int` | `float`,
  step?: number | NumberRange | NumberRange[],
}

export type PasswordInputProps = WrappedInputProps & {
  errors?: {
    minLength?: string,
    numbers?: string,
    loverChars?: string,
    upperChars?: string,
    specialChars?: string,
  },
  required?: {
    minLength?: number,
    numbers?: boolean | number,
    loverChars?: boolean | number,
    upperChars?: boolean | number,
    specialChars?: boolean | number,
  }
}

export type EmailInputProps = WrappedInputProps & {
  error?: string
}

export type LinkInputProps = WrappedInputProps & {
  errors?: {
    wrongURL?: string,
    wrongProtocol?: string,
  }
  protocol?: string | string[],
}

export type MediaInputProps = WrappedInputProps<HTMLInputElement, string | File> & {
  errors?: {
    wrongURL?: string,
    wrongProtocol?: string,
  }
  audio?: boolean,
  video?: boolean,
  image?: boolean,
  extensions?: string[],
}

