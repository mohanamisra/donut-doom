import { useState } from 'react'
import './App.css'
import Ball from './components/Ball/Ball.jsx'
import Goal from './components/Goal/Goal.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="gameContainer">
      <Ball/>
      <Goal/>
    </div>
  )
}

export default App
