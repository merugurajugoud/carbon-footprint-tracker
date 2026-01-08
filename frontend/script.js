/* =================================================
   FIREBASE (COMPAT MODE – NO IMPORTS)
================================================= */

const DAILY_LIMIT = 10;

/* ---------------- ELECTRICITY ---------------- */
function saveDaily() {
  const ac = Number(document.getElementById("ac")?.value || 0);
  const laptop = Number(document.getElementById("laptop")?.value || 1);
  const lights = Number(document.getElementById("lights")?.value || 1);

  localStorage.setItem("electricity", ac + laptop + lights);
  window.location.href = "events.html";
}

/* ---------------- EVENTS ---------------- */
function handleEventChoice() {
  const attend = document.getElementById("attend").value;
  const eventDetails = document.getElementById("eventDetails");
  const nextBtn = document.getElementById("nextEventBtn");

  if (attend === "0") {
    eventDetails.style.display = "none";
    nextBtn.style.display = "block";
    localStorage.setItem("events", 0);
  }

  if (attend !== "0") {
    eventDetails.style.display = "block";
    nextBtn.style.display = "block";
  }
}

function saveEvent() {
  const attend = Number(document.getElementById("attend")?.value || 0);

  if (attend === 0) {
    localStorage.setItem("events", 0);
    window.location.href = "transport.html";
    return;
  }

  const venue = Number(document.getElementById("venue")?.value || 1);
  const duration = Number(document.getElementById("duration")?.value || 1);

  localStorage.setItem("events", attend * (venue + duration));
  window.location.href = "transport.html";
}

/* =================================================
   TRANSPORT + GOOGLE MAPS
================================================= */

let singleTripDistance = 0;

/* 🔴 MAIN FIX IS HERE */
function handleTravelChoice() {
  const travelSelect = document.getElementById("travelToday");
  const travelSection = document.getElementById("travelSection");
  const noTravelBtn = document.getElementById("noTravelBtn");

  if (!travelSelect) return;

  // reset UI
  travelSection.style.display = "none";
  noTravelBtn.style.display = "none";

  if (travelSelect.value === "yes") {
    travelSection.style.display = "block";
  }

  if (travelSelect.value === "no") {
    localStorage.setItem("transport", 0);
    noTravelBtn.style.display = "block";
  }
}

function saveNoTravel() {
  saveToFirebase();
  window.location.href = "dashboard.html";
}

function saveTransport() {
  const mode = Number(document.getElementById("mode")?.value || 0);
  const trips = Number(document.getElementById("trips")?.value || 1);

  if (singleTripDistance === 0) {
    alert("Please calculate distance first");
    return;
  }

  const totalDistance = singleTripDistance * trips;
  const transportImpact = mode * totalDistance;

  localStorage.setItem("transport", transportImpact);
  saveToFirebase();
  window.location.href = "dashboard.html";
}

function calculateDistance() {
  const from = document.getElementById("from")?.value;
  const to = document.getElementById("to")?.value;
  const trips = Number(document.getElementById("trips")?.value || 1);

  if (!from || !to) {
    alert("Please enter both locations");
    return;
  }

  const service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [from],
      destinations: [to],
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        singleTripDistance =
          response.rows[0].elements[0].distance.value / 1000;

        document.getElementById("distanceResult").innerText =
          `Total Distance: ${(singleTripDistance * trips).toFixed(2)} km`;
      }
    }
  );
}

/* =================================================
   GOOGLE PLACES
================================================= */
function initAutocomplete() {
  const from = document.getElementById("from");
  const to = document.getElementById("to");
  if (!from || !to) return;

  new google.maps.places.Autocomplete(from, { componentRestrictions: { country: "in" } });
  new google.maps.places.Autocomplete(to, { componentRestrictions: { country: "in" } });
}/* ================================
   DASHBOARD CHART SCRIPT (CLEAN)
   Box Plot REMOVED
================================ */

let chartInstance = null;

// ✅ ONE PLACE COLORS (labels + charts ki same)
const LABELS = ["Electricity", "Transport", "Events"];
const COLORS = ["#42a5f5", "#ef5350", "#ffa726"]; 
// Electricity → Blue
// Transport   → Red
// Events      → Orange

