
export const isError = err => err !== true && (err === false || err)

export function createClasName( ...classNames ) {
  return classNames.filter( Boolean ).join( ` ` ) || undefined
}
