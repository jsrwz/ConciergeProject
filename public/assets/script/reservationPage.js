const reservationTable = document.getElementById("reservationTable")
const oldReservationTable = document.getElementById("oldReservationTable")
const showOldResButton = document.querySelector('.showOldRes')
const closeOldResButton = document.querySelector('.closeOldRes')
const showOld = document.querySelector('.showOld')
const openOld = document.querySelector('.openOld')
const closeOld = document.querySelector('.closeOld')

fetch("/reservations")
    .then( (res) => {
        if(!res.ok){
            throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
    })
    .then( (data) => {
        let newList = []
        data.reservations.forEach((reservation) => {
            if(reservation.status !== 'done'){
                newList.push(reservation)
            }
        })
        updateReservationTable(newList)
    })
    .catch( (error) => {
        console.error("Error fetching reservations: " , error)
    })


showOldResButton.addEventListener('click' , () => {
    showOld.classList.remove('hidden')
    openOld.classList.add('hidden')
    closeOld.classList.remove('hidden')
    fetch("/reservations")
    .then( (res) => {
        if(!res.ok){
            throw new Error(`HTTP error! Status: ${res.status}`)
        }
        return res.json()
    })
    .then( (data) => {
        let newOldList = []
        data.reservations.forEach((reservation) => {
            if(reservation.status == 'done'){
                newOldList.push(reservation)
            }
        })
        updateOldReservationTable(newOldList)
    })
    .catch( (error) => {
        console.error("Error fetching reservations: " , error)
    })
})

closeOldResButton.addEventListener('click' , () => {
    showOld.classList.add('hidden')
    openOld.classList.remove('hidden')
    closeOld.classList.add('hidden')
})



//making the done reservation table with the update 
function updateOldReservationTable(reservations){
    const tbody = oldReservationTable.querySelector("tbody")
    tbody.innerHTML = ""
    if(reservations.length > 0){
        reservations.forEach((reservation) => {
            const row = tbody.insertRow()
            row.innerHTML = `
            <td><input type="hidden" class="resId" value="${reservation.id}">${reservation.id}</td>
            <td>${reservation.roomNumber}</td>
            <td>${reservation.name}</td>
            <td>${reservation.type}</td>
            <td>${reservation.tarih}</td>
            <td>${reservation.saat}</td>
            <td>${reservation.destination}</td>
            <td>${reservation.not}</td>
            <td>
                <div class="form-group">
                    <select class="form-control statusSelect" id="statusSelect" name="status">
                        <option value="waiting" ${reservation.status === 'waiting' ? 'selected' : ''}>Waiting</option>
                        <option value="accepted" ${reservation.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                        <option value="done" ${reservation.status === 'done' ? 'selected' : ''}>Done</option>
                    </select>            
                </div>
            </td>
            <td>
                <button class="oldResEditButton">Düzenle</button>
            </td>
            `
        })
        const oldResEditButtons = document.querySelectorAll('.oldResEditButton');
        oldResEditButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const row = event.target.closest('tr');
                const reservationId = row.querySelector('.resId').value;
                const newStatus = row.querySelector('.statusSelect').value;
                console.log(reservationId, newStatus)
                updateStatusInDatabase(reservationId, newStatus);
            });
        });
    } else {
        console.warn("Reservations array is empty.")
    }
}
//making the notdone reservation table with the update 
function updateReservationTable(reservations){
    const tbody = reservationTable.querySelector("tbody")
    tbody.innerHTML = ""
    if(reservations.length > 0){
        reservations.forEach((reservation) => {
            const row = tbody.insertRow()
            row.innerHTML = `
            <td><input type="hidden" class="resId" value="${reservation.id}">${reservation.id}</td>
            <td>${reservation.roomNumber}</td>
            <td>${reservation.name}</td>
            <td>${reservation.type}</td>
            <td>${reservation.tarih}</td>
            <td>${reservation.saat}</td>
            <td>${reservation.destination}</td>
            <td>${reservation.not}</td>
            <td>
                <div class="form-group">
                    <select class="form-control statusSelect" id="statusSelect" name="status">
                        <option value="waiting" ${reservation.status === 'waiting' ? 'selected' : ''}>Waiting</option>
                        <option value="accepted" ${reservation.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                        <option value="done" ${reservation.status === 'done' ? 'selected' : ''}>Done</option>
                    </select>            
                </div>
            </td>
            <td>
                <button class="resEditButton">Düzenle</button>
            </td>
            `
        })
        const reservationEditButtons = document.querySelectorAll('.resEditButton');
        reservationEditButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const row = event.target.closest('tr');
                const reservationId = row.querySelector('.resId').value;
                const newStatus = row.querySelector('.statusSelect').value;
                console.log(reservationId, newStatus)
                updateStatusInDatabase(reservationId, newStatus);
            });
        });
    } else {
        console.warn("Reservations array is empty.")
    }
}

//adding a new row to the table, eventBus can be used for being triggered,had problems not gonna use it for now
function addOneReservation(reservation){
    console.log("addOneReservation function triggered.")
    const tbody = reservationTable.querySelector("tbody")
    const newRowHTML = `
    <tr>
        <td>${reservation.id}</td>
        <td>${reservation.roomNumber}</td>
        <td>${reservation.name}</td>
        <td>${reservation.type}</td>
        <td>${reservation.tarih}</td>
        <td>${reservation.saat}</td>
        <td>${reservation.destination}</td>
        <td>${reservation.not}</td>
        <td>${reservation.status}</td>
    </tr>
    `
    tbody.insertAdjacentHTML("beforeend", newRowHTML)
}

async function updateStatusInDatabase(reservationId, newStatus) {
    try {
      const response = await fetch(`/reservations/${newStatus}/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating reservation status: ", error);
    }
  }
