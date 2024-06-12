import convict, { Schema } from "convict";

interface IConfigSchema {
	env: string;
	port: number;
	origin: string;
	mongostring: string;
	mongouser: string;
	mongopassword: string;
	ServiceName: string;
	consulHost: string;
	consulPort: number;
	jaegerHost: string;
	jaegerPort: number;
	encKey: string;
	secKey: string;
}

const config: convict.Config<IConfigSchema> = convict({
	env: {
		doc: "Environoment for application",
		format: ["dev", "prod", "test"],
		default: "dev",
		env: "NODE_ENV",
	},
	port: {
		doc: "The port to bind.",
		format: "port",
		default: null,
		env: "PORT",
		arg: "port",
	},
	origin: {
		doc: "Allowed CORS servers",
		format: String,
		default: "*",
		env: "ORIGIN",
		arg: "origin",
	},
	mongostring: {
		doc: "Connection string for mongoDB",
		format: String,
		default: null,
		env: "MONGOSTRING",
		arg: "mongostring",
		sensitive: true,
	},
	mongouser: {
		doc: "Connection username for mongoDB",
		format: String,
		default: null,
		env: "MONGOUSER",
		arg: "mongouser",
		sensitive: true,
	},
	mongopassword: {
		doc: "Connection password for mongoDB",
		format: String,
		default: null,
		env: "MONGOPASSWORD",
		arg: "mongopassword",
		sensitive: true,
	},
	ServiceName: {
		doc: "The name by which the service is registered in Consul. If not specified, the service is not registered",
		format: "*",
		default: "Auth Service",
		env: "SERVICE_NAME",
	},
	consulHost: {
		doc: "The host where the Consul server runs",
		format: String,
		default: "consul-client",
		env: "CONSUL_HOST",
		arg: "consulhost"
	},
	consulPort: {
		doc: "The port for the Consul client",
		format: "port",
		default: 8500,
		env: "CONSUL_PORT",
	},
	jaegerHost: {
		doc: "The host where the Jaeger UI",
		format: String,
		default: "jaeger",
		env: "JAEGER_HOST",
		arg: "jaegerhost"
	},
	jaegerPort: {
		doc: "The port for Jaeger UI",
		format: "port",
		default: 4318,
		env: "JAEGER_PORT",
	},
	encKey: {
		doc: "The key used for encryption in user-manager",
		format: String,
		default: null,
		env: "ENC_KEY",
	},
	secKey: {
		doc: "The key used for encryption in user-manager",
		format: String,
		default: null,
		env: "SEC_KEY",
	}
} as unknown as Schema<IConfigSchema>);

const env = config.get("env");
config.loadFile(`./config/${env}.json`);

config.validate({ allowed: "strict" });

export default config;
