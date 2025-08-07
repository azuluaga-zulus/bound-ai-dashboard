'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MultiSelectProps {
  value: string[]
  onChange: (values: string[]) => void
  options: string[] | { [key: string]: string[] }
  placeholder?: string
  className?: string
  label?: string
  maxHeight?: string
}

export default function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select options...",
  className = "",
  label,
  maxHeight = "max-h-60"
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle grouped vs flat options
  const isGrouped = !Array.isArray(options)
  const flatOptions = isGrouped 
    ? Object.values(options as { [key: string]: string[] }).flat()
    : options as string[]

  // Filter options based on search
  const filteredOptions = searchTerm 
    ? flatOptions.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : flatOptions

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option]
    onChange(newValue)
  }

  const handleRemoveItem = (item: string) => {
    onChange(value.filter(v => v !== item))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchTerm('')
    }
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-[#F5F7FA]/70 mb-2">
          {label}
        </label>
      )}

      {/* Selected Items Display */}
      <div className="mb-2">
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#6D4CFF]/20 text-[#F5F7FA]/90 text-xs rounded-md border border-[#6D4CFF]/30"
              >
                {item}
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="hover:text-red-400 transition-colors"
                  type="button"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length > 0 ? "Add more..." : placeholder}
          className={`w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] text-sm pr-8 ${className}`}
        />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <svg 
            className={`w-4 h-4 text-[#F5F7FA]/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 w-full mt-1 bg-[#1A1D2E] border border-white/20 rounded-lg shadow-lg ${maxHeight} overflow-y-auto`}
          >
            {isGrouped && !searchTerm ? (
              // Grouped display
              Object.entries(options as { [key: string]: string[] }).map(([group, groupOptions]) => (
                <div key={group}>
                  <div className="px-3 py-2 text-xs font-semibold text-[#6D4CFF] bg-white/5 sticky top-0">
                    {group}
                  </div>
                  {groupOptions.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center px-3 py-2 text-sm text-[#F5F7FA] hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={value.includes(option)}
                        onChange={() => handleToggleOption(option)}
                        className="mr-2 w-4 h-4 text-[#6D4CFF] bg-white/5 border-white/20 rounded focus:ring-[#6D4CFF] focus:ring-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))
            ) : (
              // Flat display (when searching or flat options)
              filteredOptions.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center px-3 py-2 text-sm text-[#F5F7FA] hover:bg-white/10 transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option)}
                    onChange={() => handleToggleOption(option)}
                    className="mr-2 w-4 h-4 text-[#6D4CFF] bg-white/5 border-white/20 rounded focus:ring-[#6D4CFF] focus:ring-2"
                  />
                  {option}
                </label>
              ))
            )}
            
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-[#F5F7FA]/50 italic">
                No options found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}