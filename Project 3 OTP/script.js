const inputs = document.querySelectorAll("input"),
  button = document.querySelector("button"),
  mobile = document.getElementById("mobile"),
  expire = document.getElementById("expire");

let OTP = "",
  expireinterval = "";

// generateotp();
function generateotp() {
  OTP =
    Math.floor(Math.random() * 10) +
    "" +
    Math.floor(Math.random() * 10) +
    "" +
    Math.floor(Math.random() * 10) +
    "" +
    Math.floor(Math.random() * 10);

  alert("Your OTP is: " + OTP);
  inputs[0].focus();
  expire.innerText = 30;
  expireinterval = setInterval(function () {
    expire.innerText--;
    if (expire.innerText == 0) {
      clearInterval(expireinterval);
    }
  }, 1000);
}
function clearotp() {
  inputs.forEach((input,i) => {
    input.value = "";
    if(i==0){
        input.removeAttribute("disabled");
    }if(i!=0){

        input.setAttribute("disabled",true)
    }
});
clearInterval(expireinterval);
expire.innerText=0
// button.setAttribute("disabled",true)
button.classList.remove("active")

}

inputs.forEach((input, index) => {
  input.addEventListener("keyup", function (e) {
    const currentInput = input,
      nextinput = input.nextElementSibling,
      previnput = input.previousElementSibling;
    console.log(currentInput, nextinput, previnput);

    if (
      nextinput &&
      nextinput.hasAttribute("disabled") &&
      currentInput.value !== ""
    ) {
      nextinput.removeAttribute("disabled", true);
      nextinput.focus();
    }

    if (e.key === "Backspace") {
      inputs.forEach((input, index1) => {
        if (index <= index1 && previnput) {
          input.setAttribute("disabled", true);
          previnput.focus();
          previnput.value = "";
        }
      });
    }
    if (!inputs[3].disabled && inputs[3].value !== "") {
      inputs[3].blur();
      button.classList.add("active");
      return;
    }

    button.classList.remove("active");
  });
});

window.addEventListener("load", () => {
  let x = prompt("Please Enter Your Mobile Number To Verify Ypur Account");
  if (x) {
    mobile.innerText = x;
    generateotp();
  }
});
button.addEventListener("click", () => {
  let verify = "";
  inputs.forEach((input) => {
    verify += input.value;
  });
  if (verify === OTP) {
    alert("Your Account Verify  Successfully!");
    clearotp()
  } else {
    alert("Please  Check Your OTP Again.");
  }
});
