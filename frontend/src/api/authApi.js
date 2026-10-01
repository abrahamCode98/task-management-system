const AUTH_API_URL = "http://localhost:5000/api/auth";
let refreshRequest;

export async function readResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || " Authentication request failed");
  }

  return data;
}

export async function registerUser(userData) {
  const response = await fetch(`${AUTH_API_URL}/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const registerUserData = await readResponse(response);

  return registerUserData;
}

export async function loginUser(userData) {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const loginUserData = await readResponse(response);

  return {
    ...loginUserData,
    accessToken: loginUserData.token,
  };
}

export async function refreshToken() {
  if (!refreshRequest) {
    refreshRequest = fetch(`${AUTH_API_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(readResponse)
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

export async function getCurrentUser(accessToken) {
  const response = await fetch(`${AUTH_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return readResponse(response);
}

export async function logoutUser() {
    const response = await fetch(`${AUTH_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    await readResponse(response);

    return
};
