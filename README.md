# Tic Tac Toe

This is an attempt to write a [Node.js](http://nodejs.org) game using [Socket.io](http://socket.io) for realtime gameplay. Tic-tac-toe is a simple enough game, so I figured it would be an easy project to learn with.

I'm using this as a learning project, so expect that some parts will be messy.

I'm also going to be using this to learn BDD, and probably should have written the tests first, but I'll be doing that soon and going forward from there.

# Roadmap

* Build basic socket driven game - DONE
* Add player preferences, such as number of games per set (default 1)
* Create session model to handle multiple games per user
* Display number of games user prefers on lobby playerlist
* Add 'leaveGame' button on the nav when player is in session
* Count wins and display them in playerList
* Add cookies so players don't have to create a new username every time