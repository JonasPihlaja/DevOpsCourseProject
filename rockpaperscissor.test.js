const rockPaperScissors = require('./rockpaperscissor');

test('Plays rock paper scissors with the computer', () => {
    expect(rockPaperScissors('rock')).toBe(true)
});
test('Plays rock paper scissors with the computer', () => {
    expect(rockPaperScissors('paper')).toBe(true)
});
test('Plays rock paper scissors with the computer', () => {
    expect(rockPaperScissors('scissors')).toBe(true)
});