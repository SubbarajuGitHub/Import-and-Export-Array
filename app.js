const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/movies/", async (request, response) => {
  const AllmoviesList = `
    select *
    from movie;`;
  const MoviesArray = await db.all(AllmoviesList);
  response.send(MoviesArray);
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const UpdateMovie = `
  insert into
  movie (directorId, movieName, leadActor)
  (${directorId}, ${movieName} ,${leadActor});
    `;
  const NewMovieArray = await db.get(UpdateMovie);
  response.send(NewMovieArray);
});
