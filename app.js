const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database/db");
const app = express();

const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);
var count = 0;
var RiderArr = [];

io.on("connection", (socket) => {
  count++;
  console.log(count, "New User Connected");
  socket.on("message", (data) => {
    // JSON.parse(data)
    io.emit("message", data);
    console.log(data)
  });
  socket.on("RiderLatLang", (data) => {
    console.log(data)
    var vetyo = false;
    const value = JSON.parse(data);
    for (var i = 0; i < RiderArr.length; i++) {
      if (value._id == RiderArr[i]._id) {
        RiderArr[i] = value;
        vetyo = true;
        break;
      }
    }
    if (!vetyo) {
      RiderArr.push(value);
    }

    io.emit("RiderLatLang", RiderArr);
  });

socket.on("accept",(data)=>{

  var news = JSON.parse(data)
io.emit("accept",JSON.stringify(news))

})

  socket.on("UserRequest", (data) => {
    var newData = JSON.parse(data);
    var userDetails = RiderArr[0];
    console.log(newData);

    var km = getDistanceFromLatLonInKm(
      parseFloat(RiderArr[0].latitude),
      parseFloat(RiderArr[0].longitude),
      parseFloat(newData.latitude),
      parseFloat(newData.longitude)
    );
    for (var i = 0; i < RiderArr.length; i++) {
      if (
        km >
        getDistanceFromLatLonInKm(
          parseFloat(RiderArr[i].latitude),
          parseFloat(RiderArr[i].longitude),
          parseFloat(newData.latitude),
          parseFloat(newData.longitude)
        )
      ) {
        km = getDistanceFromLatLonInKm(
          parseFloat(RiderArr[i].latitude),
          parseFloat(RiderArr[i].longitude),
          parseFloat(newData.latitude),
          parseFloat(newData.longitude)
        );
        userDetails = UserArr[i];
      } else {
        i++;
      }
    }
    const mergedObject = { userDetails, newData };
    console.log(mergedObject);
    console.log(km);

    io.emit("UserRequest", JSON.stringify(mergedObject));
  });
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const userroute = require("./UserRoute/userroute");
const { json } = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(userroute);

http.listen(2021, () => {
  console.log("Port is Listening on 2021");
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
