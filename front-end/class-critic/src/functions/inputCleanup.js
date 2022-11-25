// Returns a string with invalid characters removed
function inputCleanUp(input) {
  input = input.replace(/[*]/g, "");
  input = input.replace(/[^a-zA-Z0-9 -.]/g, "");
  return input;
}

// Check for invalid characters in input
function inputCheckOk(input) {
  console.log(">", input);

  let cleanEntry = input.replace(/[^a-zA-Z0-9 -.]/g, "");
  cleanEntry = input.replace(/[*]/g, "");

  console.log("-->", cleanEntry);
  if (cleanEntry === input) {
    return true;
  }
  return false;
}

function swearCheckOk(input) {
  const naughtyWordsBase = ["fuck", "cunt", "shit", "asshole"];
  const joinWords = [
    "face",
    "head",
    "wit",
    "lick",
    "licker",
    "munch",
    "muncher",
    "er",
  ];
  const singeWords = ["dickhead", "dickmunch", "dickwit"];

  let naughtyWords = [];
  naughtyWordsBase.forEach((word) => {
    for (let i = 0; i < joinWords.length; i++) {
      naughtyWords.push(word + joinWords[i]);
    }
  });
  naughtyWords = naughtyWords.concat(singeWords).concat(naughtyWordsBase);

  input = String(input.toLowerCase());

  return !naughtyWords.includes(input);
}

export { inputCleanUp, inputCheckOk, swearCheckOk };
