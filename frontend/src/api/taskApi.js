const API_URL = import.meta.env.VITE_API_URL;
const TASKS_API_URL = `${API_URL}/api/tasks/`;


async function readResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Task request failed");
  }

  return data;
}

async function authorizedRequest(url, options, accessToken, refreshAccessToken) {
  const sendRequest = (token) =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

  let response = await sendRequest(accessToken);

  if (response.status === 401 && refreshAccessToken) {
    const refreshedToken = await refreshAccessToken();
    response = await sendRequest(refreshedToken);
  }

  return response;
}

export async function getTasks(accessToken, refreshAccessToken) {
  const response = await authorizedRequest(
    TASKS_API_URL,
    {},
    accessToken,
    refreshAccessToken,
  );
  const data = await readResponse(response);

  return data.tasks;
}

export async function getTaskById(taskId, accessToken, refreshAccessToken) {
  const response = await authorizedRequest(
    `${TASKS_API_URL}${taskId}`,
    {},
    accessToken,
    refreshAccessToken,
  );
  const data = await readResponse(response);

  return data.task;
}

export async function createTask(taskData, accessToken, refreshAccessToken) {
  const response = await authorizedRequest(
    TASKS_API_URL,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(taskData),
    },
    accessToken,
    refreshAccessToken,
  );
  const data = await readResponse(response);

  return data.task;
}

export async function updateTask(taskId, taskData, accessToken, refreshAccessToken) {
  const response = await authorizedRequest(
    `${TASKS_API_URL}${taskId}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(taskData),
    },
    accessToken,
    refreshAccessToken,
  );
  const data = await readResponse(response);

  return data.task;
}

export async function deleteTask(taskId, accessToken, refreshAccessToken) {
  const response = await authorizedRequest(
    `${TASKS_API_URL}${taskId}`,
    { method: "DELETE" },
    accessToken,
    refreshAccessToken,
  );

  const data = await readResponse(response);

  return data.task;
}
