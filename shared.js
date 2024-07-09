// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, deleteDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtg-_5eLD-Prs74zTnCj4HjQQfnssdfP8",
  authDomain: "fivepushups-d5d82.firebaseapp.com",
  projectId: "fivepushups-d5d82",
  storageBucket: "fivepushups-d5d82.appspot.com",
  messagingSenderId: "472818589501",
  appId: "1:472818589501:web:ef6402c4e19842c0e86f54",
  measurementId: "G-TJ5VSMC86Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized");

async function toggleCheck(cell, name, dateString) {
  const checkMark = cell.querySelector("span");
  const docRef = doc(db, "pushups", `${name}_${dateString.replace(/\//g, '-')}`);

  if (checkMark) {
    // Remove checkmark
    await deleteDoc(docRef);
    cell.innerHTML = '<input type="checkbox">';
    cell.classList.remove("completed");
  } else {
    // Add checkmark
    const timestamp = new Date().toLocaleString();
    await setDoc(docRef, {
      name: name,
      date: dateString,
      timestamp: timestamp
    });
    cell.innerHTML = `<span>✅</span><div class="timestamp">Confirmed at: ${timestamp}</div>`;
    cell.classList.add("completed");
  }
}

async function confirmCheck(cell, name, dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(dateString);

  if (checkDate.toDateString() !== today.toDateString()) {
    alert("You can only check off today's date.");
    return;
  }

  await toggleCheck(cell, name, dateString);
}

function generateTable(startDate, endDate) {
  const table = document.getElementById("pushup-tracker");
  if (!table) {
    console.error("Table element not found");
    return;
  }

  const players = [
    { name: "Adam", idPrefix: "adam" },
    { name: "Colin", idPrefix: "colin" },
    { name: "Colm", idPrefix: "colm" },
    { name: "Jamie", idPrefix: "jamie" },
    { name: "JP", idPrefix: "jp" },
    { name: "Leo", idPrefix: "leo" },
    { name: "Mark", idPrefix: "mark" },
    { name: "Mervyn", idPrefix: "mervyn" },
    { name: "Nathan", idPrefix: "nathan" },
    { name: "Patrick", idPrefix: "patrick" },
    { name: "Seamus", idPrefix: "seamus" },
    { name: "Steve H", idPrefix: "steveh" },
    { name: "Steve J", idPrefix: "stevej" },
    { name: "Victor", idPrefix: "victor" }
  ];

  const dates = generateDateRange(startDate, endDate);

  const headerRow = table.querySelector("thead tr");
  if (!headerRow) {
    console.error("Header row not found");
    return;
  }

  dates.forEach(date => {
    const parts = date.split("/");
    const formattedDate = `${parseInt(parts[1], 10)}/${parseInt(parts[0], 10)}`;
    const th = document.createElement("th");
    th.textContent = formattedDate;
    headerRow.appendChild(th);
  });

  const tbody = table.querySelector("tbody");
  if (!tbody) {
    console.error("Table body not found");
    return;
  }

  players.forEach(player => {
    const row = document.createElement("tr");
    const playerName = document.createElement("td");
    playerName.textContent = player.name;
    row.appendChild(playerName);

    dates.forEach(date => {
      const [month, day, year] = date.split("/");
      const cellId = `${player.idPrefix}-${month}-${day}-${year}`;
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = cellId;
      checkbox.onclick = () => toggleCheck(checkbox.parentElement, player.name, date);
      const td = document.createElement("td");
      td.id = cellId;
      td.appendChild(checkbox);
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  disableFutureDates();
  markMissedDates();
  loadData();
}

function disableFutureDates() {
  const today = new Date();
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    const [_, month, day, year] = checkbox.id.split("-");
    const checkDate = new Date(`${month}/${day}/${year}`);

    if (checkDate > today) {
      checkbox.disabled = true;
    }
  });
}

function markMissedDates() {
  const today = new Date();
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    const [_, month, day, year] = checkbox.id.split("-");
    const checkDate = new Date(`${month}/${day}/${year}`);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (checkDate.toDateString() === yesterday.toDateString() && !checkbox.checked) {
      const xMark = document.createElement("span");
      xMark.textContent = "ｘ";
      xMark.classList.add("not-checked");
      xMark.onclick = () => {
        alert("You can only check off today's date.");
      };
      checkbox.parentElement.replaceChild(xMark, checkbox);
    }
  });
}

function generateDateRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    dates.push(`${month}/${day}/${year}`);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

async function loadData() {
  const querySnapshot = await getDocs(collection(db, "pushups"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const name = data.name;
    const date = data.date;
    const timestamp = data.timestamp;

    const formattedDate = date.replace(/\//g, '-');
    const cellId = `${name.toLowerCase()}-${formattedDate}`;
    const cell = document.getElementById(cellId);

    if (cell) {
      cell.innerHTML = `<span>✅</span><div class="timestamp">Confirmed at: ${timestamp}</div>`;
      cell.classList.add("completed");
    }
  });
}

export { db, toggleCheck, confirmCheck, generateTable, disableFutureDates, markMissedDates, generateDateRange, loadData };
