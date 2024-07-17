const form = document.querySelector("form");

console.log(form);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);

  const password = data.get("password");
  const email = data.get("email");
  const login = data.get("login");
  console.log(password, email, login);
  const result = await fetch("/api/auth/registration", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      password,
      email,
      login,
    }),
  });
  const res = await result.json()
  alert("Привет!!!!" + res.user.login)
});
