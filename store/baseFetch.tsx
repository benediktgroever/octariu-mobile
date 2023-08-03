import auth from '@react-native-firebase/auth';
import {
    PROTOCOL,
    OSUBMIT,
} from './environment';

enum Method {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE"
}

interface Request {
    method: Method,
    url: string,
    params: any,
}

const baseFetch = async (req: Request) => {
    const token = await auth().currentUser?.getIdToken();
    const headers = {
        "Content-Type": "application/json",
        "X-ACCESS-TOKEN": token ? token : "",
        "Access-Control-Allow-Origin": "*",
    }
    let url_search_params = Object.keys(req.params).length ? `?${new URLSearchParams(req.params)}` : '';
    const response = await fetch(`${PROTOCOL}://${OSUBMIT}${req.url}${url_search_params}`, {
        method: req.method,
        headers: headers,
    })
    return await response.json()
}

export { baseFetch, Method }