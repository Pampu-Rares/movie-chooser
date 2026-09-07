# This README is under construction...

# Movie Finder App
A full-stack web application which helps you choose the next movie to watch by yourself or alongside your friends.
- this project utilises React, Node.js, Socket.io, and TMDB API

## Getting Started

### Prerequisites

This project requires Node.js installed on your system.
- If you do not have Node.js installed, you can install it from [here](https://nodejs.org/en/download);

### Installation

1. Paste this line into your terminal:

```shell
git  clone  https://github.com/Pampu-Rares/movie-chooser.git
```

2. Switch to the `initial-version` branch: 

```shell
git checkout initial-version
```

- There are two main folders in this project: `backend` and `frontend`.

### Backend

The `backend` contains the Node.js server to which the `frontend` connects to receive data from the TMDB API and to socket.io. It requires a `.env` file in the root of for the TMDB API KEY and for the local port on which to run:

1. In the newly created `.env` file: 
```env
API_KEY= # enter your TMDB API key
PORT=3030
```
- If you do not have an API key, you can create one from the TMDB official website

2. Install the server dependencies: 

```shell
npm install
```

3. To run the server locally: open a terminal in the `backend` directory, then run the following command:

```shell
npm run dev
```

### Frontend

The `frontend` contains the React app for the website. It also requires a `.env` file for the port of the server

1. Add the `.env` file in the root of the `frontend`, and enter the same port as in the `backend/.env` file with this name:

```env
VITE_SERVER_PORT=3030 # needs to match the other .env file's PORT
```

2. Open a terminal in the `frontend` folder and write again:

```shell
npm install
```

3. Afterwards, to run the React app:

```shell
npm run dev
```

4. Open a tab in your browser to the localhost prompted in the terminal to use the project.

## Usage

### The Movie Finder App

Create or join a room along with your friends and press play. The socket.io server then sends the room up to 10 movies to like or dislike based on your preferences. If more than half of the people in the room like a certain movie, it will appear as a match. At the end of all of the movies, the room admin can choose to play again if the movies were unsatisfactory.

## License

This project is licensed under the **Source-Available Non-Commercial License**.
See the [LICENSE](LICENSE) file for the full license terms.

## Contact
For improvements or suggestions you can contact me here:
Pampu Rares - [rarespampu@gmail.com](mailto:rarespampu@gmail.com)