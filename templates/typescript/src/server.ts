import express from 'express';
import dotenv from 'dotenv';
import {Serialized} from "@serialized/serialized-client";
import {<%= aggregateType %>} from "./model"
import chalk from "chalk";

dotenv.config();
const configuration = {
  port: process.env.PORT!,
  serialized: {
    accessKey: process.env.SERIALIZED_ACCESS_KEY!,
    secretAccessKey: process.env.SERIALIZED_SECRET_ACCESS_KEY!
  }
};

const app = express();
app.use(express.json());

const serializedClient = Serialized.create(configuration.serialized);

app.get('/', (req: express.Request, res: express.Response) => res.send(`Backend server for ${process.env.SERVICE_NAME}`));

app.post("/create-<%= aggregateTypeSlug %>", async (req: any, res) => {
  const <%= aggregateTypeSlug %>Id = req.body.<%= aggregateTypeSlug %>Id;
  const <%= aggregateTypeSlug %>Client = serializedClient.aggregateClient<<%= aggregateType %>>(<%= aggregateType %>)
  await <%= aggregateTypeSlug %>Client.create(<%= aggregateTypeSlug %>Id, (<%= aggregateTypeSlug %>) => (
    <%= aggregateTypeSlug %>.create(<%= aggregateTypeSlug %>Id)
  ));
  res.sendStatus(200);
});

app.post("/start-<%= aggregateTypeSlug %>", async (req: any, res) => {
  const <%= aggregateTypeSlug %>Id = req.body.<%= aggregateTypeSlug %>Id;
  const <%= aggregateTypeSlug %>Client = serializedClient.aggregateClient<<%= aggregateType %>>(<%= aggregateType %>)
  await <%= aggregateTypeSlug %>Client.update(<%= aggregateTypeSlug %>Id, (<%= aggregateTypeSlug %>) => (
      <%= aggregateTypeSlug %>.start(<%= aggregateTypeSlug %>Id)
  ));
  res.sendStatus(200);
});


app.listen(configuration.port, () => {
  console.log(`Application ${chalk.green.bold('<%= projectName %>')} is up and running.`);
  console.log(`API is available at: https://localhost:${configuration.port}`);
});

