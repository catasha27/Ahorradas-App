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

const randomId = () => self.crypto.randomUUID()

const getData = (key) => JSON.parse(localStorage.getItem(key))
const setData = (key, array) => localStorage.setItem(key, JSON.stringify(array))

const allTransactions = getData("transactions") || []

// RENDERS

const TRANSACTION_TYPE = {
    EXPENSE: "expenses",
    EARNING: "earning"
}

const renderTransactions = (transactions) => {
    cleanContainer("#table-data")
    if (transactions.length) {
        hideElements(["#no-transactions-message"])
        showElements(["#transaction-table"])
        for (const { id, description, type, category, date, amount} of transactions) {
            const isExpense = type === TRANSACTION_TYPE.EXPENSE
            $("#table-data").innerHTML += `
                <tr class="flex justify-between items-center flex-wrap mb-4 md:mb-0 text-lg sm:text-base">
                    <td class="basis-1/2 sm:basis-auto text-left font-medium py-4">${description}</td>
                    <td class="basis-1/2 sm:basis-auto text-right md:text-left py-3"><span class="py-1 px-2.5 text-base font-normal text-teal-600 bg-teal-100/30 rounded">${category}</span></td>
                    <td class="text-right py-4 hidden md:block">${date}</td>
                    <td class="text-right text-2xl sm:text-base font-bold py-3 ${isExpense ? "text-green-600" : "text-red-600"}">${isExpense ? "+" : "-"}${amount}</td>
                    <td class="flex justify-end gap-4 py-4">
                        <button class="btn-edit-transaction text-slate-50" aria-label="Editar operación">
                            <span class="py-2 px-3 bg-green-600/90 hover:bg-green-700/90 rounded"><i class="fa-solid fa-pen" aria-hidden="true"></i></span>
                        </button>
                        <button class="btn-delete-transaction text-slate-50" aria-label="Eliminar operación" onclick="deleteTransaction('${id}')">
                            <span class="py-2 px-[13px] bg-red-600/90 hover:bg-red-700/90 rounded"><i class="fa-solid fa-trash" aria-hidden="true"></i></span>
                        </button>
                    </td>
                </tr>
            `
        }
    } else {
        hideElements(["#transaction-table"])
        showElements(["#no-transactions-message"])

    }
}

// DATA STORAGE

const saveTransactionData = () => {
    return {
        id: randomId(),
        description: $("#transaction-description").value,
        type: $("#transaction-type").value,
        category: $("#category-option").value,
        amount: $("#amount").valueAsNumber,
        date: $("#transaction-date").value
    }
}

const addTransaction = () => {
    const currentTransactions = getData("transactions")
    const newTransaction = saveTransactionData()
    currentTransactions.push(newTransaction)
    setData("transactions", currentTransactions)
    renderTransactions(currentTransactions)
}

const deleteTransaction = (id) => {
    const currentTransactions = getData("transactions").filter(transaction => transaction.id !== id)
    setData("transactions", currentTransactions)
    renderTransactions(currentTransactions)
}

// EVENTS

const initializeApp = () => {
    setData("transactions", allTransactions)
    renderTransactions(allTransactions)

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

    const clickOnFilters = () => {
        showElements([".filter-menu-container", "#hide-filters-menu"])
        hideElements(["#show-filters-menu"])
    }
    
    const clickOnCloseFilters = () => {
        hideElements([".filter-menu-container", "#hide-filters-menu"])
        showElements(["#show-filters-menu"])
    }

    $("#btn-filter-toggle").addEventListener("click", () => {
        if ($("#show-filters-menu").classList.contains("hidden")) {
            clickOnCloseFilters()
        } else {
            clickOnFilters()
        }
    })

    $("#btn-add-transaction").addEventListener("click", () => {
        showElements(["#transaction-form-section"])
        hideElements(["#balance-section", "#transaction-section"])
    })

    $("#btn-create-transaction").addEventListener("click", (e) => {
        e.preventDefault()
        addTransaction()
        showElements(["#new-success-message"])
        setTimeout(() => hideElements(["#new-success-message"]), 2000)
    })

    $("#btn-cancel-transaction").addEventListener("click", (e) => {
        e.preventDefault()
        hideElements(["#transaction-form-section"])
        showElements(["#balance-section", "#transaction-section"])
    })


}

window.addEventListener("load", initializeApp)