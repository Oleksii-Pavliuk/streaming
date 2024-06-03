import { Request, Response, NextFunction } from "express";
//Local modules
import config from "../config/config";

const CORS_ORIGIN = config.get("origin");

// Middleware function to handle OPTIONS requests
export const handleOptions = (req: Request, res: Response, next: NextFunction) => {
	if (req.method === "OPTIONS") {
		const headers = {
			"Access-Control-Allow-Origin": CORS_ORIGIN,
			"Access-Control-Allow-Methods": "POST",
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Max-Age": "3600",
		};
		res.header(headers).status(200).send();
	} else {
		next();
	}
};