/* =========================================
   DAILY RECOMMENDED CARBON LIMIT
========================================= */
const DAILY_LIMIT = 10; // awareness limit (points)

/* =========================================
   SAVE DAILY ELECTRICITY DATA
========================================= */
function saveDaily() {
  const ac = Number(document.getElementById("ac")?.value || 0);
  const laptop = Number(document.getElementById("laptop")?.value || 1);
  const lights = Number(document.getElementById("lights")?.value || 1);

  const electricityScore = ac + laptop + lights;
  localStorage.setItem("electricity", electricityScore);

  window.location.href = "events.html";
}

/* =========================================
   SAVE EVENTS DATA
========================================= */
function saveEvent() {
  const attend = Number(document.getElementById("attend")?.value || 0);
  const venue = Number(document.getElementById("venue")?.value || 1);
  const duration = Number(document.getElementById("duration")?.value || 1);

  const eventScore = attend * (venue + duration);
  localStorage.setItem("events", eventScore);

  window.location.href = "transport.html";
}

/* =========================================
   SAVE TRANSPORT DATA
========================================= */
function saveTransport() {
  const mode = Number(document.getElementById("mode")?.value || 0);
  const distance = Number(document.getElementById("distance")?.value || 1);
  const trips = Number(document.getElementById("trips")?.value || 1);

  const transportScore = mode * distance * trips;
  localStorage.setItem("transport", transportScore);

  window.location.href = "dashboard.html";
}

/* =========================================
   DASHBOARD CHARTS
========================================= */
if (document.getElementById("pieChart")) {

  const electricity = Number(localStorage.getItem("electricity") || 0);
  const transport = Number(localStorage.getItem("transport") || 0);
  const events = Number(localStorage.getItem("events") || 0);

  // PIE CHART
  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["Electricity", "Transport", "Events"],
      datasets: [{
        data: [electricity, transport, events],
        backgroundColor: ["#42a5f5", "#ef5350", "#ffa726"]
      }]
    },
    options: {
      responsive: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });

  // BAR CHART
  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["Electricity", "Transport", "Events"],
      datasets: [{
        label: "Carbon Impact Level",
        data: [electricity, transport, events],
        backgroundColor: "#66bb6a"
      }]
    },
    options: {
      responsive: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

/* =========================================
   STATUS PAGE (USED + REMAINING + ALERT)
========================================= */
if (document.getElementById("total")) {

  const electricity = Number(localStorage.getItem("electricity") || 0);
  const transport = Number(localStorage.getItem("transport") || 0);
  const events = Number(localStorage.getItem("events") || 0);

  const used = electricity + transport + events;
  const remaining = Math.max(DAILY_LIMIT - used, 0);

  document.getElementById("total").innerText =
    `Daily Carbon Usage: ${used} / ${DAILY_LIMIT}`;

  const signal = document.getElementById("signal");

  if (used <= 5) {
    signal.innerText = `🟢 Low Impact | Remaining: ${remaining}`;
    signal.style.color = "green";
  }
  else if (used <= 8) {
    signal.innerText = `🟡 Medium Impact | Remaining: ${remaining}`;
    signal.style.color = "orange";
  }
  else {
    signal.innerText = `🔴 High Impact | Remaining: 0`;
    signal.style.color = "red";
  }
}

/* =========================================
   SMART MULTI-SUGGESTIONS (THRESHOLD BASED)
========================================= */
if (document.getElementById("suggestionBox")) {

  const electricity = Number(localStorage.getItem("electricity") || 0);
  const transport = Number(localStorage.getItem("transport") || 0);
  const events = Number(localStorage.getItem("events") || 0);

  const THRESHOLD = 4; // minimum impact to show suggestion
  let html = "";

  // ELECTRICITY SUGGESTION
  if (electricity >= THRESHOLD) {
    html += `
      <div class="suggestion-card">
        <h3>⚡ Electricity Usage</h3>
        <img src="https://c8.alamy.com/comp/2K1Y9RH/saving-energy-tips-unplug-appliances-when-not-in-use-and-switch-off-lights-2K1Y9RH.jpg">
        <p>
          Electricity usage is high today.
          Switch off unused appliances, reduce AC usage,
          and unplug chargers when not required.
        </p>
      </div>
    `;
  }

  // TRANSPORT SUGGESTION (walking = 0 → won’t trigger)
  if (transport >= THRESHOLD) {
    html += `
      <div class="suggestion-card">
        <h3>🚌 Daily Transport</h3>
        <img src="https://tse1.mm.bing.net/th/id/OIP.cDxuqaCVm5IJ8nrVGKlVMgHaFc?pid=Api&P=0&h=180">
        <p>
          Transport contributed significantly today.
          Prefer walking, cycling, or public transport
          instead of private vehicles when possible.
        </p>
      </div>
    `;
  }

  // EVENTS SUGGESTION
  if (events >= THRESHOLD) {
    html += `
      <div class="suggestion-card">
        <h3>🎓 Campus Events</h3>
        <img src="https://tse1.mm.bing.net/th/id/OIP.pZsEX5wqPd6Tq7zhrUksfwHaEa?pid=Api&P=0&h=180">
        <p>
          Events had a high carbon impact today.
          If possible, conduct events during daytime
          and in open areas to reduce lighting and cooling usage.
        </p>
      </div>
    `;
  }

  // If everything is low
  if (html === "") {
    html = `
      <div class="suggestion-card">
        <h3>🌱 Great Job!</h3>
        <p>
          Your carbon impact is low today.
          Continue following sustainable habits.
        </p>
      </div>
    `;
  }

  document.getElementById("suggestionBox").innerHTML = html;
}
