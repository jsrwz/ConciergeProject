const form = document.querySelector(".myReservationsForm");
const myReservationTable = document.getElementById("reservationTable");

form.addEventListener("submit", (event) => {
  event.preventDefault(); 

  const name = form.reservationName.value;
  const roomNumber = form.reservationRoomNumber.value;

  fetch(`/reservations/${name}/${roomNumber}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      updateMyReservationTable(data.reservations);
    })
    .catch((error) => {
      console.error("Error fetching reservations: ", error);
    });
});

// making the table with the update
function updateMyReservationTable(reservations) {
  const tbody = myReservationTable.querySelector("tbody");
  tbody.innerHTML = "";
  if (reservations.length > 0) {
    reservations.forEach((reservation) => {
      const row = tbody.insertRow();
      row.innerHTML = `
            <td>${reservation.id}</td>
            <td>${reservation.roomNumber}</td>
            <td>${reservation.name}</td>
            <td>${reservation.type}</td>
            <td>${reservation.tarih}</td>
            <td>${reservation.saat}</td>
            <td>${reservation.destination}</td>
            <td>${reservation.not}</td>
            <td>${reservation.status}</td>
            `;
    });
  } else {
    console.warn("Reservations array is empty.");
  }
}
