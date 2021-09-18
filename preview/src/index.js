import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './main.css'
import ReactComponent from "cactu-react-forms"

export default function App() {
  return <ReactComponent />
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById( `root` ),
)
