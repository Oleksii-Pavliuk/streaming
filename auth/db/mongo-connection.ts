import mongoose from "mongoose";

import config from "../config/config";

const CONNECTION_STRING = config.get("mongostring");
const CONNECTION_USERNAME = config.get("mongouser");
const CONNECTION_PASSWORD = config.get("mongopassword");

export const connectMongo = () => mongoose
	.connect(CONNECTION_STRING,  {
		"authSource": "admin",
		"user": CONNECTION_USERNAME,
		"pass": CONNECTION_PASSWORD
	  })
	.then(() => {
		console.log("Connected to Mongo");
	})
	.catch((err) => {
		console.error("Error mongo: ", err);
	});
