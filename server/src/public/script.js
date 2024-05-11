const getById = (id) => {
  return document.getElementById(id);
};

const error = getById("error");
const success = getById("success");
const password = getById("password");
const confirmPassword = getById("confirm-password");
const loader = getById("loader");
const container = getById("container");
const form = getById("form");
const button = getById("submit");

error.style.display = "none";
success.style.display = "none";
container.style.display = "none";

let token, userId;
const passReg1 = /^(?=.*[a-z])/;
const passReg2 = /^(?=.*[A-Z])/;
const passReg3 = /^(?=.*[0-9])/;
const passReg4 = /^(?=.*[!@#\$%\^&\*])/;

window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  token = params.token;
  userId = params.userId;

  const res = await fetch("/auth/verify-password-reset-token", {
    method: "POST",
    body: JSON.stringify({ token, userId }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  if (!res.ok) {
    const { error } = await res.json();
    loader.innerText = error;
    // console.log(error);
    return;
  }
  loader.style.display = "none";
  container.style.display = "block";
});

const displayError = (errorMsg) => {
  success.style.display = "none";
  error.style.display = "block";
  error.innerText = errorMsg;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!password.value.trim() || !confirmPassword.value.trim()) {
    return displayError("Please fill in all fields");
  }
  if (password.value.trim() != confirmPassword.value.trim()) {
    return displayError("Password and confirm password must be same.");
  }
  if (
    !passReg1.test(password.value.trim()) ||
    !passReg2.test(password.value.trim()) ||
    !passReg3.test(password.value.trim()) ||
    !passReg4.test(password.value.trim())
  ) {
    return displayError(
      "Please enter a stronger password containing letters,numbers and special characters."
    );
  }

  //   Validations passed ; SUBMIT to route

  button.disabled = true;
  button.innerText = "Updating...";

  const res = await fetch("/auth/update-password", {
    method: "POST",
    body: JSON.stringify({ token, userId, password: password.value.trim() }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  button.disabled = true;
  button.innerText = "Reset Password";

  if (!res.ok) {
    const { error } = await res.json();
    return displayError(error);
  }

  success.style.display = "block";
  error.style.display = "none";
  success.innerText =
    "Password updated successfully. You can now login with your new password.";
  password.value = "";
  confirmPassword.value = "";
};

form.addEventListener("submit", handleSubmit);

// NOTES : Difference between innerText, innerHTML and textContent

// innerText returns the visible text contained within an element, excluding the text of any child elements.
// It respects CSS styling and will not return the text of elements that are hidden with CSS.
// It is not supported in Firefox before version 45 and is not part of the W3C DOM specification.
// innerHTML:

// innerHTML returns the HTML content of an element, including any child elements.
// It can be used to both read and write HTML content.
// Modifying innerHTML can be a security risk if the content is not properly sanitized because it allows the injection of script tags and potentially harmful content.
// textContent:

// textContent returns the text content of an element and all its descendants, regardless of styling or visibility.
// It returns only the textual content, without any HTML markup.
// It's usually faster than innerText because it doesn't have to worry about styling or layout.
// textContent is generally preferred when you only need the text content of an element and don't care about HTML structure or formatting.
