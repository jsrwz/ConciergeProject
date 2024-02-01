//concierge.js

const addConciergeButton = document.querySelector(".addConcierge");
const closeFormButton = document.querySelector(".closeForm");
const conciergeTable = document.getElementById("conciergeTable");
const conciergeForm = document.querySelector(".addConciergeForm")
// Use the Fetch API to get concierge data from the server
fetch("/concierges")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    updateConciergeTable(data.concierges);
  })
  .catch((error) => console.error("Error fetching concierges:", error));

// Function to update the concierge table
function updateConciergeTable(concierges) {
  // Clear existing tbody content
  const tbody = conciergeTable.querySelector("tbody");
  tbody.innerHTML = "";

  if (concierges.length > 0) {
    concierges.forEach((concierge) => {
      const row = tbody.insertRow();
      row.innerHTML = `
            <td>${concierge.id}</td>
            <td>${concierge.username}</td>
            <td>${concierge.ad}</td>
            <td>${concierge.soyad}</td>
            <td>${concierge.email}</td>
            <td> 
                <button class="editButton">Düzenle</button> 
                <button class="saveButton hidden">Kaydet</button> 
            </td>
            <td> 
                <button class="deleteButton">Sil</button> 
                <button class="cancelButton hidden">İptal</button> 
            </td>
            <td>
              <button class="openConciergeForm">Ekle</button>
            </td>
            `;
    });
    const editButtons = conciergeTable.querySelectorAll(".editButton");
    editButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        handleEditButtonClick(event, 'concierge')
      });
    });
    const deleteButtons = conciergeTable.querySelectorAll(".deleteButton");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        handleDeleteButtonClick(event, 'concierge')
      });
    });
    const openButtons = conciergeTable.querySelectorAll(".openConciergeForm");
    openButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        handleOpenButtonClick(event)
      })
    })
  } else {
    console.warn("Concierges array is empty.");
  }
}

//function to make the add concierge form visible
function handleOpenButtonClick(){
  conciergeForm.classList.remove('hidden')
}

//function to make the add concierge form invisible
function handleCloseButtonClick(){
  conciergeForm.classList.add('hidden')
}

//function to add one row to the table after adding
function addOneConcierge(concierge) {
  const tbody = conciergeTable.querySelector("tbody");
  const newRowHTML = `
    <tr>
        <td>${concierge.id}</td>
        <td>${concierge.username}</td>
        <td>${concierge.ad}</td>
        <td>${concierge.soyad}</td>
        <td>${concierge.email}</td>
        <td> 
                <button class="editButton">Düzenle</button> 
                <button class="saveButton hidden">Kaydet</button> 
            </td>
            <td> 
                <button class="deleteButton">Sil</button> 
                <button class="cancelButton hidden">İptal</button> 
            </td>
            <td>
              <button class="openConciergeForm">Ekle</button>
            </td>
    </tr>
    `;
  tbody.insertAdjacentHTML("beforeend", newRowHTML);
  const editButtons = conciergeTable.querySelectorAll(".editButton");
  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      handleEditButtonClick(event, 'concierge')
    });
  });
  const deleteButtons = conciergeTable.querySelectorAll(".deleteButton");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      handleDeleteButtonClick(event, 'concierge')
    });
  });
  const openButtons = conciergeTable.querySelectorAll(".openConciergeForm");
  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      handleOpenButtonClick(event)
    })
  })
}

//adding a new concierge
addConciergeButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Button clicked!");
  const form = document.querySelector(".conciergeForm");
  const newConcierge = {
    username: form.concierge_username.value,
    password: form.concierge_password.value,
    role: "concierge",
    ad: form.concierge_ad.value,
    soyad: form.concierge_soyad.value,
    email: form.concierge_email.value,
  };
  console.log(`the new concierge: `, newConcierge);
  fetch("/concierges", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(newConcierge),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      addOneConcierge(data.concierge);
    })
    .catch((error) => console.error("Error posting concierges:", error));
  conciergeForm.classList.add('hidden')
});

//closing the form
closeFormButton.addEventListener("click", (e) => {
  e.preventDefault();
  handleCloseButtonClick()
})

