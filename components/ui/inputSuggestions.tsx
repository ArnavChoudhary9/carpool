import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputSuggestedProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suggestions?: string[];
}

const InputSuggested = React.forwardRef<HTMLInputElement, InputSuggestedProps>(
  ({ className, type, suggestions = [], value, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Allow ref forwarding
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Sync internal value if controlled
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(""); // Not used in controlled mode
      }
    }, [value]);

    const handleFocus = () => {
      setIsFocused(true);
      if (suggestions.length > 0) setShowSuggestions(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setTimeout(() => setShowSuggestions(false), 100);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value !== undefined) {
        // Controlled mode
        if (onChange) onChange(e);
      } else {
        // Uncontrolled mode
        setInternalValue(e.target.value);
        if (onChange) onChange(e);
      }
      if (suggestions.length > 0) setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion: string) => {
      if (value !== undefined) {
        // Controlled mode
        if (onChange) {
          const event = {
            ...({} as React.ChangeEvent<HTMLInputElement>),
            target: { value: suggestion },
          };
          onChange(event as any);
        }
      } else {
        // Uncontrolled mode
        setInternalValue(suggestion);
        if (onChange) {
          const event = {
            ...({} as React.ChangeEvent<HTMLInputElement>),
            target: { value: suggestion },
          };
          onChange(event as any);
        }
      }
      setShowSuggestions(false);
      inputRef.current?.blur();
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={inputRef}
          value={value !== undefined ? value : internalValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-background border border-input rounded-md shadow-lg max-h-48 overflow-auto">
            {suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="px-3 py-2 cursor-pointer hover:bg-muted-foreground/10"
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
InputSuggested.displayName = "InputSuggested";

export { InputSuggested };
