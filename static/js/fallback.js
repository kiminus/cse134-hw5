document.addEventListener('DOMContentLoaded', function () {
    var theme = localStorage.getItem('theme') || (console.log('first time access, using prefers-color-theme'), window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    var themeSelector = document.getElementById("theme-selector");
    themeSelector.value = theme;
    themeSelector.addEventListener('change', onSelectTheme);
    onSelectTheme();
});
/* theme switcher */
var themes = {
    light: {
        "--background-color": "#F5F5F5",
        "--text-color": "#222222",
    },
    dark: {
        "--background-color": "#121212",
        "--text-color": "#E0E0E0",
    }
};
var themeSelector = document.getElementById('theme-selector');
var themeCustomizer = document.getElementById('theme-customizer');
themeCustomizer.querySelector('button').addEventListener('click', onSaveCustomTheme);
function onSelectTheme() {
    var theme = themeSelector.value;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    console.log(theme);
    if (theme === 'custom') {
        themeCustomizer.style.display = 'flex';
        var customTheme = localStorage.getItem('custom-theme');
        if (customTheme) {
            useTheme(JSON.parse(customTheme));
        }
    }
    else {
        themeCustomizer.style.display = 'none';
    }
    useTheme(themes[theme]);
}
function useTheme(theme) {
    for (var key in theme) {
        document.documentElement.style.setProperty(key, theme[key]);
    }
}
function onSaveCustomTheme() {
    var bgColorInput = document.getElementById("bg-color");
    var textColorInput = document.getElementById("text-color");
    var fontFamilyInput = document.getElementById("font-family");
    var customTheme = {
        "--background-color": bgColorInput.value,
        "--text-color": textColorInput.value,
        "--font-body": fontFamilyInput.value,
    };
    useTheme(customTheme);
    localStorage.setItem('custom-theme', JSON.stringify(customTheme));
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
            //make sure the input is only using common letters, numbers and symbols
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
