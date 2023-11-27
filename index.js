const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

const app = express();
const port = 9090;

let latestLocation = {
  latestLatitude: "",
  latestLongitude: "",
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to receive location updates
app.post("/get_location", (req, res) => {
  const { latitude, longitude } = req.body;
  latestLocation.latestLatitude = latitude;
  latestLocation.latestLongitude = longitude;
  console.log(
    `Received location update - Latitude: ${latitude}, Longitude: ${longitude}`
  );
  res.status(200).send("Location received successfully");
});

// Endpoint to fetch latest latitude and longitude
app.get("/latest_location", (req, res) => {
  const { latestLatitude, latestLongitude } = latestLocation;
  res.json({ latitude: latestLatitude, longitude: latestLongitude });
});

// Function to fetch latest location
async function fetchLatestLocation() {
  try {
    const response = await axios.get("http://localhost:9090/latest_location");
    const { latitude, longitude } = response.data;
    console.log(`Latest Latitude: ${latitude}, Longitude: ${longitude}`);
    // Perform any other actions with latitude and longitude here
  } catch (error) {
    console.error("Error fetching latest location:", error);
  }
}

// Call the function to fetch the latest location
fetchLatestLocation();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
