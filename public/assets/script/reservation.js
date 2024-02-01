const sabiha_taxi_button = document.getElementById('sabiha_taxi')
const sabiha_taxi_close_button = document.getElementById('sabiha_taxi_close')
const sabiha_taxi_modal = document.getElementById('sabiha_taxi_modal')
const sabiha_vip_button = document.getElementById('sabiha_vip')
const sabiha_vip_close_button = document.getElementById('sabiha_vip_close')
const sabiha_vip_modal = document.getElementById('sabiha_vip_modal')
const ist_taxi_button = document.getElementById('ist_taxi')
const ist_taxi_close_button = document.getElementById('ist_taxi_close')
const ist_taxi_modal = document.getElementById('ist_taxi_modal')
const ist_vip_button = document.getElementById('ist_vip')
const ist_vip_close_button = document.getElementById('ist_vip_close')
const ist_vip_modal = document.getElementById('ist_vip_modal')
const daily_taxi_button = document.getElementById('daily_taxi')
const daily_taxi_close_button = document.getElementById('daily_taxi_close')
const daily_taxi_modal = document.getElementById('daily_taxi_modal')
const daily_vip_button = document.getElementById('daily_vip')
const daily_vip_close_button = document.getElementById('daily_vip_close')
const daily_vip_modal = document.getElementById('daily_vip_modal')
const addReservationButtons = document.querySelectorAll('.addReservation')


addReservationButtons.forEach( (button) => {
    button.addEventListener('click' , (e) => {
        e.preventDefault()
        let  type = ''
        let  destination = ''
        const form = event.target.closest('form');
        const closestModal = form.closest('.modals');
        if(form.classList.contains('form1')){
            type = 'vip'
            destination = 'Sabiha Gökçen'
        } else if(form.classList.contains('form2')){
            type = 'vip'
            destination = 'Istanbul Airport'
        } else if(form.classList.contains('form3')){
            type = 'vip'
            destination = form.destination.value
        } else if(form.classList.contains('form4')){
            type = 'taxi'
            destination = 'Sabiha Gökçen'
        } else if(form.classList.contains('form5')){
            type = 'taxi'
            destination = 'Istanbul Airport'
        } else if(form.classList.contains('form6')){
            type = 'taxi'
            destination = form.destination.value
        }
        handleAddReservation(form, type, destination, closestModal)
    })
})

async function handleAddReservation(form, type, destination, closestModal) {
    const newReservation = {
        type: type,
        tarih: form.tarih.value,
        saat: form.saat.value,
        not: form.note.value,
        status: "waiting",
        roomNumber: form.roomNumber.value,
        name: form.name.value,
        destination: destination,
    }
    console.log("The new reservation : " , newReservation)
    await fetch("/reservations" , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newReservation),
    })
        .then((res) => {
            if(!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`)
            }
            return res.json()
        })
        .then((data) => {
            // beklemeye aldim,diger file ile iletisime gecemiyorum.
            // addOneReservation(data.reservation)
        })
        .catch((error) => {
            console.error("Error posting reservation: ", error)
        })
    if(newReservation){
        popup_unactive(closestModal)
    }
}



//event listeners for reservation buttons

sabiha_taxi_button.addEventListener('click', () => {
    popup_active(sabiha_taxi_modal)
})

sabiha_taxi_close_button.addEventListener('click', () => {
    popup_unactive(sabiha_taxi_modal)
})

sabiha_vip_button.addEventListener('click', () => {
    popup_active(sabiha_vip_modal)
})

sabiha_vip_close_button.addEventListener('click', () => {
    popup_unactive(sabiha_vip_modal)
})

ist_taxi_button.addEventListener('click' , () => {
    popup_active(ist_taxi_modal)
})

ist_taxi_close_button.addEventListener('click' , () => {
    popup_unactive(ist_taxi_modal)
})

ist_vip_button.addEventListener('click' , () => {
    popup_active(ist_vip_modal)
})

ist_vip_close_button.addEventListener('click' , () => {
    popup_unactive(ist_vip_modal)
})

daily_taxi_button.addEventListener('click' , () => {
    popup_active(daily_taxi_modal)
})

daily_taxi_close_button.addEventListener('click' , () => {
    popup_unactive(daily_taxi_modal)
})

daily_vip_button.addEventListener('click' , () => {
    popup_active(daily_vip_modal)
})

daily_vip_close_button.addEventListener('click' , () => {
    popup_unactive(daily_vip_modal)
})

function popup_active(modal){
    console.log('activation button clicked')
    if(modal == null){
        return 'model cannot be found'
    }
    modal.classList.add('active')
}

function popup_unactive(modal){
    console.log('deactivation button clicked')
    if(modal == null){
        return 'model cannot be found'
    }
    modal.classList.remove('active')
}