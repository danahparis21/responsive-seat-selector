document.querySelectorAll(".seat-subblock").forEach((subblock) => {
  const cols = parseInt(subblock.dataset.cols);
  const rows = parseInt(subblock.dataset.rows);

  subblock.style.display = "grid";
  subblock.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.addEventListener("click", () => {
        if (!seat.classList.contains("occupied")) {
          seat.classList.toggle("selected");
          updateSelectedSeats();
        }
      });
      subblock.appendChild(seat);
    }
  }
});

function updateSelectedSeats() {
  const selected = document.querySelectorAll(".seat.selected");
  const seatList = document.getElementById("seat-list");

  if (selected.length === 0) {
    seatList.textContent = "None";
  } else {
    seatList.textContent = `${selected.length} seat(s)`;
  }
}
