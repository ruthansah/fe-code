$(document).ready(function () {

  let typeOfSearch = "email";

  $("#loading-page").hide();

  $("#phone-search").on("click", function (e) {
    e.preventDefault();
    document.querySelector('input[type="text"]').parentNode.classList.remove("error");
    $(".placeholder").attr("placeholder", "ENTER A PHONE NUMBER");
    typeOfSearch = "phone"
    setErrorMsg(typeOfSearch);
    selectButtonActive(typeOfSearch);
  });

  $("#email-search").on("click", function (e) {
    e.preventDefault();
    document.querySelector('input[type="text"]').parentNode.classList.remove("error");
    $(".placeholder").attr("placeholder", "ENTER AN EMAIL ADDRESS");
    typeOfSearch = "email"
    setErrorMsg(typeOfSearch);
    selectButtonActive(typeOfSearch);
  });

   $("#btn-search").on("click", function (e) {
    e.preventDefault();
    localStorage.clear(); //Clears storage for next request

    let userInput = $('input[type="text"]').val().toLowerCase();
    let result;

    if(typeOfSearch === 'email') {
      userInput = userInput.toLowerCase();
      result = validateEmail();
    } else {
      result = validatePhone();
    }
 
  
    if (result) {
      processUserRequest(typeOfSearch, userInput);
    } else {
      document.querySelector('input[type="text"]').parentNode.classList.add("error");
    }
  });

  $('input[type="text"]').keypress(function (event) {

    let userInput = $('input[type="text"]').val();
    let result;

    if(typeOfSearch === 'email') {
      userInput = userInput.toLowerCase();
      result = validateEmail();
    } else {
      result = validatePhone();
    }
    keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {

      event.preventDefault();

      if (result) {
        processUserRequest(typeOfSearch, userInput);
      } else {
        document.querySelector('input[type="text"]').parentNode.classList.add("error");
      }
    }
  });

});

function showLoadingPage(){
  $("#loading-page").show();
  $(".main-content").hide();
}

function hideLoadingPage(){
  $("#loading-page").hide();
  $(".main-content").show();
}

function setErrorMsg(searchType){
  if(searchType === 'email'){
    $(".error-msg").text("Please enter a valid email address");
  } else {
    $(".error-msg").text(" Please enter a valid phone number");
   }
}

function selectButtonActive(searchType){

  if(searchType === 'email'){

    if( $("#email-search").hasClass("nonactive-search")){
      $("#email-search").removeClass("nonactive-search").addClass("active-search");
      if( $("#phone-search").hasClass("active-search")){
        $("#phone-search").removeClass("active-search").addClass("nonactive-search");
      }
    }

  } else if( $("#phone-search").hasClass("nonactive-search")){

    $("#phone-search").removeClass("nonactive-search").addClass("active-search");
    if( $("#email-search").hasClass("active-search")){
      $("#email-search").removeClass("active-search").addClass("nonactive-search");
    }
  }
}

function validateEmail(){
  let  userInput = $('input[type="text"]').val().toLowerCase();
  let regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (userInput.match(regEx)) {
    document.querySelector('input[type="text"]').parentNode.classList.remove("error");
    return true;
  } else {
    return false;
  }
}

function validatePhone(){
  let userInput = $('input[type="text"]').val();
  if(userInput.length === 10 ){
    let regEx = new RegExp('^[0-9]+$');
    if (userInput.match(regEx)) {
      document.querySelector('input[type="text"]').parentNode.classList.remove("error");
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }

}

/**
 * Makes a request to ltv API to search an specific email address.
 * If there's a response, it gets stored in the local storage and redirects to results page
 */
function processUserRequest(searchType, input){
  localStorage.clear(); 
  document.querySelector('input[type="text"]').parentNode.classList.remove("error");
  showLoadingPage();
  const proxyurl = "";
  const url =
  `https://ltv-data-api.herokuapp.com/api/v1/records.json?${searchType}=` + input;
  fetch(proxyurl + url)
    .then((response) => response.text())
    .then(function (contents) {
      localStorage.setItem("userObject", contents);
      hideLoadingPage();
      window.location.href = "result.html";
    })
    .catch((e) => console.log(e));
}