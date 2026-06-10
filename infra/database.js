import { Client } from "pg";
import { ServiceError } from "infra/errors.js";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Error on dataabase connection or query execution.",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

function getSSLValues() {
  if (process.env.POSTGRESS_CA) {
    return {
      ca: process.env.POSTGRESS_CA,
    };
  }

  return process.env.NODE_ENV == "production" ? true : false;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
