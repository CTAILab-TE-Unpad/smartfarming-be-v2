const { Schema, model } = require("mongoose");


const anomalyDetectionSchema = new Schema(
  {
    sensor_name: String,
    anomaly: Number,
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  }
);

const AnomalyDetection = model("anomalydetections", anomalyDetectionSchema);

module.exports = AnomalyDetection;