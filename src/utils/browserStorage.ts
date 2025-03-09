/**
 * Safely access localStorage with SSR support
 * @returns The localStorage object or a mock implementation for SSR
 */
export function safeLocalStorage() {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  
  // Return a mock localStorage object for SSR
  return {
    getItem: () => null,
    setItem: () => null,
    removeItem: () => null,
    clear: () => null,
    key: () => null,
    length: 0
  };
}

/**
 * Safely get an item from localStorage
 * @param key The key to retrieve
 * @returns The value or null
 */
export function getLocalStorageItem(key: string): string | null {
  return safeLocalStorage().getItem(key);
}

/**
 * Safely set an item in localStorage
 * @param key The key to set
 * @param value The value to store
 */
export function setLocalStorageItem(key: string, value: string): void {
  safeLocalStorage().setItem(key, value);
}

/**
 * Safely remove an item from localStorage
 * @param key The key to remove
 */
export function removeLocalStorageItem(key: string): void {
  safeLocalStorage().removeItem(key);
}

/**
 * Check if code is running in browser
 * @returns boolean indicating if code is running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Safely access window.location
 * @returns window.location object or a mock implementation for SSR
 */
export function safeWindowLocation() {
  if (isBrowser()) {
    return window.location;
  }
  
  // Return a mock location object for SSR
  return {
    pathname: '/',
    href: '/',
    search: '',
    hash: '',
    host: '',
    hostname: '',
    port: '',
    protocol: '',
    assign: () => {},
    replace: () => {},
    reload: () => {},
    toString: () => '/'
  };
}

/**
 * Get current pathname safely (works in SSR)
 * @returns Current pathname
 */
export function getCurrentPathname(): string {
  return safeWindowLocation().pathname;
}

/**
 * Redirect to a URL safely (works in SSR)
 * @param url URL to redirect to
 */
export function redirect(url: string): void {
  if (isBrowser()) {
    window.location.href = url;
  }
}