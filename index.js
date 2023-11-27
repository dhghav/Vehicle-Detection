// backend code

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 9090;

let gLongitude = "";
let gLatitude = "";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

const axios = require("axios");

// Store the latest received location
let latestLocation = {};

// app.get("/", (req, res) => {
//   res.send(`<h1> Hello <h1>`);
// });

// fun print
function funPrint(longitude, latitude) {
  console.log("fun");
  app.get("/", (req, res) => {
    res.send(
      `<h1> Welcome  <br>  longitude: ${longitude} and latitude:  ${latitude}<h1>`
    );
  });
}

// Endpoint to receive location updates
app.post("/get_location", (req, res) => {
  const { latitude, longitude } = req.body;
  gLongitude = longitude;
  gLatitude = latitude;
  console.log(
    `Received location update - Latitude: ${latitude}, Longitude: ${longitude}`
  );
  // call function
  
    funPrint(latitude, longitude);

  // Store the latest location
  latestLocation = { latitude, longitude };

  res.status(200).send("Location received successfully");
});

// Endpoint to send location and nearby hospitals to the frontend
app.get("/send_location", async (req, res) => {
  // Retrieve the latest stored location
  const { latitude, longitude, message } = latestLocation;

  console.log(`Sending location to frontend - Latitude: ${latitude}, Longitude: ${longitude});
  console.log(Message: ${message}`);

  try {
    // Get nearby hospitals using Google Places API
    const placesResponse = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${latitude},${longitude}`,
          radius: 5000,
          type: "hospital",
          key: "AIzaSyBysKIf3pwWPtc7hU1ropYDjpS81KmG82k",
        },
      }
    );

    const hospitals = placesResponse.data.results.map((hospital) => ({
      name: hospital.name,
      address: hospital.vicinity,
    }));

    console.log("Nearby Hospitals:", hospitals);

    // Send the location and nearby hospitals to the frontend
    res.status(200).json({ latitude, longitude, message, hospitals });
  } catch (error) {
    console.error("Error fetching nearby hospitals:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
