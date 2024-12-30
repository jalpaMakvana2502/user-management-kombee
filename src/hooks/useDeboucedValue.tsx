import { useEffect, useState } from "react";

interface UseDebouncedValueProps<T> {
  value: T;
  timer?: number;
}

export default function useDebouncedValue<T>({
  value,
  timer = 300,
}: UseDebouncedValueProps<T>): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, timer);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, timer]);

  return debouncedValue;
}
