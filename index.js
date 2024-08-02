const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios"); // const axios'
const cors = require("cors");
require("dotenv").config();

mongoose.Promise = global.Promise;

const app = express();

const dataset =require('./model/dataset.js')
const AnomalyDetection = require('./model/datasetAnomali.js')


mongoose
	.connect("mongodb+srv://smartfarmingunpad:Zg2btY2zwNddpNsvLrYGNGtgTSZS6xxX@smartfarmingunpad.usves.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "smartfarmingunpad",
	})
	.then(
		() => {
			console.log("Database sucessfully connected!");
		},
		(error) => {
			console.log("Could not connect to database : " + error);
		}
	);
app.use(cors({
    origin: "*",
}))
// Middleware
app.use(express.json());


app.post("/user/login", (req, res) => {
    console.log(req.body)
	axios
		.post("https://api.smartfarmingunpad.com/user/login", {
            email: req.body.email,
            password: req.body.password,
        })
		.then((response) => {
			console.log(response.data);
			res.send(response.data); // Respond to the client
		})
		.catch((error) => {
			// console.error(error);
            res.send(error)
		});
});

////endpoint dataset
// app.get("/dataset", (req, res) => {
//     console.log("req", req.query)
//     dataset
//     .find({
//         device_id: req.query.device_id,
//         index_id: req.query.index_id
//     })
//     .sort({createdAt: -1})
//     .limit(1)
//     .then((data) => {
//         console.log('data', data)
//         return res.json(data);
//     })
//     .catch(err => {
//         return res.json(err);
//     })
// });


// endpoint datalist buat 10 data.
app.get("/datalist", (req, res) => {
    console.log("req", req.query);
    dataset
    .find({
        device_id: req.query.device_id,
        index_id: req.query.index_id
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .then((data) => {
        console.log('data', data);
        return res.json(data);
    })
    .catch(err => {
        return res.json(err);
    });
});

// endpoint 25 data ini awalnya tadinya buat dipake sementara chart aja...
app.get("/dataBanyak", (req, res) => {
    console.log("req", req.query);
    dataset
    .find({
        device_id: req.query.device_id,
        index_id: req.query.index_id
    })
    .sort({ createdAt: -1 })
    .limit(25)
    .then((data) => {
        console.log('data', data);
        return res.json(data);
    })
    .catch(err => {
        return res.json(err);
    });
});

//endpoint collection anomalydetections
app.get("/anomalyDetection", (req, res) => {
    console.log("req", req.query);
    AnomalyDetection
    .find({
        sensor_name: req.query.sensor_name
    })
    .sort({ createdAt: -1 })
    .limit(150)
    .then((data) => {
        console.log('data', data);
        return res.json(data);
    })
    .catch(err => {
	console.error('Query Error:', err);
        return res.json(err);
    });
});


// endpoint untuk post data anomali
app.post("/anomalyDetection", (req, res) => {
  const { sensor_name, anomaly } = req.body; //Menggunakan destructuring assignment

  const newAnomaly = new AnomalyDetection({
    sensor_name,
    anomaly,
    createdAt: new Date().toISOString()  // Set to current date/time
  });

  newAnomaly.save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});


app.get("/", (req, res) => {
	res.send({ message: "Halooo" });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
