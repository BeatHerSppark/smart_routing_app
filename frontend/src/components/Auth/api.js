export async function logout() {
  const response = await fetch("http://localhost:8000/users/logout", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

export function getCookie(name) {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  console.log(cookieValue?.split("=")[1]);

  return cookieValue?.split("=")[1];
}
