# eyes


## Getting started

1. Install [Node JS](https://nodejs.org)
2. Clone or download (and unzip) this repo. Consider forking it if you want to make tracked modifications.
3. Navigate to the resulting folder in a command line tool (you know that you are in the right folder if it contains the file structure above)
4. Type `npm install` and wait while magic is installing the necessary libraries, which are specified in the file package.json (Don't worry about the npm warning at the end: "No repository field")
5. Type `node app.js` to start the server
6. Use a web browser to check what is happening at `localhost:3000`
7. Use another web browser to check what is happening at `localhost:3000/mover`
8. Use another device to check what is happening at `<your IP address>:3000` (for this you may need to adjust your computer's firewall to allow connections to Node)

## Modifying the code

Consider the "controller" `localhost:3000/mover` as defined by `js/mover.js` and `views/mover.html`. In a similar fashion the "face" `localhost:3000` is defined by `js/eyes.js` and `views/index.html`.
The server `app.js` relays commands between the "controller" and the "face". If you introduce new commands, make sure to also relay these explicitly in this server (which requires it to be restarted).

That should be enough to get started. Happy tinkering!