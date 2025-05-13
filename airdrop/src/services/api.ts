import { API_BASE_URL, getAirdropsPayload } from "../consts";

export const getAirdrops = async (limit?: number) => {
    const url = `${API_BASE_URL}/search`;
    const payload = getAirdropsPayload(limit);

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data;
};
