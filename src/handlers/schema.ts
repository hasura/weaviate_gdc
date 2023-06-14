import {
  ColumnInfo,
  ColumnType,
  SchemaResponse,
  TableInfo,
} from "@hasura/dc-api-types";
import { Config } from "../config";

import { getWeaviateClient } from "../weaviate";

const builtInProperties: ColumnInfo[] = [
  {
    name: "id",
    nullable: false,
    type: "uuid",
    insertable: true,
  },
  {
    name: "creationTimeUnix",
    nullable: false,
    type: "int",
  },
  {
    name: "lastUpdateTimeUnix",
    nullable: false,
    type: "int",
  },
  {
    name: "vector",
    nullable: true,
    insertable: true,
    // type: { element_type: "number", nullable: false, type: "array" },
    type: "vector",
  },
];

export const builtInPropertiesKeys = builtInProperties.map((p) => p.name);

export async function getSchema(config: Config): Promise<SchemaResponse> {
  const weaviateClient = getWeaviateClient(config);

  const schema = await weaviateClient.schema.getter().do();

  // note: we may run into issues if there is a class <X> and a class <X>Properties
  return {
    tables: schema.classes!.map((c): TableInfo => {
      const columns: ColumnInfo[] = [
        ...c.properties!.map((p) => ({
          name: p.name!,
          nullable: true,
          insertable: true,
          updatable: true,
          type: weaviateTypeToGdcType(p.dataType!),
        })),
        // built-in properties will override any custom properties with the same name
        ...builtInProperties,
      ];

      return {
        name: [c.class!],
        description: c.description,
        updatable: true,
        insertable: true,
        deletable: true,
        type: "table",
        columns,
        primary_key: ["id"],
      };
    }),
  };
}

/**
 * Map a weaviate data type to a GDC data type.
 * This is not a perfect translation. Weaviate seems to support multiple types in a single property?
 * GDC expects concrete types per column. We're making a lot of assumttions her, and only taking into account the first weaviate data type.
 * We're also not supporting weaviate cross reference types.
 * ref: https://weaviate.io/developers/weaviate/api/rest/schema
 * ref: https://weaviate.io/developers/weaviate/config-refs/datatypes
 * @param dataType
 */
function weaviateTypeToGdcType(dataType: string[]): ColumnType {
  switch (dataType[0]) {
    case "text":
      return "text";
    case "text[]":
      return {
        element_type: "text",
        nullable: false,
        type: "array",
      };
    case "int":
      return "int";
    case "int[]":
      return {
        element_type: "int",
        nullable: false,
        type: "array",
      };
    case "boolean":
      return "boolean";
    case "boolean[]":
      return {
        element_type: "boolean",
        nullable: false,
        type: "array",
      };
    case "number":
      return "number";
    case "number[]":
      return {
        element_type: "number",
        nullable: false,
        type: "array",
      };
    case "date":
      return "date";
    case "date[]":
      return {
        element_type: "date",
        nullable: false,
        type: "array",
      };
    case "uuid":
      return "uuid";
    case "uuid[]":
      return {
        element_type: "uuid",
        nullable: false,
        type: "array",
      };
    case "geoCoordinates":
      return "geoCoordinates";
    case "phoneNumber":
      return "phoneNumber";
    case "blob":
      return "blob";
    default:
      throw new Error(`Types ${dataType} not supported`);
  }
}
