import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  value: string
  options: SelectOption[]
  onValueChange: (value: string) => void
  ariaLabel: string
}

export function FormSelect({ value, options, onValueChange, ariaLabel }: FormSelectProps) {
  return (
    <Select items={options} value={value} onValueChange={(nextValue) => { if (nextValue) onValueChange(nextValue) }}>
      <SelectTrigger className="h-11 w-full" aria-label={ariaLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
