export async function fetchCSRF() {
  await fetch("http://localhost:8000/users/csrf_cookie", {
    credentials: "include",
  });
}
export function getCookie(name) {
  console.log(document.cookie);

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  console.log(cookieValue?.split("=")[1]);

  return cookieValue?.split("=")[1];
}

// export function getCookie(name) {
//   const matches = document.cookie.match(
//     new RegExp("(^| )" + name + "=([^;]+)")
//   );
//   console.log(matches);

//   return matches ? matches[2] : null;
// }

export async function register(username, password, password2) {
  await fetchCSRF();
  const res = await fetch("http://localhost:8000/users/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ username, password, password2 }),
  });
  return res;
}

export async function login(username, password) {
  await fetchCSRF();
  const res = await fetch("http://localhost:8000/users/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
    body: JSON.stringify({ username, password }),
  });
  return res;
}

export async function me() {
  return await fetch("http://localhost:8000/users/me", {
    credentials: "include",
  });
}

export async function logout() {
  await fetch("http://localhost:8000/users/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Content-Type": "application/json",
    },
  });
}
