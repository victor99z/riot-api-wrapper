import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios";
import * as moment from 'moment'

const PATH_API_USER_INFO = "http://localhost:7071/api/getUserInfo"
const API_URL_AMERICAS = process.env.API_BASE_URL_AMERICAS
const API_TOKEN = process.env.RIOT_API_KEY


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const name: string = req.body.name;
    const date: string = req.body.data;
    const dateObject = moment(date, "DD/MM/YYYY");

    const startTime = dateObject.unix();
    const endTime = dateObject.add(24, "hours").unix()

    const playerInfo = await axios.post(PATH_API_USER_INFO, { name });

    const URL_BUILD = `lol/match/v5/matches/by-puuid/${playerInfo.data.puuid.puuid}/ids?startTime=${startTime}&endTime=${endTime}&count=20`;
    const PATH_URL_MATCHES = API_URL_AMERICAS + URL_BUILD

    const matchesInfo = await axios.get(PATH_URL_MATCHES, {
        headers: {
            "X-Riot-Token": API_TOKEN
        }
    });

    context.res = {
        body: {
            name: playerInfo.data.puuid.name,
            date,
            matches: matchesInfo.data
        }
    }

};

export default httpTrigger;
