import express from "express";
import cors from "cors";
import Router from "express-promise-router";

//Local modules
import { handleOptions } from "../middleware/options";
import { corsOptions } from "../middleware/cors";
import indexRoutes from "../routes/index"




/* =================
   SERVER SETUP
================== */

const app = express();
const router = Router();
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);
router.use(handleOptions);

/* ======
   ROUTES
========*/

// Consul health checks route
router.get("/health", (_req, res) => {
	res.sendStatus(200);
});

app.use('/', indexRoutes);


export default app;