function renderChart(type = "bar") {
  const electricity = Number(localStorage.getItem("electricity") || 0);
  const transport = Number(localStorage.getItem("transport") || 0);
  const events = Number(localStorage.getItem("events") || 0);

  const canvas = document.getElementById("pieChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  let chartType = type;

  let dataConfig = {
    labels: LABELS,
    datasets: [{
      label: "Carbon Contribution",
      data: [electricity, transport, events],
      backgroundColor: COLORS,     // ✅ SAME COLORS
      borderColor: COLORS,         // ✅ SAME COLORS
      borderWidth: 2
    }]
  };

  /* ===== LINE ===== */
  if (chartType === "line") {
    dataConfig.datasets[0].fill = false;
    dataConfig.datasets[0].tension = 0.4;
  }

  /* ===== SCATTER ===== */
  if (chartType === "scatter") {
    chartType = "scatter";
    dataConfig = {
      datasets: [
        {
          label: "Electricity",
          backgroundColor: COLORS[0],
          data: [{ x: 1, y: electricity }]
        },
        {
          label: "Transport",
          backgroundColor: COLORS[1],
          data: [{ x: 2, y: transport }]
        },
        {
          label: "Events",
          backgroundColor: COLORS[2],
          data: [{ x: 3, y: events }]
        }
      ]
    };
  }

  chartInstance = new Chart(ctx, {
    type: chartType,
    data: dataConfig,
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#2f3e46",
            font: {
              size: 16,
              weight: "500"
            }
          }
        },
        title: {
          display: true,
          text: "Carbon Impact Dashboard",
          color: "#1b5e20",
          font: {
            size: 20,
            weight: "600"
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      },

      scales: chartType === "scatter"
        ? {
            x: {
              type: "linear",
              min: 0.5,
              max: 3.5,
              ticks: {
                color: "#37474f",
                font: {
                  size: 15,
                  weight: "500"
                },
                callback: value => {
                  if (value === 1) return "Electricity";
                  if (value === 2) return "Transport";
                  if (value === 3) return "Events";
                  return "";
                }
              },
              grid: {
                color: "rgba(0,0,0,0.05)"
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: "#37474f",
                font: {
                  size: 15,
                  weight: "500"
                }
              },
              grid: {
                color: "rgba(0,0,0,0.05)"
              }
            }
          }
        : {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#37474f",
                font: {
                  size: 15,
                  weight: "500"
                }
              },
              grid: {
                color: "rgba(0,0,0,0.05)"
              }
            },
            x: {
              ticks: {
                color: "#37474f",
                font: {
                  size: 15,
                  weight: "500"
                }
              },
              grid: {
                color: "rgba(0,0,0,0.05)"
              }
            }
          }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const chartSelect = document.getElementById("chartType");
  if (!chartSelect) return;

  renderChart(chartSelect.value);

  chartSelect.addEventListener("change", e => {
    renderChart(e.target.value);
  });
});


/* =================================================
   FIREBASE SAVE
================================================= */
function saveToFirebase() {
  if (!window.db) return;

  window.db.collection("carbon_logs").add({
    electricity: Number(localStorage.getItem("electricity") || 0),
    transport: Number(localStorage.getItem("transport") || 0),
    events: Number(localStorage.getItem("events") || 0),
    total:
      Number(localStorage.getItem("electricity") || 0) +
      Number(localStorage.getItem("transport") || 0) +
      Number(localStorage.getItem("events") || 0),
    createdAt: new Date()
  });
}

/* =================================================
   EXPOSE FUNCTIONS
================================================= */
window.saveDaily = saveDaily;
window.saveEvent = saveEvent;
window.handleEventChoice = handleEventChoice;
window.handleTravelChoice = handleTravelChoice;
window.saveNoTravel = saveNoTravel;
window.saveTransport = saveTransport;
window.calculateDistance = calculateDistance;
window.initAutocomplete = initAutocomplete;
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("pieChart")) {
    renderChart("bar"); // default chart
  }
});
window.renderChart = renderChart;
document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("suggestionBox");
  if (!box) return;

  const e = Number(localStorage.getItem("electricity") || 0);
  const t = Number(localStorage.getItem("transport") || 0);
  const ev = Number(localStorage.getItem("events") || 0);

  let html = "";

  if (e >= 4) html += `<div class="suggestion-card"><h3>⚡ Electricity</h3><p>Reduce unnecessary electricity usage by limiting AC usage, switching off lights, fans, and charging devices when not required. Small daily savings can significantly reduce campus carbon emissions..</p></div>`;
  if (t >= 4) html += `<div class="suggestion-card"><h3>🚌 Transport</h3><p>Choose public transport, walking, or cycling whenever possible. Reducing private vehicle usage helps lower fuel consumption and decreases daily carbon emissions on campus</p></div>`;
  if (ev >= 4) html += `<div class="suggestion-card"><h3>🎓 Events</h3><p>Organize events during daytime and prefer open or naturally ventilated spaces. This minimizes the need for artificial lighting and cooling, reducing overall energy consumption.</p></div>`;

  if (!html) {
    html = `<div class="suggestion-card"><h3>🌱 Great Job!</h3><p>Your impact is low.</p></div>`;
  }

  box.innerHTML = html;
});
document.addEventListener("DOMContentLoaded", () => {
  renderChart("pie");
});

