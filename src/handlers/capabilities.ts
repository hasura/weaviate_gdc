import { configSchema } from "../config";
import {
  Capabilities,
  CapabilitiesResponse,
  ScalarTypesCapabilities,
} from "@hasura/dc-api-types";

function getDefaultOperators(inputType: string) {
  return {
    equal: inputType,
    less_than: inputType,
    less_than_equal: inputType,
    greater_than_equal: inputType,
    greater_than: inputType,
  };
}

const scalarTypes: ScalarTypesCapabilities = {
  text: {
    graphql_type: "String",
    // comparison_operators: getDefaultOperators("text"),
  },
  int: {
    graphql_type: "Int",
    // comparison_operators: getDefaultOperators("int"),
  },
  boolean: {
    graphql_type: "Boolean",
    // comparison_operators: getDefaultOperators("boolean"),
  },
  number: {
    graphql_type: "Float",
    // comparison_operators: getDefaultOperators("number"),
  },
  date: {
    graphql_type: "String",
    // comparison_operators: getDefaultOperators("date"),
  },
  uuid: {
    graphql_type: "String",
    // comparison_operators: getDefaultOperators("uuid"),
  },
  geoCoordinates: {
    graphql_type: "String",
    // comparison_operators: getDefaultOperators("geoCoordinates"),
  },
  phoneNumber: {
    graphql_type: "String",
    // comparison_operators: getDefaultOperators("phoneNumber"),
  },
  blob: {
    graphql_type: "String",
    // comparison_operators: getDefaultOperators("blob"),
  },
  vector: {
    comparison_operators: {
      // ...getDefaultOperators("vector"),
      near_text: "text",
    },
  },
};

const capabilities: Capabilities = {
  data_schema: {
    supports_primary_keys: true,
    column_nullability: "nullable_and_non_nullable",
  },
  queries: {
    foreach: {},
  },
  relationships: {},
  comparisons: {},
  scalar_types: scalarTypes,
  mutations: {
    insert: {},
    // update: {},
    delete: {},
  },
};

const capabilitiesResponse: CapabilitiesResponse = {
  capabilities: capabilities,
  config_schemas: configSchema,
};

export function getCapabilities(): CapabilitiesResponse {
  return capabilitiesResponse;
}
