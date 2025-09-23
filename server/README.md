# Server

This folder contains the Express server for the LMS project.

## Setup

1. Copy `.env.example` to `.env`:

   ```powershell
   copy .env.example .env
   ```

2. Edit `.env` and replace `MONGO_URI` with your MongoDB connection string and other values.

3. Install dependencies and start the server:

   ```powershell
   npm install
   npm run dev    # or nodemon
   ```

## Notes

- The server will fail fast if `MONGO_URI` is not set. See `.env.example` for required variables.