//function for deleting a concierge from the database/table
function handleDeleteButtonClick(event, userRole) {
  const row = event.target.closest("tr");
  const id = row.cells[0].textContent;

  //selecting button elements
  const editButton = row.querySelector(".editButton");
  const deleteButton = row.querySelector(".deleteButton");
  const saveButton = row.querySelector(".saveButton");
  const cancelButton = row.querySelector(".cancelButton");

  //making edit/delete buttons invisible and save/cancel buttons visible
  editButton.classList.add("hidden");
  deleteButton.classList.add("hidden");
  saveButton.classList.remove("hidden");
  cancelButton.classList.remove("hidden");

  //taking the currentValues of the concierge before the change
  const currentValues = {
    username: row.cells[1].textContent,
    ad: row.cells[2].textContent,
    soyad: row.cells[3].textContent,
    email: row.cells[4].textContent,
  };

  //when user clicks save:
  saveButton.addEventListener("click", () => {
    console.log("deleting the " , userRole , " with the id : ", id);
    const deleteURL = userRole === 'concierge' ? `/concierges/${id}` : `/bellboys/${id}`; 
    fetch(deleteURL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if(userRole === 'concierge'){
          deleteConciergeRow(row, data.concierge.id);
        } else if(userRole === 'bellboy'){
          deleteBellboyRow(row, data.bellboy.id)
        }
      })
      .catch((error) => console.error(`Error deleting ${userRole}: `, error));
    editButton.classList.remove("hidden");
    saveButton.classList.add("hidden");
    deleteButton.classList.remove("hidden");
    cancelButton.classList.add("hidden");
  });

  //when user clicks cancel:
  cancelButton.addEventListener("click", () => {
    Object.keys(currentValues).forEach((key, index) => {
      row.cells[index + 1].innerHTML = currentValues[key];
    });
    editButton.classList.remove("hidden");
    saveButton.classList.add("hidden");
    deleteButton.classList.remove("hidden");
    cancelButton.classList.add("hidden");
  });
}

//function for editting the concierge at db/table
function handleEditButtonClick(event, userRole) {
  const row = event.target.closest("tr");
  const id = row.cells[0].textContent;

  console.log("row :", row);
  console.log("id :", id);

  //selecting button elements
  const editButton = row.querySelector(".editButton");
  const saveButton = row.querySelector(".saveButton");
  const deleteButton = row.querySelector(".deleteButton");
  const cancelButton = row.querySelector(".cancelButton");

  //making edit/delete buttons invisible and save/cancel buttons visible
  editButton.classList.add("hidden");
  saveButton.classList.remove("hidden");
  deleteButton.classList.add("hidden");
  cancelButton.classList.remove("hidden");

  //taking the currentValues of the concierge before the change
  const currentValues = {
    username: row.cells[1].textContent,
    ad: row.cells[2].textContent,
    soyad: row.cells[3].textContent,
    email: row.cells[4].textContent,
  };

  Object.keys(currentValues).forEach((key, index) => {
    row.cells[
      index + 1
    ].innerHTML = `<input type="text" value="${currentValues[key]}">`;
  });

  saveButton.addEventListener("click", () => {
    const updatedValues = {
      username: row.cells[1].querySelector("input").value,
      ad: row.cells[2].querySelector("input").value,
      soyad: row.cells[3].querySelector("input").value,
      email: row.cells[4].querySelector("input").value,
    };
    console.log("updatedValues : ", updatedValues);
    const editURL = userRole === 'concierge' ? `/concierges/${id}` : `/bellboys/${id}`;
    fetch(editURL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedValues),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => console.error("Error updating concierge: ", error));
    editButton.classList.remove("hidden");
    saveButton.classList.add("hidden");
    deleteButton.classList.remove("hidden");
    cancelButton.classList.add("hidden");
    Object.keys(updatedValues).forEach((key, index) => {
      row.cells[index + 1].innerHTML = updatedValues[key];
    });
  });
  cancelButton.addEventListener("click", () => {
    Object.keys(currentValues).forEach((key, index) => {
      row.cells[index + 1].innerHTML = currentValues[key];
    });
    editButton.classList.remove("hidden");
    saveButton.classList.add("hidden");
    deleteButton.classList.remove("hidden");
    cancelButton.classList.add("hidden");
  });
}

//functions for deleting one row :
function deleteConciergeRow(row, id) {
  const rowIndex = row.rowIndex;
  conciergeTable.deleteRow(rowIndex);
}

function deleteBellboyRow(row, id) {
  const rowIndex = row.rowIndex;
  bellboyTable.deleteRow(rowIndex);
}
