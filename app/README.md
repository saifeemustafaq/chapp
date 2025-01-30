# Chapp - Real-time Chat Application

A real-time chat application built with Vue.js and Node.js.

## Project Structure

```
app/
├── src/
│   ├── client/          # Frontend Vue.js application
│   ├── server/          # Backend Node.js application
│   └── shared/          # Shared code between client and server
└── package.json         # Root package.json for managing workspaces
```

## Setup

1. Install dependencies:
```bash
npm install
```

This will install dependencies for both client and server applications.

## Development

To run both client and server in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Run client only
npm run dev:client

# Run server only
npm run dev:server
```

The client will be available at http://localhost:5173
The server will be available at http://localhost:3000

## Building for Production

```bash
npm run build
```

## Starting Production Server

```bash
npm start
``` 