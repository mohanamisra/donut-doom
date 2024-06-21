import { useState } from 'react'
import './App.css'
import Ball from './components/Ball/Ball.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="gameContainer">
      <Ball/>
    </div>
  )
}

export default App
