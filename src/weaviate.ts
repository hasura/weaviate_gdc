import weaviate, { ApiKey } from "weaviate-ts-client";
import { Config } from "./config";

export function getWeaviateClient(config: Config) {
  return weaviate.client({
    scheme: config.scheme,
    host: config.host,
    apiKey: new ApiKey(config.apiKey),
    headers: {
      "X-Openai-Api-Key": config.openAIKey,
    },
  });
}
