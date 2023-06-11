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
    })

    $("#balance-link").addEventListener("click", () => {
        showElements(["#balance-section"])
        hideElements(["#transaction-form-section", "#category-form-section", "#reports-section"])
    })
    
    $("#category-link").addEventListener("click", () => {
        showElements(["#category-form-section"])
        hideElements(["#balance-section", "#transaction-form-section", "#reports-section"])
    })

    $("#reports-link").addEventListener("click", () => {
        showElements(["#reports-section"])
        hideElements(["#balance-section", "#transaction-form-section", "#category-form-section"])
    })
}

window.addEventListener("load", initializeApp)