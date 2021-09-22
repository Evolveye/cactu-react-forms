import { CSSProperties, FocusEvent, FormEvent, ReactNode } from "react"
import { FormElementPrimitiveValue, FormElementProps } from "src/formElement/types.js"



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

export type NativeInputProps<TValue=FormElementPrimitiveValue> = {
  name: string,
  placeholder?: string,
  autoComplete?: string,
  defaultValue?: TValue,
  style?: CSSProperties,
  className?: string,
  onInput: (eOrValue:FormEvent<HTMLInputElement | HTMLTextAreaElement> | TValue | null) => void,
  onBlur: (eOrValue:FocusEvent<HTMLInputElement | HTMLTextAreaElement> | TValue | null) => void,
}

export type WrappedInputProps<TValue=FormElementPrimitiveValue> = FormElementProps<TValue> & {
  label?: ReactNode,
  children?: ReactNode,
  style?: CSSProperties,
  placeholder?: string,
  autoComplete?: InputAutocomplete,
}

export type InputProps<TValue=FormElementPrimitiveValue> = WrappedInputProps<TValue> & {
  children?: ((props:NativeInputProps<TValue>) => JSX.Element) | null,
  // render?: ((props:NativeInputProps<TValue>) => JSX.Element) | null
}


