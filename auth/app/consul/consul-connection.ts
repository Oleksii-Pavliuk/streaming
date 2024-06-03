import ip from "ip";
import Consul from "consul";
import { v4 as uuidv4 } from "uuid";

import config from "../config/config";

const CONSUL_HOST: string = config.get("consulHost") as string;
const CONSUL_PORT: string = config.get("consulPort") as unknown as string;
const SERVICE_HOST: string | undefined = ip.address();
const SERVICE_PORT: number = config.get("port");
const HEALTH_CHECK_URL: string = `http://${SERVICE_HOST}:${SERVICE_PORT}/health`;
const CONSUL_ID: string = uuidv4();
const CONSUL_SERVICE_NAME: string = config.get("ServiceName");

let consul: any;
if (CONSUL_SERVICE_NAME) {
	consul = new Consul({
		host: CONSUL_HOST,
		port: CONSUL_PORT,
	});
}

const serviceDefinition: Consul.Agent.Service.RegisterOptions = {
	name: CONSUL_SERVICE_NAME ?? "",
	address: SERVICE_HOST,
	port: SERVICE_PORT,
	id: CONSUL_ID,
	check: {
		http: HEALTH_CHECK_URL,
		interval: "15s",
	},
};

const doGracefulShutdown = async () => {
	try{
		if (!consul) return;
		await consul.agent.service.deregister({ id: CONSUL_ID, name: CONSUL_SERVICE_NAME ?? "", });
		process.exit(0)
	} catch(err) {
		console.error(err);
	}
	
};

export const register = async () => {
	try {
		if (!consul) return;
		await consul.agent.service.register(serviceDefinition);
		console.log("Registred with Consul")
		process.on("SIGTERM", doGracefulShutdown);
		process.on("SIGINT", doGracefulShutdown);
	} catch(err) {
		console.error(err)
	}
	
};
