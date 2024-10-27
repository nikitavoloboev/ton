import { TonClient } from "@ton/ton"

console.log("Endpoint", process.env.ENDPOINT)
export const tonClient = new TonClient({
	endpoint: process.env.ENDPOINT!,
	apiKey: process.env.ENDPOINT_API_KEY,
})
