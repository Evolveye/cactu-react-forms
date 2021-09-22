import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './main.css'
import Form, { Email, Link, Password, Submit, Text, Number, Time, Select, SelectItem } from "cactu-react-forms"

export default function App() {
  return (
    <Form fieldsClassName="field">
      <Number name="num" initialValue={123}>Number</Number>
      <Text name="login">Login</Text>
      <Password name="password">Password</Password>
      <Email name="email">Email</Email>
      <Link name="link">Link</Link>
      <Time name="time">Time</Time>

      <Select multiple name="select">
        <SelectItem>1</SelectItem>
        <SelectItem value={22}>2</SelectItem>
        <SelectItem value="33">3</SelectItem>
      </Select>

      {/* <ComplexFieldset name="hours" className="is-complex" label="Hours">
        <Time name="from" />
      </ComplexFieldset> */}

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
