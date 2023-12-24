const express = require("express");
const app = express();

const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server listening at Port 3000");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// API 1

const convertDbObjToResponseObj1 = (dbObj) => {
  return {
    movieName: dbObj.movie_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getAllMovieNamesQuery = `
    select movie_name from movie order by movie_id;`;

  const allMovieArray = await db.all(getAllMovieNamesQuery);
  const responseMovieListArray = allMovieArray.map((eachMovie) => {
    return convertDbObjToResponseObj1(eachMovie);
  });
  response.send(responseMovieListArray);
});

app.use(express.json());

// API 2

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const addMovieToDbQuery = `
    insert into movie(director_id, movie_name, lead_actor)
    values(
        ${directorId},
        '${movieName}',
        '${leadActor}'
    );`;

  const dbResponse = await db.run(addMovieToDbQuery);
  response.send("Movie Successfully Added");
});

// API 3

const convertDbObjToResponseObj2 = (dbObj) => {
  return {
    movieId: dbObj.movie_id,
    directorId: dbObj.director_id,
    movieName: dbObj.movie_name,
    leadActor: dbObj.lead_actor,
  };
};

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);

  const getReqMovieQuery = `
    select * from movie where movie_id = ${movieId};`;
  console.log("SQL Query:", getReqMovieQuery);

  const reqMovie = await db.get(getReqMovieQuery);
  console.log(reqMovie);

  response.send(convertDbObjToResponseObj2(reqMovie));
});
