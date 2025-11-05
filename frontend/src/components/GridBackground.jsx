import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const GridBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Modern healthcare UI: Subtle grid of dots
    const gridSize = 60
    const dots = []
    const dotRadius = 1.5

    // Create subtle grid dots
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        dots.push({ 
          x, 
          y, 
          originalX: x, 
          originalY: y,
          opacity: 0.08 + Math.random() * 0.05 // Very subtle opacity
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw subtle grid dots
      dots.forEach(dot => {
        ctx.fillStyle = `rgba(95, 111, 255, ${dot.opacity})` // Light blue/purple
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  )
}

export default GridBackground
