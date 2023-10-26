<h1 align="center">Gladiatus Clone API</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/BautistaTosolini/gladiatus-clone-api?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/BautistaTosolini/gladiatus-clone-api?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/BautistaTosolini/gladiatus-clone-api?color=56BEB8">
</p>

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="https://github.com/BautistaTosolini" target="_blank">Author</a>
</p>

<br>

## :dart: About ##

<a href="https://lobby.gladiatus.gameforge.com" target="_blank">Gladiatus</a> is a web browser-based MMORPG (Massively Multiplayer Online Role-Playing Game) developed by <a href="https://gameforge.com" target="_blank">Gameforge</a> and released in 2009. In the game, players create and customize their own gladiator characters. They embark on adventures, fight against various enemies and creatures, acquire new skills, and progress through different levels. This project aims to clone a significant portion of the original game's functionality in newer stack for learning purposes.

## :sparkles: Features ##

:heavy_check_mark: Character creation\
:heavy_check_mark: Fight against creatures and other players\
:heavy_check_mark: Inventory and equipment system\
:heavy_check_mark: Arena Player vs Player with leaderboards

## :rocket: Technologies ##

The following tools were used in this project:

- [Node.js](https://nodejs.org/en/)
- [Nest.js](https://nestjs.com)
- [MongoDB](www.mongodb.com/en)
- [TypeScript](https://www.typescriptlang.org/)

## :white_check_mark: Requirements ##

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed.

## :checkered_flag: Starting ##

```bash
# Clone this project
$ git clone https://github.com/BautistaTosolini/gladiatus-clone-api

# Access
$ cd gladiatus-clone-api

# Install dependencies
$ npm install

# Set up the enviroment variables
# Your connection url for mongoDB
MONGODB_URL=

# The secret used to encrypt the JWT tokens
JWT_SECRET=

# The password string that the modules will use to access endpoints only accessible by the API itself
MODULES_PASSWORD=

# Enviroment can be development or production
NODE_ENV=

# Once the variables are set up, run the project
npm run start:dev

# The server will initialize in the <http://localhost:4000>
```

<p align="center">Made with :heart: by <a href="https://github.com/BautistaTosolini" target="_blank">BautistaTosolini</a></p>

&#xa0;

<a href="#top">Back to top</a>

*Readme created with [Simple Readme](https://marketplace.visualstudio.com/items?itemName=maurodesouza.vscode-simple-readme)*
