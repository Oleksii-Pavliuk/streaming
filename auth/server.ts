//Local modules
import config from "./config/config";
const PORT = config.get("port");
import app from './app/app';
import { register as registerConsul } from "./consul/consul-connection";
import { connectMongo } from "./db/mongo-connection";

/* =================
   SERVER START
================== */
app.listen(PORT, () => {
   console.log(`listening on port ${PORT}`);
   connectMongo();
   registerConsul();
});