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

export function getScoreFromOpenAIMessage(openAIMessage: string) {
  const score = openAIMessage.split(': ')[1];
  const scoreNum = score.split('/')[0];
  return parseInt(scoreNum);
}
