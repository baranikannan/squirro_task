# Bookstore Best-sellers Listing

## Overview
This project presents a list of best-selling books for each bookstore, as provided by a mock backend API. The frontend is built using React and styled according to the given wireframe.

## Backend
The backend is a mock JSON:API server implemented in `index.js` using the `fake-json-api-server` package.

## Frontend
The frontend fetches data from the backend and renders bookstore details including names, best-selling books, ratings, establishment dates, and country flags.

## Getting Started
To run this project, you will need Node.js installed on the system.

### Backend Setup
1. Navigate to the directory book-store-api.
2. Install the necessary dependencies with `npm install`.
3. Start the server with `npm start`. The server will run on `http://localhost:3333/`.

### Frontend Setup
1. Navigate to the frontend directory bookstore-frontend.
2. Install the necessary dependencies with `npm install`.
3. Start the React app with `npm start`. The app will run on `http://localhost:3000/`.

## Dependencies
The backend requires the following Node.js package:
- `fake-json-api-server`

The frontend requires the following packages:
- `react`
- `axios`

These are already included in the `package.json` files in their respective directories.

## Design and Functionality
The design follows the provided wireframe, displaying bookstore information and best-selling books. The frontend also handles cases where there is no data available.

## Notes
- Ensure that the backend API is running before launching the frontend.
- Adjust the API endpoint in `App.js` if backend runs on a different port.

## Task Checklist
1. App that lists best-selling books for each bookstore: The frontend should make use of App.js and Bookstore.js to render this information.

2. JSON:API based application (Backend): The backend API is provided in index.js.

3. Wireframe representation: The frontend should match the wireframe provided in the task description.

4. Circle markers representation: Each requirement represented by the circle markers in the wireframe should be implemented.

5. Usage of the REST Countries API for flags: The App.js file contains a function that constructs the URL for the country flags, and        Bookstore.js uses this URL to display the flag image.

6. output.png is the screenshot of the wireframe based frontend page.
