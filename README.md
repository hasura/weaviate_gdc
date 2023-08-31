# Weaviate Data Connector

> [!NOTE]
> If using this connector with `graphql-engine` <= v2.32 use the [v2.32.0](https://github.com/hasura/weaviate_gdc/tree/v2.32.0) tag from this branch. If using this connector with `graphql-engine` >= v2.33 use main. There was a breaking change this is not backwards compatiple in the query request IR.

This repository contains the source code for a prototype [data connector agent](https://github.com/hasura/graphql-engine/blob/master/dc-agents/README.md) for Weaviate to be able to use it with Hasura.

This repository also contains a Dockerfile to be able to build an image in your own architecture and contains a docker-compose.yaml to try out the connector with Hasura.

To use the weaviate connector with Hasura:
- Deploy the connector somewhere that is accessible to Hasura
- In the Hasura console, add a new data connector called "weaviate" pointing it to your deployed agent.
- Add a new database in the console, where you should now see "weaviate" as a database type.
- Add your weaviate configuration:
  - host: Weaviate host URL
  - scheme: http/https
  - API key: Weaviate API key for authentication, pass any value if your database is unauthenticated
  - OpenAI API key: Yourn OpenAI API key for vectorization, pass any value if you don't use OpenAI.

Please note that this is only a prototype and may contain bugs, reliability, and performance issues.

## Deploy to Hasura Cloud

You can use the new [Hasura Data Connector Plugin](https://hasura.io/docs/latest/hasura-cli/connector-plugin/) for the Hasura CLI to deploy this connector to Hasura Cloud.
