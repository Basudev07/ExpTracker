/**
 * Decodes a JWT token and checks if it has expired.
 * @param {string} token - The JWT token to inspect.
 * @returns {boolean} True if the token is expired or invalid, false otherwise.
 */
export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode the payload base64 string
    // atob is globally supported in modern browsers
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false; // Treat as valid if no exp claim is present

    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // Treat as expired/invalid on any decoding error
  }
}
