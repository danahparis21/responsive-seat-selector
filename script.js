document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".seat-container .seat.selected").forEach(seat => {
    seat.classList.remove("selected");
  });
  
  const rowLetters = "ABCDEFGHIJKLMNO".split("");
  let globalRowIndex = 0; // (A, B, C...)

 
  const seatRows = document.querySelectorAll(".seat-row");

  seatRows.forEach((seatRow) => {
   
    const subblocks = seatRow.querySelectorAll(".seat-subblock");
    const numRowsInBlock = parseInt(subblocks[0].dataset.rows); 
   
    for (let r = 0; r < numRowsInBlock; r++) {
      const rowLetter = rowLetters[globalRowIndex + r];
      let seatNumberOffset = 0; 

     
      subblocks.forEach((subblock) => {
        const cols = parseInt(subblock.dataset.cols);
        
        const rowSegment = document.createElement("div");
        rowSegment.style.display = "grid";
        rowSegment.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        rowSegment.style.gap = "5px"; // Keep the gap consistent

        for (let c = 0; c < cols; c++) {
          const seatNumber = seatNumberOffset + c + 1;
          const seatLabel = `${rowLetter}${seatNumber}`;

          const seat = document.createElement("div");
          seat.classList.add("seat");
          seat.textContent = seatLabel; 
          seat.setAttribute("data-seat", seatLabel);

          seat.addEventListener("click", () => {
            if (!seat.classList.contains("occupied")) {
              seat.classList.toggle("selected");
              updateSelectedSeats();
            }
          });

          rowSegment.appendChild(seat);
        }
      
        subblock.appendChild(rowSegment);
        
     
        seatNumberOffset += cols;
      });
    }

   
    globalRowIndex += numRowsInBlock;
  });

  // display the list of selected seats
  function updateSelectedSeats() {
    const selectedSeats = document.querySelectorAll(".seat-container .seat.selected");

    const seatListSpan = document.getElementById("seat-list");
    
    if (selectedSeats.length === 0) {
      seatListSpan.textContent = "None";
    } else {
      const seatLabels = Array.from(selectedSeats)
      .map(seat => (seat.dataset.seat || "").trim())
      .filter(Boolean); 
      seatListSpan.textContent = seatLabels.join(", ");
    }
  }

  const occupiedSeats = ["A5", "C12", "D1", "F8", "K16"]; 
  occupiedSeats.forEach(seatLabel => {
    const seat = document.querySelector(`[data-seat="${seatLabel}"]`);
    if (seat) {
      seat.classList.add("occupied");
    }
  });
});

const pricePerSeat = 14.99;
const confirmModal = document.getElementById("confirm-modal");
const confirmText = document.getElementById("confirm-text");
const showConfirmBtn = document.getElementById("show-confirm");
const cancelBtn = document.getElementById("cancel-btn");
const confirmBtn = document.getElementById("confirm-btn");

let finalConfirmedSeats = [];

showConfirmBtn.addEventListener("click", () => {
  const selectedSeats = [...document.querySelectorAll(".seat-container .seat.selected")];
  console.log("Selected seats:", selectedSeats);

  if (selectedSeats.length === 0) {
    showToast("Please select at least one seat.");

    return;
  }

  const seatLabels = selectedSeats
  .map(seat => (seat.dataset.seat || "").trim())
  .filter(label => label !== "");

const total = (seatLabels.length * pricePerSeat).toFixed(2);

confirmText.innerHTML = `
<br>
  <strong>You have selected seat(s):</strong> ${seatLabels.join(", ")}<br>
  <hr style="margin: 10px 0;">
  <strong>Total:</strong> $${total}
`;

confirmModal.style.display = "flex";
});


cancelBtn.addEventListener("click", () => {
  confirmModal.style.display = "none";
});

confirmBtn.addEventListener("click", () => {
  const selectedSeats = [...document.querySelectorAll(".seat-container .seat.selected")];
  const seatLabels = selectedSeats.map(seat => seat.getAttribute("data-seat"));

  // Mark as occupied
  seatLabels.forEach(label => {
    const seat = document.querySelector(`[data-seat="${label}"]`);
    if (seat) {
      seat.classList.remove("selected");
      seat.classList.add("occupied");
    }
    confirmModal.style.display = "none";
  });

  finalConfirmedSeats.push(...seatLabels); // Store in array
  updateSelectedSeats(); // Update UI
  confirmModal.style.display = "none";
  console.log("Confirmed seats:", finalConfirmedSeats);
});

//drag scroll
const wrapper = document.querySelector('.seat-scroll-wrapper');
let isDown = false;
let startX;
let scrollLeft;

wrapper.addEventListener('mousedown', (e) => {
  isDown = true;
  wrapper.classList.add('active');
  startX = e.pageX - wrapper.offsetLeft;
  scrollLeft = wrapper.scrollLeft;
});
wrapper.addEventListener('mouseleave', () => {
  isDown = false;
  wrapper.classList.remove('active');
});
wrapper.addEventListener('mouseup', () => {
  isDown = false;
  wrapper.classList.remove('active');
});
wrapper.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - wrapper.offsetLeft;
  const walk = (x - startX) * 2; // scroll speed
  wrapper.scrollLeft = scrollLeft - walk;
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); 
}

let scale = 1;
const zoomwrapper = document.getElementById('zoomable-wrapper');
const container = document.getElementById('seat-container');

let startDistance = null;

zoomwrapper.addEventListener('touchstart', function (e) {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    startDistance = Math.hypot(dx, dy);
  }
}, { passive: false });

zoomwrapper.addEventListener('touchmove', function (e) {
  if (e.touches.length === 2 && startDistance !== null) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.hypot(dx, dy);
    const zoomFactor = currentDistance / startDistance;

    scale = Math.min(Math.max(zoomFactor, 0.5), 2); // limit between 0.5 and 2
    container.style.transform = `scale(${scale})`;
  }
}, { passive: false });

zoomwrapper.addEventListener('touchend', function (e) {
  if (e.touches.length < 2) {
    startDistance = null;
  }
});

document.querySelector(".container h1").addEventListener("click", () => {
  alert("Title tapped!");
});
