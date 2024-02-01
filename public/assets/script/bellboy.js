//bellboy.js

const addBellboyButton = document.querySelector(".addBellboy");
const closeBellboyButton = document.querySelector(".closeBellboyForm");
const BellboyTable = document.getElementById("bellboyTable");
const addBellboyForm = document.querySelector('.addBellboyForm')
fetch("/bellboys")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    updateBellboyTable(data.bellboys);
  })
  .catch((error) => console.error("Error fetching bellboys:", error));

// Function to update the bellboy table
function updateBellboyTable(bellboys) {
  // Clear existing tbody content
  const tbody = bellboyTable.querySelector("tbody");
  tbody.innerHTML = "";

  if (bellboys.length > 0) {
    bellboys.forEach((bellboy) => {
      const row = tbody.insertRow();
      row.innerHTML = `
              <td>${bellboy.id}</td>
              <td>${bellboy.username}</td>
              <td>${bellboy.ad}</td>
              <td>${bellboy.soyad}</td>
              <td>${bellboy.email}</td>
              <td> 
                  <button class="editButton">Düzenle</button> 
                  <button class="saveButton hidden">Kaydet</button> 
              </td>
              <td> 
                  <button class="deleteButton">Sil</button> 
                  <button class="cancelButton hidden">İptal</button> 
              </td>
              <td>
                <button class="openBellboyForm">Ekle</button>
              </td>
              `;
    });
    const editButtons = bellboyTable.querySelectorAll(".editButton");
    editButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        handleEditButtonClick(event, "bellboy");
      });
    });
    const deleteButtons = bellboyTable.querySelectorAll(".deleteButton");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        handleDeleteButtonClick(event, "bellboy");
      });
    });
    const openBellboyButtons = bellboyTable.querySelectorAll(".openBellboyForm");
    openBellboyButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        bellboyOpenClick(event);
      });
    });
  } else {
    console.warn("Bellboys array is empty.");
  }
}

//function to make the add bellboy form visible
function bellboyOpenClick(){
  addBellboyForm.classList.remove('hidden')
}

//function to make the add bellboy form invisible
function bellboyCloseClick(){
  addBellboyForm.classList.add('hidden')
}

// Function to add one row to the table after adding a bellboy to the table
function addOneBellboy(bellboy) {
  const tbody = bellboyTable.querySelector("tbody");
  const newRowHTML = `
      <tr>
          <td>${bellboy.id}</td>
          <td>${bellboy.username}</td>
          <td>${bellboy.ad}</td>
          <td>${bellboy.soyad}</td>
          <td>${bellboy.email}</td>
          <td> 
                  <button class="editButton">Düzenle</button> 
                  <button class="saveButton hidden">Kaydet</button> 
              </td>
              <td> 
                  <button class="deleteButton">Sil</button> 
                  <button class="cancelButton hidden">İptal</button> 
              </td>
              <td>
                <button class="openBellboyForm">Ekle</button>
              </td>
      </tr>
      `;
  tbody.insertAdjacentHTML("beforeend", newRowHTML);
  const editButtons = bellboyTable.querySelectorAll(".editButton");
  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      handleEditButtonClick(event, "bellboy");
    });
  });
  const deleteButtons = bellboyTable.querySelectorAll(".deleteButton");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      handleDeleteButtonClick(event, "bellboy");
    });
  });
  const openBellboyButtons = bellboyTable.querySelectorAll(".openBellboyForm");
  openBellboyButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      bellboyOpenClick(event);
    });
  });
}

// Adding a new bellboy :
addBellboyButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Button clicked!");
  const form = document.querySelector(".bellboyForm");
  const newBellboy = {
    username: form.bellboy_username.value,
    password: form.bellboy_password.value,
    role: "bellboy",
    ad: form.bellboy_ad.value,
    soyad: form.bellboy_soyad.value,
    email: form.bellboy_email.value,
  };
  console.log(`the new bellboy: `, newBellboy);
  fetch("/bellboys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify(newBellboy), // Convert the JavaScript object to a JSON string
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      addOneBellboy(data.bellboy);
    })
    .catch((error) => console.error("Error posting bellboy:", error));
  bellboyCloseClick()
});

//closing the form
closeBellboyButton.addEventListener('click', (e) => {
  e.preventDefault()
  bellboyCloseClick()
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
    console.log("deleting the ", userRole, " with the id : ", id);
    const deleteURL =
      userRole === "concierge" ? `/concierges/${id}` : `/bellboys/${id}`;
    fetch(deleteURL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (userRole === "concierge") {
          deleteConciergeRow(row, id);
        } else if (userRole === "bellboy") {
          deleteBellboyRow(row, id);
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
    const editURL =
      userRole === "concierge" ? `/concierges/${id}` : `/bellboys/${id}`;
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
function deleteBellboyRow(row, id) {
  const rowIndex = row.rowIndex;
  bellboyTable.deleteRow(rowIndex);
}
function deleteConciergeRow(row, id) {
  const rowIndex = row.rowIndex;
  conciergeTable.deleteRow(rowIndex);
}
