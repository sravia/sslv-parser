import config from "../config.json";
import { DynamoDB } from "aws-sdk";

const dynamodb = new DynamoDB.DocumentClient({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
})

export async function addItems<T>(table: string, results: T[]): Promise<T[]> {
  const newResults: T[] = [];
  for (const result of results) {
    const added = await addItem<T>(table, result);
    if (added) {
      newResults.push(result);
    }
  }
  
  return newResults;
}

export async function addItem<T>(table: string, item: T) {
  return dynamodb.put({
      TableName: table,
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)'
  }).promise();
}
