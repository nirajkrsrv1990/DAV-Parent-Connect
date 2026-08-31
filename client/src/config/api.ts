const API_BASE_URL =
  import.meta.env.DEV
    ? "http://10.120.183.108:5000/api"
    : "http://200.141.0.100/api";

const FILE_BASE_URL = "http://200.141.0.100";

const HOMEWORK_FILE_BASE_URL = "http://200.141.0.100";

export {
  API_BASE_URL,
  FILE_BASE_URL,
  HOMEWORK_FILE_BASE_URL,
};