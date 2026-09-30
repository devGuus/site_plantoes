const API_BASE_URL = "http://26.180.187.243:8000";

const formState = document.getElementById("reset-state-form");
const successState = document.getElementById("reset-state-success");
const invalidState = document.getElementById("reset-state-invalid");
const invalidMessage = document.getElementById("reset-invalid-message");
const form = document.getElementById("reset-form");
const errorEl = document.getElementById("reset-error");
const submitBtn = document.getElementById("reset-submit");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm-password");

function showState(state) {
  formState.hidden = state !== "form";
  successState.hidden = state !== "success";
  invalidState.hidden = state !== "invalid";
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearError() {
  errorEl.hidden = true;
  errorEl.textContent = "";
}

function getTokenFromUrl() {
  return new URLSearchParams(window.location.search).get("token");
}

function setupPasswordToggles() {
  document.querySelectorAll(".reset-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      const willShow = target.type === "password";
      target.type = willShow ? "text" : "password";
      button.textContent = willShow ? "🙈" : "👁";
      button.setAttribute("aria-label", willShow ? "Ocultar senha" : "Mostrar senha");
    });
  });
}

async function requestPasswordReset(token, newPassword) {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    // corpo vazio ou não-JSON — segue com data nulo
  }

  if (!response.ok) {
    const detail = (data && (data.detail || data.message)) ||
      "Não foi possível redefinir a senha. Tente novamente.";
    throw new Error(detail);
  }
}

function initForm(token) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearError();

    const password = passwordInput.value;
    const confirm = confirmInput.value;

    if (password.length < 8) {
      showError("A senha precisa ter no mínimo 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      showError("As senhas não coincidem.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Redefinindo...";

    try {
      await requestPasswordReset(token, password);
      showState("success");
    } catch (error) {
      if (error instanceof TypeError) {
        // fetch rejeita com TypeError quando não consegue nem completar a requisição
        showError("Sem conexão com o servidor. Verifique sua internet e tente novamente.");
      } else if (/inválido|expirado/i.test(error.message)) {
        invalidMessage.textContent =
          "Este link de redefinição é inválido ou já expirou. Volte ao app e solicite um novo link.";
        showState("invalid");
      } else {
        showError(error.message);
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Redefinir senha";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupPasswordToggles();

  const token = getTokenFromUrl();
  if (!token) {
    invalidMessage.textContent =
      "Este link está incompleto. Volte ao app e solicite a redefinição de senha novamente.";
    showState("invalid");
    return;
  }

  showState("form");
  initForm(token);
});
