# Battleship

## Overview

My take on the classic strategy guessing game. Enter player name, position your ships, and battle the computer to see who will rule the high seas. First player to sink all of the opponent's ships wins!

[Live Demo](https://dukdukg00se.github.io/battleship/)

<img src="./src/assets/images/game-screenshot.png" width="65%">

## Learning Objectives

- Practice writing unit tests
- Working with Jest test runner
- Introduction to Test Driven Development

## Notes

Initially started this project with the test-first approach in mind. However, as I started to build out the application I eventually found it difficult to maintain this approach. I believe, additional planning ahead of time will help.

Nevertheless, the different tests did aid during refactoring and contributed to better understanding and better code.

** Another thing to note - I had an issue where the header image src was getting broken after hosting on github pages. I've had this issue before. Apparently it's something to do with asset loading. I was able to resolve this after reading jantimon's comment from Aug 31, 2021. [htmlwebpackplugin issues](https://github.com/jantimon/html-webpack-plugin/issues/1557) **

## Future Improvements

- Add ship images and sounds. Several ship images and sound assets are saved but not currently used. In the future, add sound effects and use ship images for placement
- Add further effects such as animations for a missed/hit shot
- Add a two player mode
- Improve AI play. At present, computer isn't able to compare ship length to number of empty squares. This gives the player an advantage. For example, this leads to situations where it will fire on a square without any adjacent open spots, making a ship there impossible.
- Code can always be improved

## Helpful Links

- [Battleship wiki](<https://en.wikipedia.org/wiki/Battleship_(game)>)

## Credits

- Design inspired by and assets from [fortypercenttitaium](https://github.com/fortypercenttitanium). All logic and code is original.
