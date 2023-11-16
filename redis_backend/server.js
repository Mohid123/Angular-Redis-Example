const express = require("express");
const redis = require("redis");
const axios = require("axios");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT || 3000;
let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})(); // IIFE function


// Network Calls
async function fetchApiData(number) {
  const apiResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${number}`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}

async function postApiData(data) {
  const apiResponse = await axios.post(`https://jsonplaceholder.typicode.com/users`, data);
  return await apiResponse.data;
}

async function fetchAllData() {
  const apiResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/users`
  );
  console.log("Request for allusers sent to the API");
  return apiResponse.data;
}

async function deleteApiData(id) {
  const apiResponse = await axios.delete(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  console.log("Request for delete sent to the API");
  return apiResponse.data;
}


// APIS
async function getPatients(req, res) {
  const number = req.params.number;
  let results;
  let isCached = false;
  try {
    const cacheResults = await redisClient.get(number);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchApiData(number);
      if (results.length === 0) {
        throw "API returned an empty array";
      }
      await redisClient.set(number, JSON.stringify(results));
    }
    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

async function getAllPatients(req, res) {
  let results;
  let isCached = false;
  try {
    const cacheResults = await redisClient.get('Data');
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchAllData();
      if (results.length === 0) {
        throw "API returned an empty array";
      }
      await redisClient.set('Data', JSON.stringify(results));
    }
    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

async function addPatient(req, res) {
  let patientData = req.body;
  try {
    let request = await postApiData(patientData);
    if(request) {
      res.status(200).send({message: "Record added"});
    }
  } catch (error) {
    console.error(error);
    res.status(404).send({message: "Failed to create patient record"});
  }
}

async function deletePatient(req, res) {
  let patientID = req.params.id;
  try {
    let request = await deleteApiData(patientID);
    if(request) {
      res.status(200).send({message: "Record deleted"});
    }
  } catch (error) {
    console.error(error);
    res.status(404).send({message: "Failed to delete patient record"});
  }
}

app.get("/users/:number", getPatients); // fetch by id
app.get("/users", getAllPatients); // all fetch
app.post("/users", addPatient); // add new
app.delete("/users/:id", deletePatient); // delete

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});