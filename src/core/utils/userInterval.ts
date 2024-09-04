import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, interval: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!interval && interval !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), interval);

    return () => clearInterval(id);
  }, [interval]);
};
