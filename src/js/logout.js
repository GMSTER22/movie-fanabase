import { loadHeaderFooter, updateAccountLink } from "./utils.mjs";
const token = import.meta.env.VITE_MOVIE_DB_API_TOKEN;
const url = import.meta.env.VITE_MOVIE_DB_BASE_URL;

loadHeaderFooter();

async function logout() {
  const sessionId = sessionStorage.getItem("mf-session-id");

  const options = {
    method: "DELETE",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ session_id: sessionId }),
  };

  try {
    const response = await fetch(url + "authentication/session", options);

    if (response.ok) {
      const data = await response.json();
      sessionStorage.clear("mf-session-id");
      updateAccountLink();
    }
  } catch (error) {
    console.log(error);
  }
}

logout();