document.getElementById("chartType")?.addEventListener("change", e => {
  renderChart(e.target.value);
});
document.addEventListener("DOMContentLoaded", () => {
  const electricity = Number(localStorage.getItem("electricity") || 0);
  const transport = Number(localStorage.getItem("transport") || 0);
  const events = Number(localStorage.getItem("events") || 0);

  const sources = [
    {
      name: "Electricity",
      value: electricity,
      img: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
      text: "High electricity usage from ACs, fans, or devices has significantly increased today’s carbon footprint."
    },
    {
      name: "Transport",
      value: transport,
      img: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
      text: "Frequent travel using fuel-based transport has contributed heavily to carbon emissions today."
    },
    {
      name: "Events",
      value: events,
      img: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
      text: "Indoor or long-duration events have added notable carbon impact due to lighting and cooling usage."
    }
  ];

  // 🔥 Sort by emission (high → low)
  sources.sort((a, b) => b.value - a.value);

  // 🔥 Pick top 2 contributors (value > 0)
  const topSources = sources.filter(s => s.value > 0).slice(0, 2);

  const imgContainer = document.getElementById("impactImages");
  const textContainer = document.getElementById("impactText");

  if (!imgContainer || !textContainer) return;

  imgContainer.innerHTML = "";
  textContainer.innerHTML = "";

  // 🖼️ Show images
  topSources.forEach(src => {
    const img = document.createElement("img");
    img.src = src.img;
    img.alt = src.name;
    img.style.width = "120px";
    img.style.height = "auto";
    imgContainer.appendChild(img);
  });

  // 📝 Build explanation text
  if (topSources.length === 1) {
    textContainer.innerHTML = `
      <strong>${topSources[0].name}</strong> is the primary contributor to your carbon emissions today.
      ${topSources[0].text}
    `;
  } else if (topSources.length === 2) {
    textContainer.innerHTML = `
      Today’s carbon emissions are mainly influenced by
      <strong>${topSources[0].name}</strong> and <strong>${topSources[1].name}</strong>.
      ${topSources[0].text} Additionally, ${topSources[1].text}
      <br><br>
      Consider choosing low-impact alternatives for the rest of the day.
    `;
  }
});
/* =================================================
   STATUS PAGE – NEAT SMALL IMAGES (NO ICONS)
   (ADD ONLY – existing code untouched)
================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const electricity = Number(localStorage.getItem("electricity") || 0);
  const transport   = Number(localStorage.getItem("transport") || 0);
  const events      = Number(localStorage.getItem("events") || 0);

  // Find highest contributor
  let mainSource = "electricity";
  let maxVal = electricity;

  if (transport > maxVal) {
    mainSource = "transport";
    maxVal = transport;
  }
  if (events > maxVal) {
    mainSource = "events";
    maxVal = events;
  }

  // Target image element in status.html
  const img = document.getElementById("impactImg");
  if (!img) return;

  // Set image based on highest impact
  if (mainSource === "electricity") {
    img.src =
      "https://www.goldmedalindia.com/blog/wp-content/uploads/2023/05/Which-home-appliances-use-the-most-electricity-new.jpg";
  } else if (mainSource === "transport") {
    img.src =
      "https://tse1.mm.bing.net/th/id/OIP.RtOegukht7pUKb4s_qSyxQHaHa?pid=Api&P=0&h=180";
  } else {
    img.src =
      "https://tse2.mm.bing.net/th/id/OIP.OoCyK8oHShCVC4ihRkSgZgHaES?pid=Api&P=0&h=180";
  }

  // 🔥 Force SMALL & NEAT size (JS side – no CSS conflict)
  img.style.width = "70px";
  img.style.height = "70px";
  img.style.objectFit = "cover";
  img.style.borderRadius = "8px";
});

function forgotPassword() {
  const email = document.getElementById("email")?.value.trim();
  const msg = document.getElementById("msg");

  msg.style.color = "red";
  msg.innerText = "";

  if (!email || !email.includes("@")) {
    msg.innerText = "Please enter your registered email address.";
    return;
  }

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      msg.style.color = "green";
      msg.innerText =
        "Password reset link sent to your email. Please check inbox.";
    })
    .catch(error => {
      msg.innerText = error.message;
    });
}

