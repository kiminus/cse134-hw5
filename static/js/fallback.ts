document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme') || (console.log('first time access, using prefers-color-theme'), window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    const themeSelector = document.getElementById("theme-selector") as HTMLSelectElement;
    themeSelector.value = theme;
    themeSelector.addEventListener('change', onSelectTheme);
    onSelectTheme();
});

/* theme switcher */
const themes = {
    light: {
        "--background-color": "#F5F5F5",
        "--text-color": "#222222",
    },
    dark: {
        "--background-color": "#121212",
        "--text-color": "#E0E0E0",
    }
}
const themeSelector = document.getElementById('theme-selector') as HTMLSelectElement;
const themeCustomizer = document.getElementById('theme-customizer') as HTMLDivElement;
themeCustomizer.querySelector('button').addEventListener('click', onSaveCustomTheme);

function onSelectTheme() {
    const theme = themeSelector.value;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    console.log(theme);
    if (theme === 'custom'){
        themeCustomizer.style.display = 'flex';
        const customTheme = localStorage.getItem('custom-theme');
        if (customTheme){
            useTheme(JSON.parse(customTheme));
        }
    } else {
        themeCustomizer.style.display = 'none';
    }
    useTheme(themes[theme]);
}

function useTheme(theme: Record<string, string>) {
    for (const key in theme) {
        document.documentElement.style.setProperty(key, theme[key]);
    }
}

function onSaveCustomTheme() {
    const bgColorInput = document.getElementById("bg-color") as HTMLInputElement;
    const textColorInput = document.getElementById("text-color") as HTMLInputElement;
    const fontFamilyInput = document.getElementById("font-family") as HTMLInputElement;

    const customTheme = {
        "--background-color": bgColorInput.value,
        "--text-color": textColorInput.value,
        "--font-body": fontFamilyInput.value,
    }
    useTheme(customTheme);
    localStorage.setItem('custom-theme', JSON.stringify(customTheme));
}




/* contact form */
const contactForm = document.getElementById('contact-form') as HTMLFormElement;
contactForm.addEventListener('submit', onContactFormSubmission);
const statusOutput = document.querySelector('#contact-form output[role="status"]') as HTMLOutputElement;
const alertOutput = document.querySelector('#contact-form output[role="alert"]') as HTMLOutputElement;
const nameInput = contactForm.elements['name'] as HTMLInputElement;
const emailInput = contactForm.elements['email'] as HTMLInputElement;
const commentsTextArea = contactForm.elements['comments'] as HTMLTextAreaElement;
maskingInput(nameInput);
maskingInput(emailInput);
maskingInput(commentsTextArea);
commentsTextArea.addEventListener('input', updateCharacterCount);
const TIMEOUT = 3000;

let form_errors: Record<string, string> = {};

function updateAlertOutput() {
    alertOutput.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (const key in form_errors){
        const error = document.createElement('p');
        error.textContent = form_errors[key];
        fragment.appendChild(error);
    }
    alertOutput.appendChild(fragment);
}
function onContactFormSubmission(event){
    let flag = false;
    [nameInput, emailInput, commentsTextArea].forEach((field) => {
        if (!validateField(field)){
            flag = true;
        }
    });
    if (flag) {
        const errorsField = document.createElement('input');
        errorsField.type = 'hidden';
        errorsField.name = 'form-errors';
        errorsField.value = JSON.stringify(form_errors);
        contactForm.appendChild(errorsField);
    }
    updateAlertOutput();
    setTimeout(() => {
        alertOutput.innerHTML = '';
    }, TIMEOUT);
}

function validateField(field: HTMLInputElement | HTMLTextAreaElement){
    form_errors[field.name] = `${field.name}:  ${field.validationMessage}`;
    return field.checkValidity();
}

function maskingInput(input: HTMLInputElement | HTMLTextAreaElement){
    input.addEventListener('input', () => {
        form_errors[input.name] = '';
        if (validateField(input) === true){
            //make sure the input is only using common letters, numbers and symbols
            const regex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
            if (regex.test(input.value) == true){
                if (input.name in form_errors){
                    delete form_errors[input.name];
                    updateAlertOutput();
                }
                input.setCustomValidity('');
                return;
            } else {
                input.setCustomValidity('invalid input symbols, please only use common letters, numbers and symbols');
                input.reportValidity();
            }
        }
        flashField(input);
        form_errors[input.name]= `${input.name}:  ${input.validationMessage}`;
        updateAlertOutput();
    })

}

function updateCharacterCount(){
    statusOutput.textContent = `${commentsTextArea.value.length}/${commentsTextArea.maxLength} characters`;
    if (commentsTextArea.value.length > commentsTextArea.maxLength){
        statusOutput.style.color = 'red';
    } else if (commentsTextArea.value.length >= commentsTextArea.maxLength - 20){
        statusOutput.style.color = 'orange';
    }
}

function flashField(field: HTMLInputElement | HTMLTextAreaElement){
    field.classList.add('rotating-border');
    setTimeout(() => {
        field.classList.remove('rotating-border');
    }, TIMEOUT);
}