SourceUndead
============

Multi-player [in progress] zombie game built with MySQL, Express, and NodeJS (The MEN stack).

I left out my settings.js file because it has private credentials in it. But here is the schema I used (a simple JS Object) to have my settings all in one file:

    "use strict";
    export default {
        user : "dat username",
        database : "not my database",
        password : "asswordp"
    }

Setting up your own server is easy! The following steps should help you create and setup your server.

1. Install an Ubtuntu 14.04 instance
2. Create your non-root user and give sudo permissions
3. Install a mysql server by running `sudo apt-get install mysql`
4. Install npm by running `sudo apt-get install npm`
5. Run `npm install` to install the project dependencies
6. Login to mysql using the credentials you created
7. Run `database.sql` to create the database and tables
8. Set up Redis server on your machine! Make sure Redis is running
9. Run `babel-node server` to compile the code and start the server*

*Note: Eventually I will export a distribution model that does not require babel. If you do this on your own, use `node server.js --harmony` to start the server.

Game Status: [Under Development]
================================

You can currently create an account, login, and navigate the routing. I am currently setting up the map system, and progress is going well. 

You can now move around with other players in real time, see them on the same coordinates as you, and the backend tracks angle bearing within your sense radius!

Players now have a sense of hearing (but apparently shitty eyesight!). Your HUD now displays bearing flashers when players move in your vicinity.

You can now create a game lobby, join a lobby, and sit in the waiting room in real time. Needs tweaks though, and special checks.

Special Thanks
==============

[@rlemon](https://github.com/rlemon) -- Helping design, teach, and create the express node routing system. Also screamed BABEL at me several times.

[@ssube](https://github.com/ssube) -- Designed the algorithm to determine player bearing within radius of sense, along with teaching me redis, and why I should use it.

[@ralt](https://github.com/ralt) -- For yelling at my shit code so that I wrote good code. U da real MVP.
