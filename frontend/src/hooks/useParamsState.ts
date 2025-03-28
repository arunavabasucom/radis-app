import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function useParamState<T extends string | number | boolean | object>(
  key: string,
  defaultValue: T
): [T,  (update: (prevState: T) => T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramValue = searchParams.get(key);

  const [state, setState] = useState<T>(() => {
    if (paramValue === null) {
      return defaultValue;
    }
    try {
      return JSON.parse(paramValue) as T;
    } catch {
      return paramValue as T;
    }
  });

  const setParamState = useCallback(
    (update: (prevState: T) => T) => {
      setState((prevState) => {
        const updatedValue = update(prevState);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(key, JSON.stringify(updatedValue));
        setSearchParams(newSearchParams);

        return updatedValue;
      });
    },
    [key, searchParams, setSearchParams]
  );
  return [state, setParamState];
}

export default useParamState;