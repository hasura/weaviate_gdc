import Fastify from "fastify";
import FastifyCors from "@fastify/cors";
import { getConfig } from "./config";
import {
  CapabilitiesResponse,
  SchemaResponse,
  QueryRequest,
  QueryResponse,
  MutationRequest,
  MutationResponse,
} from "@hasura/dc-api-types";
import { getCapabilities } from "./handlers/capabilities";
import { getSchema } from "./handlers/schema";
import { executeQuery } from "./handlers/query";
import { executeMutation } from "./handlers/mutation";

const port = Number(process.env.PORT) || 8100;
const server = Fastify({ logger: { transport: { target: "pino-pretty" } } });

server.register(FastifyCors, {
  // Accept all origins of requests. This must be modified in
  // a production setting to be specific allowable list
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
  origin: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: [
    "X-Hasura-DataConnector-Config",
    "X-Hasura-DataConnector-SourceName",
  ],
});

server.get<{ Reply: CapabilitiesResponse }>(
  "/capabilities",
  async (request, _response) => {
    server.log.info(
      { headers: request.headers, query: request.body },
      "capabilities.request"
    );
    return getCapabilities();
  }
);

server.get<{ Reply: SchemaResponse }>("/schema", async (request, _response) => {
  server.log.info(
    { headers: request.headers, query: request.body },
    "schema.request"
  );
  const config = getConfig(request);
  const schema = await getSchema(config);
  return schema;
});

server.post<{ Body: QueryRequest; Reply: QueryResponse }>(
  "/query",
  async (request, _response) => {
    server.log.info(
      { headers: request.headers, query: request.body },
      "query.request"
    );

    const config = getConfig(request);
    const query = request.body;
    const response = await executeQuery(query, config);
    return response;
  }
);

server.post<{ Body: MutationRequest; Reply: MutationResponse }>(
  "/mutation",
  async (request, _response) => {
    server.log.info(
      { headers: request.headers, query: request.body },
      "mutation.request"
    );

    const config = getConfig(request);
    const mutation = request.body;
    const response = await executeMutation(mutation, config);
    return response;
  }
);

server.get("/health", async (request, response) => {
  server.log.info(
    { headers: request.headers, query: request.body },
    "health.request"
  );
  response.statusCode = 204;
});

process.on("SIGINT", () => {
  server.log.info("interrupted");
  process.exit(0);
});

const start = async () => {
  try {
    await server.listen({ port: port, host: "0.0.0.0" });
  } catch (err) {
    server.log.fatal(err);
    process.exit(1);
  }
};
start();
