import {
  MutationRequest,
  MutationResponse,
  QueryRequest,
  QueryResponse,
} from "@hasura/dc-api-types";
import { Config } from "../config";
import { getWeaviateClient } from "../weaviate";
import def from "ajv/dist/vocabularies/discriminator";
import { builtInPropertiesKeys } from "./schema";
import { queryWhereOperator } from "./query";

export async function executeMutation(
  mutation: MutationRequest,
  config: Config
): Promise<MutationResponse> {
  const response: MutationResponse = {
    operation_results: [],
  };

  for (const operation of mutation.operations) {
    switch (operation.type) {
      case "insert":
        const creator = getWeaviateClient(config).batch.objectsBatcher();

        for (const row of operation.rows) {
          const baseProperties: Record<string, any> = {
            class: operation.table[0],
          };
          const additionalProperties: Record<string, any> = {};

          for (const prop in row) {
            if (builtInPropertiesKeys.includes(prop)) {
              baseProperties[prop] = row[prop];
            } else {
              additionalProperties[prop] = row[prop];
            }
          }

          creator.withObject({
            ...baseProperties,
            properties: additionalProperties,
          });
        }
        // todo: something with the response?
        const insertResponse = await creator.do();

        console.log("insert response", JSON.stringify(insertResponse));

        // todo: handle returning fields, based on insert response.

        response.operation_results.push({
          affected_rows: operation.rows.length,
        });

        break;
      case "update":
        throw new Error("update not implemented");
      case "delete":
        const deleter = getWeaviateClient(config)
          .batch.objectsBatchDeleter()
          .withClassName(operation.table[0])
          .withOutput("verbose");
        if (operation.where) {
          deleter.withWhere(queryWhereOperator(operation.where));
        }

        const deleteResponse = await deleter.do();

        console.log("delete response", deleteResponse);

        response.operation_results.push({
          affected_rows: deleteResponse.results?.matches!,
        });

        break;
    }
  }

  return response;
}
