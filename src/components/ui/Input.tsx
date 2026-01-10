import { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
}

export const Input = ({ icon, className, ...props }: InputProps) => {
  return (
    <div className="relative w-full">
      <input
        {...props}
        className={cn(
          "w-full px-4 py-3 pr-12 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg",
          "bg-white dark:bg-neutral-900 text-foreground dark:text-gray-300",
          "placeholder:text-muted dark:placeholder:text-neutral-500",
          "focus:outline-none focus:ring-2 focus:ring-foreground dark:focus:ring-white focus:border-transparent",
          "transition-all",
          className
        )}
      />
      {icon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted dark:text-neutral-400">
          {icon}
        </div>
      )}
    </div>
  )
}
