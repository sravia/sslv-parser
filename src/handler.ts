import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { notifySlack } from "./utils/notifySlack";
import { Car, formatCarResults, getCars } from "./parsers/cars";
import config from "./config.json";
import { addItems } from "./utils/db";

type Parser = { get: () => Promise<Car[]>, resultFormatter: (results: Car[]) => string[]; table: string; webhookURL: string; };
const PARSERS: Parser[] = [
  {
    get: getCars,
    resultFormatter: formatCarResults,
    table: "sslv-parser-cars",
    webhookURL: config.webhooks.cars,
  },
];

async function parse(handler: Parser) {
  try {
    const result = await handler.get();
    const addedResults = await addItems(handler.table, result);
    if (addedResults.length > 0) {
      return notifySlack(handler.webhookURL, handler.resultFormatter(addedResults));
    }
  } catch (e) {
    console.log(e);
    return notifySlack(handler.webhookURL, [`${handler.table} Failed to parse. Check logs`]);
  }
}

export const handler = async (): Promise<APIGatewayProxyResult> => {
  for (const parser of PARSERS) {
    await parse(parser);
  }
  return { statusCode: 200, body: "" };
};
