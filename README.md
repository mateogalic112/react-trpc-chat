## React · tRPC · TypeScript Chat Application

### How to start project locally

Project is split into two folders: `frontend` and `server`.

To start project locally, first navigate to `/server` folder.

Then install all server dependecies with command:

> yarn

Backend uses `nodemon` for hot server reload every time server file is saved.

Start server with command:

> yarn dev

It should print following output:

> ✅ WebSocket Server listening on ws://localhost:4000

> Server started on http://localhost:4000

Great we now have our server up and running. Let' move to frontend.

Open new terminal and navigate to `/frontend` folder.

Again, to install all dependecies run:

> yarn

Same as with server, start frontend client with:

> yarn dev

Now your frotend is up and running on port 5173.

Open new browser tab with same url: http://localhost:5173.

Chat! 🗣️

Notes and limitations:

- Browser may not allow to redirect to url on first try, so you may need to allow popups from localhost:5173

- Audio notifications are blocked before user interacts with DOM

- Q: if user writes command in /edit should I execute that command as well?
