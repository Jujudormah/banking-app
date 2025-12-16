//Declaractions
const signUpForm = document.querySelector('.signup-form');
const formName = document.querySelector('#form-fullname');
const formPassword = document.querySelector('#form-password');
const successBanner = document.querySelector('.success-banner');
const formFailure = document.querySelector('.form-failure');
const logo = document.querySelector('#logo');

logo.addEventListener('click', function (even) {
  window.location.href = 'landing.html';
});

signUpForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const owner = formName.value.trim();
  const password = formPassword.value;
  const usernameValid = /^[a-zA-Z\s]{2,}$/.test(owner);
  const passwordValid =
    password.length >= 5 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (owner == '' || password == '') {
    console.log('input is empty, attempt failed');
    formName.value = '';
    formPassword.value = '';
    return;
  }

  //Verification process
  if (usernameValid && passwordValid) {
    console.log('success');
    let user = new CreateAccount(owner, password);
    accounts.push(user);
    console.log(user);

    successBanner.style.transform = 'translateY(0)';
    formFailure.style.display = 'none';
    setTimeout(() => {
      successBanner.style.transform = 'translateY(-100%)';
    }, 2000);
    setTimeout(() => {
      window.location.href = 'landing.html';
    }, 3000);
  } else {
    console.log('failed');
    formFailure.style.display = 'block';
  }
  formName.value = '';
  formPassword.value = '';
});
