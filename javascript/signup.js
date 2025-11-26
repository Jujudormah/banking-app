//Declaractions
const signUpForm = document.querySelector('.signup-form');
const formName = document.querySelector('#form-fullname');
const formPassword = document.querySelector('#form-password');
const successBanner = document.querySelector('.success-banner');

signUpForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const owner = formName.value;
  const pin = formPassword.value;
  const regexUserTest = /\d/; //regex for digits
  const regexPasswordTest = /[a-zA-Z]/; // regex for letters

  if (owner == '' || pin == '') {
    console.log('input is empty, attempt failed');
    formName.value = '';
    formPassword.value = '';
    return;
  }

  //Verification and Account Creation
  if (
    !regexUserTest.test(owner) &&
    !regexPasswordTest.test(pin) &&
    pin.length === 4
  ) {
    console.log('success');
    let user = new CreateAccount(owner, Number(pin));
    accounts.push(user);
    successBanner.style.transform = 'translateY(0)';
    setTimeout(() => {
      successBanner.style.transform = 'translateY(-100%)';
    }, 2000);
  } else {
    console.log('failed');
  }
  formName.value = '';
  formPassword.value = '';
});
