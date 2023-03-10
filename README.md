# BATTLESCRIPT
<br>

![battlescript](https://i.imgur.com/ps6A64S.png)

Battlescript is a remake of the classic game, Battleship, made mostly in JavaScript. In this version, the player plays against a CPU and can choose to either manually place down their ships or use a randomly generated layout. <br>

The game keeps track of the number of "ship tiles" remaining on both side. Ship comprise of the following:<br><br>

| Ship | Size |
|------|------|
|Carrier|5|
|Battleship|4|
|Cruiser | 3|
|Submarine|3|
|Destroyer|2|
<br>
## Getting Started
[Play Battlescript now!](https://dszwarc.github.io/Battlescript/)


Upon starting the games, the player will place their ships one at a time. At any time during the setup phase, the board can be reset by clicking the reset button. Once the player is happy with their setup, they will hit Start Game and begin! Player always shoots first. Misses are denoted by mist as your artillery hits the water and hits are shown as explosions when you hit the enemy ships! The game ends when the player or CPU has no more remaining ship tiles.


## Technical Issues

This game was made with JavaScript, CSS and HTML. There were a lot of hurdles I had to overcome when coding it, but these features were some of the hardest:

- Not highlighting your grid when the mouse is over an invalid location
- Not having ships overlap during random grid placement
- being able to rotate ships during setup and be able to render the change for the player

## Next Steps

There are several features that were intended to be in the game but were not fully complete. In future updates you can expect to see: 

- [ ] Multiple difficulties for CPU
- [ ] More intelligent AI (choosing cells near previous hits)
- [ ] Multiplayer