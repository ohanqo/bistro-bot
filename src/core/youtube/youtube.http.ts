import axios from "axios";

const YoutubeHttp = axios.create({
  baseURL: `${process.env.YOUTUBE_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

YoutubeHttp.interceptors.request.use(
  async (request) => {
    request.params = request.params || {};
    request.params["key"] = process.env.YOUTUBE_API_KEY;
    return request;
  },
  (error) => error,
);

export { YoutubeHttp };
