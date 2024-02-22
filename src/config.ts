import { FastifyRequest } from "fastify";
import { ConfigSchemaResponse } from "@hasura/dc-api-types";

export type Config = {
  scheme: string;
  host: string;
  apiKey: string;
  openAIKey: string;
};

export const getConfig = (request: FastifyRequest): Config => {
  const configHeader = request.headers["x-hasura-dataconnector-config"];
  const rawConfigJson = Array.isArray(configHeader)
    ? configHeader[0]
    : configHeader ?? "{}";
  const config = JSON.parse(rawConfigJson);
  return {
    host: config.host,
    scheme: config.scheme ?? "http",
    apiKey: config.apiKey,
    openAIKey: config.openAIKey,
  };
};

export const configSchema: ConfigSchemaResponse = {
  config_schema: {
    type: "object",
    nullable: false,
    properties: {
      scheme: {
        description: "Weaviate connection scheme, defaults to http",
        type: "string",
        nullable: true,
      },
      host: {
        description: "Weaviate host, including port",
        type: "string",
        nullable: false,
      },
      apiKey: {
        description: "Weaviate api key",
        type: "string",
        nullable: false,
      },
      openAIKey: {
        description: "Open AI key",
        type: "string",
        nullable: false,
      },
    },
  },
  other_schemas: {},
};
