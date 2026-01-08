/* =====================
   FIREBASE CONFIG
===================== */
const firebaseConfig = {
  apiKey: "AIzaSyACroio1Xvsd24hYfwHI30XZH36uHexd9A",
  authDomain: "carbon-emission-tracker-16f89.firebaseapp.com",
  projectId: "carbon-emission-tracker-16f89",
  storageBucket: "carbon-emission-tracker-16f89.appspot.com",
  messagingSenderId: "784942251390",
  appId: "1:784942251390:web:d2b5b61e79d03c528b072f"
};


/* =====================
   INIT FIREBASE (SAFE)
===================== */
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log("Auth persistence set to LOCAL");
  })
  .catch((error) => {
    console.error(error);
  });


/* =====================
   LOGIN
===================== */
function login() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const msg = document.getElementById("msg");

  msg.style.color = "red";
  msg.innerText = "";

  // BASIC CHECK
  if (!email || !password) {
    msg.innerText = "Please enter email and password.";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      // LOGIN SUCCESS
      window.location.href = "index1.html";
    })
    .catch((error) => {

      // ✅ STUDENT-FRIENDLY MESSAGES
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        msg.innerText =
          "This email is not registered. Please create an account first.";
      }
      else if (error.code === "auth/wrong-password") {
        msg.innerText = "Incorrect password. Please try again.";
      }
      else if (error.code === "auth/invalid-email") {
        msg.innerText = "Please enter a valid email address.";
      }
      else {
        msg.innerText = "Login failed. Please try again.";
      }
    });
}

/* =====================
   SIGN UP (CREATE ACCOUNT)
===================== */
function createAccount() {
  const msg = document.getElementById("msg");
  msg.style.color = "red";
  msg.innerText = "";

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const confirmPassword =
    document.getElementById("confirmPassword")?.value.trim() || "";

  // EMAIL CHECK
  if (!email || !email.includes("@")) {
    msg.innerText = "Please enter a valid email address.";
    return;
  }

  // PASSWORD CHECK
  if (!password || password.length < 6) {
    msg.innerText = "Password must be at least 6 characters.";
    return;
  }

  // CONFIRM PASSWORD CHECK
  if (confirmPassword && password !== confirmPassword) {
    msg.innerText = "Passwords do not match.";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      msg.style.color = "green";
      msg.innerText = "Account created successfully!";

      setTimeout(() => {
        window.location.href = "index1.html"; // login page
      }, 1200);
    })
    .catch(() => {
      msg.innerText = "Account creation failed. Try again.";
    });
}

/* =====================
   EXPOSE FUNCTIONS
===================== */
window.login = login;
window.createAccount = createAccount;
