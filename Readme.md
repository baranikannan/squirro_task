## Tasks
Based on the mail both tasks were completed.

Frontend challenge: https://github.com/squirro/frontend-coding-challenge

Backend challenge: Attached



# Squirro Frontend and Backend Coding Challenge

This repository contains both frontend and backend projects for the Squirro coding challenge. The backend serves as a mock API for bookstores, and the frontend displays the best-selling books for each bookstore as provided by the backend.

## Project Structure

The project is divided into two main directories:

- `frontend-coding-challenge`: Contains the frontend React application and the mock backend API.
- `newyork_times`: Contains a Python script for fetching and processing articles from the New York Times API.

### Frontend (`bookstore-frontend`)

The frontend is built with React and fetches data from the mock backend to present a list of bookstores and their best-selling books.

#### Setup

1. Navigate to `frontend-coding-challenge/bookstore-frontend`.
2. Run `npm install` to install dependencies.
3. Start the app with `npm start`.

### Backend (`book-store-api`)

A mock JSON:API server implemented in `index.js` providing bookstore data.

#### Setup

1. Navigate to `frontend-coding-challenge/book-store-api`.
2. Run `npm install` to install dependencies.
3. Start the server with `npm start`.

## Notes

- Ensure the backend server is running before starting the frontend application.
- Adjust the API endpoints in the frontend configuration if backend runs on a different port or if you are using an external API service.


## Task Checklist
1. App that lists best-selling books for each bookstore: The frontend should make use of App.js and Bookstore.js to render this information.

2. JSON:API based application (Backend): The backend API is provided in index.js.

3. Wireframe representation: The frontend should match the wireframe provided in the task description.

4. Circle markers representation: Each requirement represented by the circle markers in the wireframe should be implemented.

5. Usage of the REST Countries API for flags: The App.js file contains a function that constructs the URL for the country flags, and        Bookstore.js uses this URL to display the flag image.

6. output.png is the screenshot of the wireframe based frontend page.








### New York Times Articles (`newyork_times`)

A Python script for fetching and processing articles from the New York Times API.

#### Setup

1. Ensure you have Python installed.
2. Navigate to `newyork_times`.
3. Run `pip3 install -r requirements.txt` to install dependencies.
4. API-KEY-VALUE needs to be updated with key value in `NewYork.py`.
5. Execute the script with `python3 NewYork.py`.

## Instructions

Each part of the project includes its own README.md with detailed instructions. Please follow the instructions in each subdirectory to get each part of the project running.



## Task Checklist

1. New York Times API Utilization: The NewYork.py file you provided earlier appears to handle the communication with the New York Times API. It fetches articles based on a query and processes them in batches as required.

2. NYTimesSource Class Structure: The class in NewYork.py matches the expectation for a data loader plugin for the NY Times API.

3. Batched Results: The getDataBatch method in NewYork.py uses a generator to yield articles in batches.

4. Dictionary Flattening: The flatten_dict method in NewYork.py is implemented without third-party libraries, which satisfies the requirement.

5. No Third-Party Libraries for Flattening: Confirmed by reviewing NewYork.py; the flattening is custom-coded.

6. requirements.txt: This file is needed to specify dependencies. Since the requests library is used, this should be listed in requirements.txt.

7. output.txt has the output of the script execution.
