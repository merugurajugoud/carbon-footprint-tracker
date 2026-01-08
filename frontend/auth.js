// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyACroio1Xvsd24hYfwHI30XZH36uHexd9A",
  authDomain: "carbon-emission-tracker-16f89.firebaseapp.com",
  projectId: "carbon-emission-tracker-16f89",
  storageBucket: "carbon-emission-tracker-16f89.appspot.com",
  messagingSenderId: "784942251390",
  appId: "1:784942251390:web:d2b5b61e79d03c528b072f"
};

// Init Firebase (safe)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const msg = document.getElementById("msg");

/* =====================*/
function login() {
  msg.style.color = "red";
  msg.innerText = "";

  const email = emailValue();
  const password = passwordValue();

  if (!email || !password) {
    msg.innerText = "Please enter email and password.";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(() => {
    window.location.href = "index1.html";
  })
  .catch(() => {
    msg.innerText =
      "Please enter a valid email and a password with at least 6 characters.";
  });

}



/* =====================
   SIGN UP (CREATE ACCOUNT)
===================== */
function createAccount() {
  msg.innerText = ""; // clear old message

  const email = emailValue();
  const password = passwordValue();
  const confirmPasswordInput =
    document.getElementById("confirmPassword");

  const confirmPassword = confirmPasswordInput
    ? confirmPasswordInput.value.trim()
    : "";

  // ✅ EMAIL CHECK
  if (!email.includes("@")) {
    msg.innerText = "Please enter a valid email address.";
    return;
  }

  // ✅ PASSWORD LENGTH
  if (password.length < 6) {
    msg.innerText = "Password must be at least 6 characters.";
    return;
  }

  // ✅ CONFIRM PASSWORD (only if field exists)
  if (confirmPasswordInput && password !== confirmPassword) {
    msg.innerText = "Passwords do not match.";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      msg.style.color = "green";
      msg.innerText = "Account created successfully!";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    })
    .catch(() => {
      msg.innerText = "Account creation failed. Try again.";
    });
}

/* =====================
   HELPERS
===================== */
function emailValue() {
  return document.getElementById("email")?.value.trim() || "";
}

function passwordValue() {
  return document.getElementById("password")?.value.trim() || "";
}

/* =====================
   EXPOSE TO HTML
===================== */
window.login = login;
window.createAccount = createAccount;
