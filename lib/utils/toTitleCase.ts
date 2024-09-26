const titleCaseExceptions = /^(a|an|and|as|at|but|by|for|if|in|is|nor|of|on|or|the|to|with)$/i;

const toTitleCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map((word, index) => {
      if (word === word.toUpperCase()) return word;
      if (index === 0 || !titleCaseExceptions.test(word)) {
        return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
      }
      return word.toLowerCase();
    })
    .join(' ');
};

export default toTitleCase;
