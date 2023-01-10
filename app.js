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
  movie (director_id, movie_name, lead_actor)
  values
  (${directorId}, ${movieName} ,${leadActor});
    `;
  const NewMovieArray = await db.run(UpdateMovie);
  response.send("Movie Successfully Add");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movie_id } = request.params;
  const SingleMovie = `
    SELECT 
      * 
    FROM 
      movie 
    WHERE 
      movie_id = ${movie_id};`;
  const SingleMovieArray = await db.get(SingleMovie);
  response.send(SingleMovieArray);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movie_id } = request.params;
  const { directorId, movie_id, leadActor } = request.body;
  const updateMovie = `
    update
    movie
    set
    director_id='${directorId}',
    movie_id='${movie_id}'',
    lead_actor='${leadActor}',
    where
    movie_id='${movie_id};
    `;
  await db.run(updateMovie);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movie_id } = request.params;
  const DeleteMovie = `
    delete
    from movie
    where movie_id='${movie_id}`;
  await db.run(DeleteMovie);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const AllDirectors = `
    select *
    from 
    director
    ;`;
  const DirectersArray = await db.all(AllDirectors);
  response.send(DirectersArray);
});

app.get("/directors/:directorId/movies/", async (request.response) => {
  const { director_id } = request.params;
  const directedMovies = `
    select
    movie_name	
    from
    movie
    where director_id='${director_id}';
    `;
  const directorArrays = await db.all(directedMovies);
  response.send(directorArrays);
});

module.exports = app;
