const dictionaryUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/"
const missingWords = ["BE", "FOR", "IS", "WAS"]

export function validateWord(word, player) {
  word = word.toUpperCase()

  // Check whether player has already used word
  if (player.wordsUsed.includes(word)) {
    return Promise.reject("Already used")
  }

  // Check whether word can be formed from player's letters
  const wordLetters = word.split("")
  const playerLetters = player.boxes.map((box) => box.state.letter)
  for (let wordLetter of wordLetters) {
    const letterIndex = playerLetters.indexOf(wordLetter)
    if (letterIndex == -1) {
      return Promise.reject("Incorrect letters")
    }
    playerLetters.splice(letterIndex, 1)
  }

  // Check whether word is valid English
  let url = dictionaryUrl + word
  return new Promise((resolve, reject) => {
    fetch(url).then(
      response => {
        response.json().then(function() {
          if (missingWords.includes(word) || response.status == 200) {
            resolve()
          } else {
            reject("Invalid word")
          }
        })
      }
    )
  })
    
}