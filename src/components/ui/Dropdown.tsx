'use client'

interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: string[] | { value: string | number, label: string }[]
  placeholder?: string
  className?: string
  label?: string
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  className = "",
  label
}: DropdownProps) {
  
  const isComplexOptions = options.length > 0 && typeof options[0] === 'object'
  
  const getDisplayValue = () => {
    if (isComplexOptions) {
      const option = (options as { value: string | number, label: string }[])
        .find(opt => String(opt.value) === String(value))
      return option ? option.label : value
    }
    return value
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-[#F5F7FA]/70 mb-2">
          {label}
        </label>
      )}
      
      <select
        value={value}
        onChange={handleChange}
        className={`w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] text-sm appearance-none cursor-pointer ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgb(245 247 250 / 0.5)'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1rem'
        }}
      >
        <option value="" disabled className="text-[#F5F7FA]/50">
          {placeholder}
        </option>
        {isComplexOptions ? (
          (options as { value: string | number, label: string }[]).map((option, index) => (
            <option key={index} value={option.value} className="text-[#F5F7FA] bg-[#1A1D2E]">
              {option.label}
            </option>
          ))
        ) : (
          (options as string[]).map((option, index) => (
            <option key={index} value={option} className="text-[#F5F7FA] bg-[#1A1D2E]">
              {option}
            </option>
          ))
        )}
      </select>
    </div>
  )
}