export function createId(inputString: string): string {
  let hash = 0,
      i,
      chr;
  if (inputString.length === 0) return hash.toString().replace('-', '0');
  for (i = 0; i < inputString.length; i++) {
    chr = inputString.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash.toString().replace('-', '0');
}
