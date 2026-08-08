import { useState, useRef } from 'react'
import { Text, Stack } from '@mantine/core'
import './Dice3D.css'

interface Dice3DProps {
  label: string
  onRollComplete: (result: number) => void
  disabled?: boolean
}

export function Dice3D({ label, onRollComplete, disabled = false }: Dice3DProps) {
  const [rolling, setRolling] = useState(false)
  const diceRef = useRef<HTMLDivElement>(null)

  const rollDice = () => {
    if (rolling || disabled || !diceRef.current) return

    setRolling(true)

    const result = Math.floor(Math.random() * 6) + 1
    const randomX = Math.floor(Math.random() * 720) + 360
    const randomY = Math.floor(Math.random() * 720) + 360

    diceRef.current.style.transition = "transform 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)"
    diceRef.current.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`

    setTimeout(() => {
      let finalX = 0, finalY = 0

      switch (result) {
        case 1: finalX = 0; finalY = 0; break
        case 2: finalX = 0; finalY = 180; break
        case 3: finalX = 0; finalY = -90; break
        case 4: finalX = 0; finalY = 90; break
        case 5: finalX = 90; finalY = 0; break
        case 6: finalX = -90; finalY = 0; break
      }

      if (diceRef.current) {
        diceRef.current.style.transition = "transform 0.5s ease-out"
        diceRef.current.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg)`
      }

      setTimeout(() => {
        setRolling(false)
        onRollComplete(result)
      }, 700)

    }, 1500)
  }

  return (
    <Stack align="center" className="dice-roller-wrapper">
      <Text size="xl" fw={700} c="dimmed" mb="md">{label}</Text>
      
      <div className="dice-container">
        <div className="dice" ref={diceRef}>
          <div className="dice-face dice-front">1</div>
          <div className="dice-face dice-back">2</div>
          <div className="dice-face dice-right">3</div>
          <div className="dice-face dice-left">4</div>
          <div className="dice-face dice-top">6</div>
          <div className="dice-face dice-bottom">5</div>
        </div>
      </div>
      
      <button 
        className={`dice-roll-button ${rolling || disabled ? 'rolling' : ''}`}
        onClick={rollDice}
        disabled={rolling || disabled}
      >
        <span className="dice-btn-back"></span>
        <span className="dice-btn-front">Roll</span>
      </button>
    </Stack>
  )
}
