import React from 'react'
import ReactDOM from 'react-dom'
import './main.css'
import ReactComponent from "typescript-react-component"

export default function App() {
  return <ReactComponent />
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById( `root` ),
)
