import express from "express";
import cors from "cors";
import Router from "express-promise-router";

//Local modules
import config from "./config/config";
import { connectMongo } from "./db/mongo-connection";
import { register as registerConsul } from "./consul/consul-connection";
import { handleOptions } from "./middleware/options";
import { corsOptions } from "./middleware/cors";

/* =================
   SERVER SETUP
================== */

const PORT = config.get("port");
const app = express();
const router = Router();
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);
router.use(handleOptions);
connectMongo();

/* ======
   ROUTES
========*/


// Consul health checks route
router.get("/health", (_req, res) => {
	res.sendStatus(200);
});

/* =================
   SERVER START
================== */
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
	registerConsul();
});
