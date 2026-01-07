export function getUrlLastPath(string: string) {
  if (!string) return ''
  const url = new URL(string)
  return url.pathname.split('/').pop()
}
