// containers
const items_container = document.querySelector(".items_container");
const grocery_form = document.querySelector(".grocery_form");
const alert = document.querySelector(".top_noti");

const user_input_text = document.querySelector("#input_text");

// buttons
const submit = document.getElementById("submit");
const clear_button = document.querySelector(".clear_items");

let del_button;
let edit_button;
// Edit option
let edit_element;
let edit_flag = false;
let edit_obj = "";

grocery_form.addEventListener("submit", addItem);
window.addEventListener("DOMContentLoaded", setupItems);

function displayAlert(text, Posi_or_neg) {
  alert.innerHTML = text;
  alert.classList.add(`${Posi_or_neg}`);
  setTimeout(function () {
    alert.innerHTML = "";
    alert.classList.remove(Posi_or_neg);
  }, 1000);
}
function setDefault() {
  user_input_text.value = "";
  submit.textContent = "submit";
}

function editItem(e) {
  //here
  edit_flag = true;
  edit_element =
    e.currentTarget.parentElement.parentElement.children[0].textContent
      .slice(3)
      .trim();
  edit_obj = getAllLocalStorageItems().find(function (currentItem) {
    if (currentItem.text === edit_element) {
      return currentItem;
    }
  });
  user_input_text.value = edit_element;
  submit.innerText = "Edit";
  edit_flag = true;
}
let number = 1;
function addItem(e) {
  //here
  e.preventDefault();
  const user_input = user_input_text.value;
  if (user_input !== "" && !edit_flag) {
    const item_id = new Date().getTime().toString();
    const new_item = `
                <div class="item">
                    <div class="item_text"><b>${number}) </b>${user_input}</div>
                    <div class="button_container">
                        <button type="button" class="edit_btn">
                            <img src="./edit.svg" alt>
                        </button>
                        <button type="button" class="del_btn">
                            <img src="./delete.svg" alt>
                        </button>
                    </div>
                </div>`;
    number++;
    items_container.innerHTML += new_item;

    displayAlert("Item Added", "positive");
    addToLocalStorage(item_id, user_input);
    setDefault();
    edit_button = document.querySelectorAll(".edit_btn");
    edit_button.forEach(function (button) {
      button.addEventListener("click", editItem);
    });
    del_button = document.querySelectorAll(".del_btn");
    del_button.forEach(function (button) {
      button.addEventListener("click", deleteItem);
    });
    document
      .querySelector(".clear_items")
      .addEventListener("click", clearItems);
  } else if (user_input !== "" && edit_flag) {
    //abc
    edit_element.textContent = user_input;
    editLocalStorage(edit_obj.id, user_input);
    setDefault();
    displayAlert("Item Edited", "positive");
  } else {
    displayAlert("Please Enter A value", "negative");
  }
}

function clearItems() {
  items_container.innerHTML = null;
  localStorage.removeItem("grocery_list");
  displayAlert("All Items Cleared", "negative");
  clear_button.classList.remove("show_clear_items");
  number = 1;
  edit_flag = false;
}

function deleteItem(e) {
  //here
  const selected_element = e.currentTarget.parentElement.parentElement;
  const item_id = selected_element.children[0].textContent.slice(3).trim();
  const updated_array = getAllLocalStorageItems().filter(function (
    currentItem
  ) {
    if (currentItem.text != item_id) {
      return currentItem;
    }
  });

  localStorage.setItem("grocery_list", JSON.stringify(updated_array));

  items_container.removeChild(selected_element);
  if (getAllLocalStorageItems().length === 0) {
    localStorage.removeItem("grocery_list");
    clear_button.classList.remove("show_clear_items");
  }
  setDefault();
  setupItems();
}

function editLocalStorage(id, text) {
  const new_array = getAllLocalStorageItems();
  new_array.map(function (currentItem) {
    if (currentItem.id === id) {
      currentItem.text = text;
    }
  });
  localStorage.setItem("grocery_list", JSON.stringify(new_array));
  setupItems();
}

function addToLocalStorage(id, text) {
  const new_obj = { id, text };
  const location_storage_items = getAllLocalStorageItems();
  location_storage_items.push(new_obj);
  if (location_storage_items.length === 1) {
    clear_button.classList.add("show_clear_items");
  }
  localStorage.setItem("grocery_list", JSON.stringify(location_storage_items));
}

function getAllLocalStorageItems() {
  return localStorage.getItem("grocery_list")
    ? JSON.parse(localStorage.getItem("grocery_list"))
    : [];
}

function setupItems() {
  const current_array = getAllLocalStorageItems();
  let number = 1;
  items_container.innerHTML = null;
  current_array.forEach(function (currentItem) {
    items_container.innerHTML += `
                <div class="item">
                    <div class="item_text"><b>${number}) </b>${currentItem.text}</div>
                    <div class="button_container">
                        <button type="button" class="edit_btn">
                            <img src="./edit.svg" alt>
                        </button>
                        <button type="button" class="del_btn">
                            <img src="./delete.svg" alt>
                        </button>
                    </div>
                </div>`;
    number++;
  });
  if (current_array.length >= 1) {
    edit_button = document.querySelectorAll(".edit_btn");
    edit_button.forEach(function (button) {
      button.addEventListener("click", editItem);
    });
    del_button = document.querySelectorAll(".del_btn");
    del_button.forEach(function (button) {
      button.addEventListener("click", deleteItem);
    });
    clear_button.className = "clear_items show_clear_items";
    clear_button.addEventListener("click", clearItems);
  }
}
