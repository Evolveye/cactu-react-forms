export type FormElementValue<TValue=string> = TValue | Promise<TValue>
export type FormElementMeta<TValue=string> = {
  name: string,
  value: FormElementValue<TValue> | null,
  optional: boolean,
  [key:string]: unknown,
}

export type ValidationError = string
export type ValidationResult<TValue> = { value?:TValue | null }
export type ValidatorValue<TValue> = ValidationError | ValidationResult<TValue> | undefined
export type Parser<TInput=string, TOutput=TInput> = (value:TInput) => TOutput
export type Inputifier<TInput=string, TOutput=TInput> = (value:TInput) => TOutput
export type Validator<TValue=string, TParsedValue=TValue> = (value:TValue | null, parser:Parser<TValue, TParsedValue>) => ValidatorValue<TValue>

export type FormElementsValues<TValue=string> = Record<string, FormElementMeta<TValue>>
export type FormElementProps<TValue=string, TParsedValue=TValue> = {
  name: string,
  className?: string,
  errorClassName?: string,
  inheritClassNames?: boolean,
  initialValue?: FormElementValue<TParsedValue>,
  emptyValue: TParsedValue,
  meta?: { [key:string]: unknown }
  optional?: boolean,
  preventWrongValue?: boolean,
  validator?: Validator<TValue, TParsedValue>,
  parse?: Parser<TValue, TParsedValue>
  inputify?: Inputifier<TParsedValue, TValue>
}
