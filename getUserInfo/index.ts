import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { config as dotenv_config } from 'dotenv'
import axios from 'axios'

dotenv_config();

const API_BASE_URL = process.env.API_BASE_URL_BR;
const RIOT_API_KEY = process.env.RIOT_API_KEY;

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const name: string = req.body.name;
    const API_PATH = API_BASE_URL + `lol/summoner/v4/summoners/by-name/${name}`;

    const response = await axios.get(API_PATH, {
        headers: {
            "X-Riot-Token": RIOT_API_KEY
        }
    });

    context.res = {
        body: {
            puuid: response.data
        }
    };

};

export default httpTrigger;
