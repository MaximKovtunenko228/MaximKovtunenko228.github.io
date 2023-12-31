/*global document*/
/*global window*/
/*global localStorage*/
/*global history*/
/*global XMLHttpRequest*/
/*global FormData*/
/*global console*/
/*global location*/
/*global setTimeout*/
/*global $*/
$(document).ready(function () {

  const form = document.getElementById("feedback-form");
  const Name = document.getElementById("name");
  const Email = document.getElementById("email");
  const Phone = document.getElementById("phone");
  const Organization = document.getElementById("organization");
  const Message = document.getElementById("message");
  const Check = document.getElementById("consent");


  // Save form data to localStorage
  function SaveData() {
    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
      localStorage.setItem(key, value);
    }
  }

  // Load form data from localStorage
  function LoadData() {
    const form = document.getElementById("feedback-form");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = value;
      }
    }
  }

  // Open the popup form
  function OpenPopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    popup.style.display = "block";
    overlay.style.display = "block";
    history.pushState({ popupOpen: true }, "", "#popup");
  }

  // Close the popup form
  function ClosePopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    popup.style.display = "none";
    overlay.style.display = "none";
    history.back();
  }

  // Clear form data
  function ClearForm() {
    const form = document.getElementById("feedback-form");
    form.reset();
    localStorage.clear();
  }

  // Event listeners
  document.getElementById("button").addEventListener("click", OpenPopup);
  document.getElementById("overlay").addEventListener("click", ClosePopup);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    fetch("https://formcarry.com/s/4jw6pVogxY", {
      body: formData,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    }).then(function (response) {
      if (response.ok) {
        document.getElementById("result").innerHTML =
          "Данные формы успешно отправлены на сервер";
        ClearForm();
      } else {
        document.getElementById("result").innerHTML =
          "Ошибка при отправке данных формы на сервер";
      }
    }).catch(function (error) {
      document.getElementById("result").innerHTML = "Произошла ошибка:" + error;
    });

    document.getElementById("feedback-form").reset();
  });

  LoadData();
  window.addEventListener("popstate", function (event) {
    if (event.state !== null && event.state.popupOpen) {
      document.getElementById("popup").style.display = "block";
      overlay.style.display = "block";
      window.addEventListener("click", closePopup);
    } else {
      popup.style.display = "none";
      overlay.style.display = "none";
      window.removeEventListener("click", closePopup);
    }
  });

  Name.addEventListener("blur", SaveData);
  Email.addEventListener("blur", SaveData);
  Phone.addEventListener("blur", SaveData);
  Organization.addEventListener("blur", SaveData);
  Message.addEventListener("blur", SaveData);
  Check.addEventListener("change", SaveData);
});