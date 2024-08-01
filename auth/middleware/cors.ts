import {CorsOptions} from "cors";

//Local modules
import config from "../config/config";


const CORS_ORIGIN = config.get("origin");


export const corsOptions: CorsOptions = {
	origin: CORS_ORIGIN as unknown as string,
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};