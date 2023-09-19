<h1 align="center">Gladiatus Clone API</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/{{YOUR_GITHUB_USERNAME}}/gladiatus-clone-api?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/{{YOUR_GITHUB_USERNAME}}/gladiatus-clone-api?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/{{YOUR_GITHUB_USERNAME}}/gladiatus-clone-api?color=56BEB8">
</p>

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/{{YOUR_GITHUB_USERNAME}}" target="_blank">Author</a>
</p>

<br>

## :dart: About ##

"Gladiatus" is a web browser-based MMORPG (Massively Multiplayer Online Role-Playing Game) developed by Gameforge and released in 2009. In the game, players create and customize their own gladiator characters. They embark on adventures, fight against various enemies and creatures, acquire new skills, and progress through different levels. This project aims to clone a significant portion of the original game's functionality in newer stack for learning purposes.

## :sparkles: Features ##

:heavy_check_mark: Character creation;\
:heavy_check_mark: Fight against creatures and enemies;\

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
$ git clone https://github.com/BautistaTosolini/gladiatus-clone

# Access
$ cd gladiatus-clone

# Install dependencies
$ npm install

# Set up the enviroment variables
# Your connection url for mongoDB
MONGODB_URL=

# The secret used to encrypt the JWT tokens
JWT_SECRET=

# Enviroment can be development or production
NODE_ENV=

# Once the variables are set up, run the project
npm run start:dev

# The server will initialize in the <http://localhost:4000>
```

## :memo: Endpoints ##

### User endpoints
- [Create User](#create-user)
- [Login](#login)
- [Get User](#get-user)
- [Get User By Id](#get-user-by-id)

### Character endpoints
- [Onboard Character](#onboard-character)
- [Get Character By Id](#get-character-by-id)
- [Get Enemies](#get-enemies)
- [Battle](#battle)
- [Get Battle Report](#get-battle-report)

## User endpoints

### Create User

- **Route**: `/api/users`
- **Protected**: false
- **HTTP Method**: POST
- **Description**: Create an user and a character template reference.
- **Payload**: 
  - `name` - Unique name for the user, not the character.
  - `email` - Unique email for the user.
  - `password` - Password that will be later hashed.
- **Example**:
```
POST /api/users
Content-Type: application/json

