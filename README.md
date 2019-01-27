## StreamWarming

Are you a new streamer who barely got 5 viewers after streaming 18 hours of Solitaire? Have you ever wonder how that one time your perfect Mine Sweep got unnoticed and the only thing watching you is that one bot you have been meaning to kick? You might think it was all your fault, but you can't be more wrong. Your shiny new channel is being haunted by these "demons" lurking in your stream, and they enjoy sabotaging you and keeping your viewer away. 

If you are looking for a solution, look no further than StreamWarming - a twitch extension game that let you and everyone see those demons. Call your family, your friends, and those 10 followers you've got. It's time to give your stream some good old stream warming party! The demon dread nothing more than friendly, lengthy engagement. So do your thing while your viewer squashing these ghosts. It's a great way to gain engagement and warm up your stream!

How to play: Join my twitch channel: https://www.twitch.tv/louisgv when I am online, and you will be able to join the game by simply sending chat message!

Play-throughs: TBA

## Diversifiers

+ Power of Community - (Sponsored by Mixer) - Make a game where community impacts your game. Players, viewers or streamers can enhance the game, change the outcome, or be a unifying force.

+ Always Room for One More (Sponsored by Origin Access): Make a game where new players can join at any time.

+ Use the Source, Luke - (Sponsored by GitHub) - Use one or more open source tools, game engines or libraries in your game (and thank them in in the Technology Notes section on the submission page).

+ Thomas Wasn't Alone - Use only simple shapes (cubes, triangles, circles, etc.) to represent every single element (characters, HUD, etc.) inside the game.

## Thank you OpenSource!
+ This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
+ react and CRA
+ TypeScript
+ https://electronjs.org/
+ twitch.js
+ react-shapes https://github.com/rsamec/react-shapes
+ yarn
+ nodejs
+ vscode
+ craco
+ https://github.com/wwlib/cra-craco-electron-example
+ https://www.npmjs.com/package/react-rewards
+ react-epic-spinners : https://github.com/bondz/react-epic-spinners

## Run Instruction

To run locally with dev, prepare a `secret.json` and `data.json` following the template below:

`secret.json:`, this contains all Twitch related credentials.
```
{
    "clientUsername": "",
    "clientId":"",
    "clientSecret":"",
    "clientAccessToken":"",
    "clientRefreshToken": ""
}
```

`data.json`
```
{
	"init": false
}
```

Then to run the electron build for the front-end then electron itself in 2 separate terminal:

```
yarn watch:electron
```

```
yarn start:electron-dev
```
