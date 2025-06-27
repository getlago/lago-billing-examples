import { Client } from 'lago-javascript-client';

const apiKey = process.env.LAGO_API_KEY!;

const lagoClient = Client(apiKey);

export default lagoClient;