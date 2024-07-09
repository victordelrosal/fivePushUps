// ... Firebase configuration and initialization ...

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

// ... generateTable, disableFutureDates, markMissedDates, generateDateRange ...

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
