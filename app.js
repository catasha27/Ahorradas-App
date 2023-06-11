// UTILITIES

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)
const cleanContainer = (selector) => $(selector).innerHTML = ''
const hideElements = (selectors) => {
    for (const eachSelector of selectors) {
        $(selector).classList.add('hidden')
    }
}

const showElements = (selectors) => {
    for (const eachSelector of selectors) {
        $(selector).classList.remove('hidden')
    }
}



