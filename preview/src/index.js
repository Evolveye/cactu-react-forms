import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './main.css'
import Form, { Email, Link, Password, Submit, Text, Number, Time, Select, SelectItem, ComplexFieldset } from "cactu-react-forms"

export default function App() {
  return (
    <Form fieldsClassName="field">
      <Text name="login">Login</Text>
      <Text long name="description">Desctiption</Text>

      <Email optional name="email">Email</Email>

      <Password name="password">Password</Password>

      <Number name="num" initialValue={123} min={-1234}>Inteeger</Number>
      <Number name="num" type="float" floatPrecision={5} initialValue={123.45} max={1234}>Float</Number>
      <Number name="num" type="big int" initialValue={12345n}>Big int</Number>

      <Link name="link" initialValue={new Promise( r => setTimeout( () => r( `http://localhost:3000` ), 2000 ) )}>Link</Link>
      <Time name="time">Time</Time>

      <Select multiple name="select" label="Select">
        <SelectItem>1</SelectItem>
        <SelectItem value={22}>2</SelectItem>
        <SelectItem value="33">3</SelectItem>
      </Select>

      <ComplexFieldset name="hours" className="is-complex" label="Hours">
        <Time name="from" />
      </ComplexFieldset>

      <Submit handler={data => console.log( data )}>Submit</Submit>
    </Form>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById( `root` ),
)
