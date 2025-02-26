document.addEventListener('DOMContentLoaded', function () {
    var theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    var themeToggler = document.getElementById("theme-toggle");
    themeToggler.innerText = theme === 'dark' ? '🌙' : '☀️';
});
/* theme switcher */
var themeToggler = document.getElementById("theme-toggle");
themeToggler.addEventListener('click', onToggleTheme);
function onToggleTheme() {
    var currentTheme = document.documentElement.getAttribute('data-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggler.innerText = newTheme === 'dark' ? '🌙' : '☀️';
}
/* contact form */
var contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', onContactFormSubmission);
var statusOutput = document.querySelector('#contact-form output[role="status"]');
var alertOutput = document.querySelector('#contact-form output[role="alert"]');
var nameInput = contactForm.elements['name'];
var emailInput = contactForm.elements['email'];
var commentsTextArea = contactForm.elements['comments'];
maskingInput(nameInput);
maskingInput(emailInput);
maskingInput(commentsTextArea);
commentsTextArea.addEventListener('input', updateCharacterCount);
var TIMEOUT = 3000;
var form_errors = {};
function updateAlertOutput() {
    alertOutput.innerHTML = '';
    var fragment = document.createDocumentFragment();
    for (var key in form_errors) {
        var error = document.createElement('p');
        error.textContent = form_errors[key];
        fragment.appendChild(error);
    }
    alertOutput.appendChild(fragment);
}
function onContactFormSubmission(event) {
    var flag = false;
    [nameInput, emailInput, commentsTextArea].forEach(function (field) {
        if (!validateField(field)) {
            flag = true;
        }
    });
    if (flag) {
        var errorsField = document.createElement('input');
        errorsField.type = 'hidden';
        errorsField.name = 'form-errors';
        errorsField.value = JSON.stringify(form_errors);
        contactForm.appendChild(errorsField);
    }
    updateAlertOutput();
    setTimeout(function () {
        alertOutput.innerHTML = '';
    }, TIMEOUT);
}
function validateField(field) {
    form_errors[field.name] = "".concat(field.name, ":  ").concat(field.validationMessage);
    return field.checkValidity();
}
function maskingInput(input) {
    input.addEventListener('input', function () {
        form_errors[input.name] = '';
        if (validateField(input) === true) {
            var regex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
            if (regex.test(input.value) == true) {
                if (input.name in form_errors) {
                    delete form_errors[input.name];
                    updateAlertOutput();
                }
                input.setCustomValidity('');
                return;
            }
            else {
                input.setCustomValidity('invalid input symbols, please only use common letters, numbers and symbols');
                input.reportValidity();
            }
        }
        flashField(input);
        form_errors[input.name] = "".concat(input.name, ":  ").concat(input.validationMessage);
        updateAlertOutput();
    });
}
function updateCharacterCount() {
    statusOutput.textContent = "".concat(commentsTextArea.value.length, "/").concat(commentsTextArea.maxLength, " characters");
    if (commentsTextArea.value.length > commentsTextArea.maxLength) {
        statusOutput.style.color = 'red';
    }
    else if (commentsTextArea.value.length >= commentsTextArea.maxLength - 20) {
        statusOutput.style.color = 'orange';
    }
}
function flashField(field) {
    field.classList.add('rotating-border');
    setTimeout(function () {
        field.classList.remove('rotating-border');
    }, TIMEOUT);
}