{
  "name": "example user",
  "email": "user@example.com",
  "password": "secure_password",
}
```
- **Reponse**:
```
{
  "name": "example user",
  "email": "user@example.com",
  "_id": "650a206cb1fe35ade0234989",
  "createdAt": "2023-09-19T22:27:56.871Z",
  "updatedAt": "2023-09-19T22:27:56.871Z",
  "character": "650a206db1fe35ade023498b"
}
```

### Login

- **Route**: `/api/users/session`
- **Protected**: false
- **HTTP Method**: POST
- **Description**: Authenticate users and receives a JWT Token which will be stored in cookies.
- **Payload**: 
  - `email` - Email registered in the user.
  - `password` - Password that will be compared with the hashed one.
- **Example**:
```
POST /api/users/session
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
}
```
- **Reponse**:
```
{
  "name": "example user",
  "email": "user@example.com",
  "_id": "650a206cb1fe35ade0234989",
}
```

### Get User

- **Route**: `/api/users`
- **Protected**: true
- **HTTP Method**: GET
- **Description**: Get the current user by his current JWT Token and populates the character.
- **Optional Headers**: 
  - `journal` - Boolean, populates the journal field stored in character if true.
  - `battle` - Boolean, populates the battleReport field stored in character if true.
- **Example**:
```
GET /api/users
Content-Type: application/json
```
- **Reponse**:
```
{
  "_id": "650a206cb1fe35ade0234989",
  "name": "example user",
  "email": "user@example.com",
  "createdAt": "2023-09-19T22:27:56.871Z",
  "character": {
    "_id": "650a206db1fe35ade023498b",
    "name": "example character",
    "gender": "male",
    "owner": "650a206cb1fe35ade0234989",
    "crowns": 0,
    "level": 1,
    "experience": 0,
    "strength": 5,
    "dexterity": 5,
    "endurance": 5,
    "agility": 5,
    "intelligence": 5,
    "charisma": 5,
    "onboarded": true,
    "createdAt": "2023-09-19T22:27:57.007Z",
    "journal": "650a206db1fe35ade023498d",
  }
}
```

### Get User By Id

- **Route**: `/api/users/:id`
- **Protected**: true
- **HTTP Method**: GET
- **Description**: Get an user by his id and populates the character.
- **Params**: 
  - `id` - Unique user id.
- **Example**:
```
GET /api/users/650a206cb1fe35ade0234989
Content-Type: application/json
```
- **Reponse**:
```
{
  "_id": "650a206cb1fe35ade0234989",
  "name": "example user",
  "email": "user@example.com",
  "createdAt": "2023-09-19T22:27:56.871Z",
  "character": {
    "_id": "650a206db1fe35ade023498b",
    "name": "example character",
    "gender": "male",
    "owner": "650a206cb1fe35ade0234989",
    "crowns": 0,
    "level": 1,
    "experience": 0,
    "strength": 5,
    "dexterity": 5,
    "endurance": 5,
    "agility": 5,
    "intelligence": 5,
    "charisma": 5,
    "onboarded": true,
    "createdAt": "2023-09-19T22:27:57.007Z",
    "journal": "650a206db1fe35ade023498d",
  }
}
```

## Character endpoints

### Onboard Character

- **Route**: `/api/characters`
- **Protected**: true
- **HTTP Method**: PUT
- **Description**: Creates the character and assigns a name and a gender.
- **Payload**: 
  - `name` - Name for the character.
  - `gender` - Can be male or female.
- **Example**:
```
PUT /api/characters
Content-Type: application/json

