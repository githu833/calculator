# Interest Calculator - Full Stack

A modern web application to calculate Simple and Compound interest with history storage.

## Prerequisites
- Node.js (Installed during setup)
- MongoDB (Ensure MongoDB is running locally at `mongodb://localhost:27017/` or update the connection string in `backend/index.js`)

## Running the Application

### 1. Start the Backend
Open a terminal in the project root:
```powershell
cd backend
$env:PATH += ";C:\Program Files\nodejs"
npm start
```
*(Note: If you haven't added a start script, use `node index.js`)*

### 2. Start the Frontend
Open another terminal in the project root:
```powershell
cd frontend
$env:PATH += ";C:\Program Files\nodejs"
npm run dev
```

## Features
- **Modern UI**: Glassmorphism design with a responsive layout.
- **SI/CI Formulas**: Accurate interest calculation on the server.
- **History Storage**: All calculations are saved in MongoDB and displayed on the UI.
- **Validation**: Prevents negative or empty inputs.

## Technologies Used
- **Frontend**: React.js, Vite, Axios, Vanilla CSS.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB.
