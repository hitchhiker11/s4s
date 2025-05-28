/**
 * Хук, который безопасно обрабатывает useLayoutEffect на сервере и клиенте
 * 
 * useLayoutEffect вызывает предупреждения при серверном рендеринге, потому что 
 * его эффекты не могут быть выполнены на сервере. Этот хук решает эту проблему,
 * используя useEffect при серверном рендеринге и useLayoutEffect на клиенте.
 */

import { useLayoutEffect, useEffect } from 'react';

// Определяем, находимся ли мы в браузере
const isBrowser = typeof window !== 'undefined';

// Используем useLayoutEffect на клиенте и useEffect на сервере
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect; 