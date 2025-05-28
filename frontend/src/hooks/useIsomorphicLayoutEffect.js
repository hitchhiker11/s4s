import { useLayoutEffect, useEffect } from 'react';

// Использует useEffect на сервере и useLayoutEffect на клиенте
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect; 