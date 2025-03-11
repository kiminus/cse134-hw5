"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme') || (console.log('first time access, using prefers-color-theme'), window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    const themeSelector = document.getElementById("theme-selector");
    themeSelector.value = theme;
    themeSelector.addEventListener('change', onSelectTheme);
    onSelectTheme();
});
/* region theme, and theme customizer */
const themes = {
    light: {
        "--background-color": "#F5F5F5",
        "--text-color": "#222222",
        "--font-body": "Arial, sans-serif",
    },
    dark: {
        "--background-color": "#121212",
        "--text-color": "#E0E0E0",
        "--font-body": "Arial, sans-serif",
    }
};
const themeSelector = document.getElementById('theme-selector');
const themeCustomizer = document.getElementById('theme-customizer');
themeCustomizer.querySelector('button').addEventListener('click', onSaveCustomTheme);
function onSelectTheme() {
    const theme = themeSelector.value;
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    console.log(theme);
    if (theme === 'custom') {
        themeCustomizer.style.display = 'flex';
        const customTheme = localStorage.getItem('custom-theme');
        if (customTheme) {
            useTheme(JSON.parse(customTheme));
        }
    }
    else {
        themeCustomizer.style.display = 'none';
    }
    // @ts-ignore
    useTheme(themes[theme]);
}
function useTheme(theme) {
    for (const key in theme) {
        document.documentElement.style.setProperty(key, theme[key]);
    }
}
function onSaveCustomTheme() {
    const bgColorInput = document.getElementById("bg-color");
    const textColorInput = document.getElementById("text-color");
    const fontFamilyInput = document.getElementById("font-family");
    const customTheme = {
        "--background-color": bgColorInput.value,
        "--text-color": textColorInput.value,
        "--font-body": fontFamilyInput.value,
    };
    useTheme(customTheme);
    localStorage.setItem('custom-theme', JSON.stringify(customTheme));
}
/* endregion */
/* region contact form */
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', onContactFormSubmission);
const statusOutput = document.querySelector('#contact-form output[role="status"]');
const nameInput = contactForm.elements.namedItem('name');
const emailInput = contactForm.elements.namedItem('email');
const commentsTextArea = contactForm.elements.namedItem('comments');
const alertOutput = document.querySelector('#contact-form output[role="alert"]');
maskingInput(nameInput);
maskingInput(emailInput);
maskingInput(commentsTextArea);
commentsTextArea.addEventListener('input', updateCharacterCount);
const TIMEOUT = 3000;
let form_errors = {};
function updateAlertOutput() {
    alertOutput.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (const key in form_errors) {
        const error = document.createElement('p');
        error.textContent = form_errors[key];
        fragment.appendChild(error);
    }
    alertOutput.appendChild(fragment);
}
function onContactFormSubmission(event) {
    let flag = false;
    [nameInput, emailInput, commentsTextArea].forEach((field) => {
        if (!validateField(field)) {
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
function validateField(field) {
    form_errors[field.name] = `${field.name}:  ${field.validationMessage}`;
    return field.checkValidity();
}
function maskingInput(input) {
    input.addEventListener('input', () => {
        form_errors[input.name] = '';
        if (validateField(input)) {
            //make sure the input is only using common letters, numbers and symbols
            const regex = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
            if (regex.test(input.value)) {
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
        form_errors[input.name] = `${input.name}:  ${input.validationMessage}`;
        updateAlertOutput();
    });
}
function updateCharacterCount() {
    statusOutput.textContent = `${commentsTextArea.value.length}/${commentsTextArea.maxLength} characters`;
    if (commentsTextArea.value.length > commentsTextArea.maxLength) {
        statusOutput.style.color = 'red';
    }
    else if (commentsTextArea.value.length >= commentsTextArea.maxLength - 20) {
        statusOutput.style.color = 'orange';
    }
}
function flashField(field) {
    field.classList.add('rotating-border');
    setTimeout(() => {
        field.classList.remove('rotating-border');
    }, TIMEOUT);
}
/* endregion */
/* region json localstorage and JSONbin.io */
document.addEventListener('DOMContentLoaded', async () => {
    //we will store data into localstorage
    const articles = await (await fetch("/static/json/articles.json")).json();
    localStorage.setItem('articles', JSON.stringify(articles));
});
const loadLocalBtn = document.getElementById('load-articles-local');
const loadRemoteBtn = document.getElementById('load-articles-remote');
loadLocalBtn.addEventListener('click', onLoadLocal);
loadRemoteBtn.addEventListener('click', onLoadRemote);
function onLoadLocal() {
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    renderArticles(articles);
}
function onLoadRemote() {
    fetch('https://api.jsonbin.io/b/67cfaf218561e97a50e9ba84/latest', {
        headers: {
            "X-Master-Key": "$2a$10$i2gj0SpjZM8Hum.j/TPrdelU18/u8C2k8RFs7s4C9KktC5wFVmGJS",
            "X-Access-Key": "$2a$10$2JISknW1XPeWCAx4bjCZW.BjoYJOTV02URe5EiZ12c23dV6NycG72",
        }
    })
        .then(response => response.json())
        .then(data => {
        localStorage.setItem('articles', JSON.stringify(data));
        renderArticles(data);
    })
        .catch(error => onLoadLocal());
}
function renderArticles(articles) {
    const articleList = document.getElementById('articles-list');
    articleList.innerHTML = '';
    articles.forEach((article) => {
        const card = document.createElement('project-card');
        card.setAttribute('title', article.title);
        card.setAttribute('subtitle', article.subtitle);
        card.setAttribute('src', article.src);
        card.setAttribute('desc', article.desc);
        card.setAttribute('href', article.href);
        articleList.appendChild(card);
    });
}
/* endregion */ 
