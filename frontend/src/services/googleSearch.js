import { socket } from "./socketLogic";

const googleSearchUrl = 'https://www.google.com/search?q=';

export default function searchOnGoogle(query) {
    socket.disconnect();
    window.location.href = googleSearchUrl + encodeURIComponent(query);
}