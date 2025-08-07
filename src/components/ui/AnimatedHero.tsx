'use client'

import { useEffect, useState } from 'react'

export default function AnimatedHero() {
  const [currentFrame, setCurrentFrame] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 3)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const agentNodes = [
    { id: 'visitor', x: 20, y: 50, label: 'Website Visitor', active: currentFrame >= 0 },
    { id: 'agent', x: 50, y: 30, label: 'AI Agent', active: currentFrame >= 1 },
    { id: 'lead', x: 80, y: 50, label: 'Qualified Lead', active: currentFrame >= 2 },
  ]

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-violet-900/20 to-blue-900/20 rounded-3xl overflow-hidden backdrop-blur-sm border border-white/10">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#grid)" />
          
          {/* Connection Lines */}
          <g className="transition-all duration-1000 ease-in-out">
            {currentFrame >= 1 && (
              <line 
                x1="80" y1="100" 
                x2="200" y2="60" 
                stroke="url(#gradient1)" 
                strokeWidth="2"
                className="animate-pulse"
              />
            )}
            {currentFrame >= 2 && (
              <line 
                x1="200" y1="60" 
                x2="320" y2="100" 
                stroke="url(#gradient2)" 
                strokeWidth="2"
                className="animate-pulse"
              />
            )}
          </g>
          
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#00E7C2" />
            </linearGradient>
          </defs>
          
          {/* Agent Nodes */}
          {agentNodes.map((node, index) => (
            <g 
              key={node.id} 
              transform={`translate(${node.x * 4}, ${node.y * 2})`}
              className={`transition-all duration-500 ${node.active ? 'opacity-100 scale-100' : 'opacity-30 scale-75'}`}
            >
              <circle
                cx="0"
                cy="0"
                r="25"
                fill={index === 1 ? "url(#gradient1)" : "rgba(255,255,255,0.1)"}
                stroke={index === 1 ? "#8B5CF6" : "#ffffff"}
                strokeWidth="2"
                className={node.active ? "animate-pulse" : ""}
              />
              
              {/* Icons */}
              {index === 0 && (
                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="16">👤</text>
              )}
              {index === 1 && (
                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="16">🤖</text>
              )}
              {index === 2 && (
                <text x="0" y="5" textAnchor="middle" fill="white" fontSize="16">✅</text>
              )}
              
              {/* Labels */}
              <text 
                x="0" 
                y="45" 
                textAnchor="middle" 
                fill="rgba(255,255,255,0.8)" 
                fontSize="12" 
                className="font-semibold"
              >
                {node.label}
              </text>
            </g>
          ))}
          
          {/* Data Flow Animation */}
          {currentFrame >= 1 && (
            <g className="animate-pulse">
              <circle r="3" fill="#00E7C2">
                <animateMotion dur="3s" repeatCount="indefinite">
                  <path d="M80,100 Q140,50 200,60 T320,100" />
                </animateMotion>
              </circle>
            </g>
          )}
        </svg>
      </div>
      
      {/* Status Text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-sm text-white/70 font-medium">
          {currentFrame === 0 && "Visitor arrives on your website..."}
          {currentFrame === 1 && "AI Agent engages with personalized questions..."}
          {currentFrame === 2 && "Qualified lead captured and scored!"}
        </div>
      </div>
    </div>
  )
}