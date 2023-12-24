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
