const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios"); // const axios'
const cors = require("cors");
require("dotenv").config();

mongoose.Promise = global.Promise;

const app = express();

const dataset =require('./model/dataset.js')

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

//endpoin dataset tapi dihubungin ke ML dulu
app.get("/datasetAnomali", (req, res) => {
    dataset
    .find({
        device_id: req.query.device_id,
        index_id: req.query.index_id
    })
    .sort({createdAt: -1})
    .limit(1)
    .then(async (data) => {
        if (data.length > 0) {
            const sensorData = {
                sensor_name: req.query.sensor_name,
                sensor_data: [{ value: data[0].value }]
            };

            try {
                const anomalyResponse = await axios.post("https://smartfarming2-ml.vercel.app/detect_anomalies", sensorData);
                const anomalies = anomalyResponse.data.anomalies;

                data[0].anomaly = anomalies[0];
                return res.json(data);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Error in anomaly detection" });
            }
        } else {
            return res.json(data);
        }
    })
    .catch(err => {
        return res.json(err);
    });
});


//endpoint dataset untuk NPK sendirian nanti ke ML dulu
app.get("/datasetNPK", (req, res) => {
    console.log("req", req.query)
    dataset
    .find({
        device_id: req.query.device_id,
        index_id: req.query.index_id
    })
    .sort({createdAt: -1})
    .limit(1)
    .then((data) => {
        console.log('data', data)
        return res.json(data);
    })
    .catch(err => {
        return res.json(err);
    })
});

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

app.get("/", (req, res) => {
	res.send({ message: "Halooo" });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