{
  "name": "example character",
  "gender": "male ",
}
```
- **Reponse**:
```
{
  "_id": "650a206db1fe35ade023498b",
  "owner": "650a206cb1fe35ade0234989",
  "crowns": 0,
  "level": 1,
  "experience": 0,
  "strength": 5,
  "dexterity": 5,
  "endurance": 5,
  "agility": 5,
  "intelligence": 5,
  "charisma": 5,
  "onboarded": true,
  "createdAt": "2023-09-19T22:27:57.007Z",
  "journal": "650a206db1fe35ade023498d"
}
```

### Get Character By Id

- **Route**: `/api/characters/:id`
- **Protected**: true
- **HTTP Method**: GET
- **Description**: Get character information by his id.
- **Params**: 
  - `id` - Unique character id.
- **Example**:
```
GET /api/characters/650a206db1fe35ade023498b
Content-Type: application/json
```
- **Reponse**:
```
{
  "_id": "650a206db1fe35ade023498b",
  "owner": "650a206cb1fe35ade0234989",
  "crowns": 0,
  "level": 1,
  "experience": 0,
  "strength": 5,
  "dexterity": 5,
  "endurance": 5,
  "agility": 5,
  "intelligence": 5,
  "charisma": 5,
  "onboarded": true,
  "createdAt": "2023-09-19T22:27:57.007Z",
  "journal": "650a206db1fe35ade023498d",
  "gender": "male",
  "name": "example character"
}
```

### Get Enemies

- **Route**: `/api/characters/enemy?zone=zone`
- **Protected**: true
- **HTTP Method**: GET
- **Description**: Get the information about enemies from certain zones, returns an array of the 4 enemies from the specific zone.
- **Query**: 
  - `zone` - Name of the zone.
- **Example**:
```
GET /api/characters/enemy?zone=grimwood
Content-Type: application/json
```
- **Reponse**:
```
[
  {
    "name": "Rat",
    "image": "rat",
    "id": 0,
    "level": [
        1,
        2
    ]
  },
  {
    "name": "Lynx",
    "image": "lynx",
    "id": 1,
    "level": [
        2,
        3,
        4,
        5
    ]
  },
  {
    "name": "Wolf",
    "image": "wolf",
    "id": 2,
    "level": [
        4,
        5,
        6,
        7,
        8
    ]
  },
  {
    "name": "Bear",
    "image": "bear",
    "id": 4,
    "level": [
        8,
        9,
        10
    ]
  }
]
```

### Battle

- **Route**: `/api/characters/battle?zone=zone&enemy=enemy`
- **Protected**: true
- **HTTP Method**: POST
- **Description**: Fight an enemy and get the result of the battle which includes drops and statistics and array of rounds which details the fight events.
- **Query**: 
  - `zone` - Name of the zone.
  - `enemy` - Name of the enemy to fight.
- **Example**:
```
POST /api/characters/battle?zone=grimwood&enemy=rat
Content-Type: application/json
```
- **Reponse**:
```
{
  "zone": "grimwood",
  "fighter": "650a206db1fe35ade023498b",
  "_id": "650a31dbb1fe35ade02349a3",
  "createdAt": "2023-09-19T23:42:19.193Z",
  "result": {
    "winner": "Rat",
    "xpDrop": 0,
    "crownsDrop": 0,
    "attackerFinalHealth": 0,
    "defenderFinalHealth": 17,
    "attackerTotalDamage": 27,
    "defenderTotalDamage": 25,
    "attackerHealth": 25,
    "defenderHealth": 44
  },
  "rounds": [
    {
      "roundNumber": 1,
      "attackerHP": 25,
      "defenderHP": 44,
      "events": [
        "Looker845 misses their attack.",
        "Rat misses their attack."
      ]
    },
    {
      "roundNumber": 2,
      "attackerHP": 25,
      "defenderHP": 44,
      "events": [
        "Looker845 misses their attack.",
        "Rat misses their attack."
      ]
    },
    {
      "roundNumber": 3,
      "attackerHP": 25,
      "defenderHP": 44,
      "events": [
        "Looker845 misses their attack.",
        "Rat hits Looker845 for 1 points."
      ]
    },
  ]
}
```

### Battle

- **Route**: `/api/characters/battle/:id`
- **Protected**: true
- **HTTP Method**: GET
- **Description**: Get the result and rounds of a battle.
- **Params**: 
  - `id` - Unique id of the battle report.
- **Example**:
```
GET /api/characters/battle/650a31dbb1fe35ade02349a3
Content-Type: application/json
```
- **Reponse**:
```
{
  "zone": "grimwood",
  "fighter": "650a206db1fe35ade023498b",
  "_id": "650a31dbb1fe35ade02349a3",
  "createdAt": "2023-09-19T23:42:19.193Z",
  "result": {
    "winner": "Rat",
    "xpDrop": 0,
    "crownsDrop": 0,
    "attackerFinalHealth": 0,
    "defenderFinalHealth": 17,
    "attackerTotalDamage": 27,
    "defenderTotalDamage": 25,
    "attackerHealth": 25,
    "defenderHealth": 44
  },
  "rounds": [
    {
      "roundNumber": 1,
      "attackerHP": 25,
      "defenderHP": 44,
      "events": [
        "Looker845 misses their attack.",
        "Rat misses their attack."
      ]
    },
    {
      "roundNumber": 2,
      "attackerHP": 25,
      "defenderHP": 44,
      "events": [
        "Looker845 misses their attack.",
        "Rat misses their attack."
      ]
    },
    {
      "roundNumber": 3,
      "attackerHP": 25,
      "defenderHP": 44,
      "events": [
        "Looker845 misses their attack.",
        "Rat hits Looker845 for 1 points."
      ]
    },
  ]
}
```

Made with :heart: by <a href="https://github.com/BautistaTosolini" target="_blank">BautistaTosolini</a>

&#xa0;

<a href="#top">Back to top</a>

*Readme created with [Simple Readme](https://marketplace.visualstudio.com/items?itemName=maurodesouza.vscode-simple-readme)*
