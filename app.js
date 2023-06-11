// UTILITIES

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)
const cleanContainer = (selector) => $(selector).innerHTML = ''
const hideElements = (selectors) => {
    for (const eachSelector of selectors) {
        $(eachSelector).classList.add('hidden')
    }
}

const showElements = (selectors) => {
    for (const eachSelector of selectors) {
        $(eachSelector).classList.remove('hidden')
    }
}

const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, array) => localStorage.setItem(key, JSON.stringify(array))

// EVENTS

const initializeApp = () => {
    const clickOnBurger = () => {
        showElements(["#nav-menu-container", "#close-burger-menu"])
        hideElements(["#show-burger-menu"])
    }
    
    const clickOnClose = () => {
        hideElements(["#nav-menu-container", "#close-burger-menu"])
        showElements(["#show-burger-menu"])
    }

    $("#btn-menu").addEventListener("click", () => {
        if ($("#show-burger-menu").classList.contains("hidden")) {
            clickOnClose()
        } else {
            clickOnBurger()
        }
    }
)}

window.addEventListener("load", initializeApp)