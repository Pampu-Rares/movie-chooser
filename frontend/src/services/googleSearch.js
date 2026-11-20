import { socket } from "./socketLogic";

const googleSearchUrl = 'https://www.google.com/search?q=';

export default function searchOnGoogle(query) {
    window.location.href = googleSearchUrl + encodeURIComponent(query);
    socket.disconnect();
}