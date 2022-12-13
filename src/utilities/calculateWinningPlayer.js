export function calculateWinningPlayer(winningScore, playerCollection) {
  if (playerCollection == null) return null
  const players = playerCollection.getPlayers()
  const maxTurnsTaken = Math.max(...players.map(x => x.turnsTaken))
  const potentialScores = players.map((player) => player.score + (player.turnsTaken < maxTurnsTaken ? player.boxData.length + 1 : 0))
  for (let i = 0; i < players.length; i++) {
    let player = players[i]
    if (player.score >= winningScore) {
      let potentialScoresCopy = [...potentialScores]
      potentialScoresCopy.splice(i, 1) // Remove iterated player from array copy so only comparing against other players
      let scoreToBeat = Math.max(...potentialScoresCopy)
      if (player.score > scoreToBeat) {
        return player
      }
    }
  }
  return null
}