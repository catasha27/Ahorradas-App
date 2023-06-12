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

const defaultCategories = [
    {
        id: randomId(),
        categoryName: "Comida"
    },
    {
        id: randomId(),
        categoryName: "Servicios"
    },
    {
        id: randomId(),
        categoryName: "Salidas"
    },
    {
        id: randomId(),
        categoryName: "Educación"
    },
    {
        id: randomId(),
        categoryName: "Transporte"
    },
    {
        id: randomId(),
        categoryName: "Trabajo"
    },
]

const allTransactions = getData("transactions") || []
const allCategories = getData("categories") || defaultCategories

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
            const categorySelected = getData("categories").find(categ => categ.id === category)
            const isExpense = type === TRANSACTION_TYPE.EXPENSE
            $("#table-data").innerHTML += `
                <tr class="flex justify-between items-center flex-wrap mb-4 md:mb-0 text-lg sm:text-base">
                    <td class="basis-1/2 sm:basis-auto text-left font-medium py-4">${description}</td>
                    <td class="basis-1/2 sm:basis-auto text-right md:text-left py-3"><span class="py-1 px-2.5 text-base font-normal text-teal-600 bg-teal-100/30 rounded">${categorySelected.categoryName}</span></td>
                    <td class="text-right py-4 hidden md:block">${date}</td>
                    <td class="text-right text-2xl sm:text-base font-bold py-3 ${isExpense ? "text-green-600" : "text-red-600"}">${isExpense ? "+" : "-"}${amount}</td>
                    <td class="flex justify-end gap-4 py-4">
                        <button class="btn-edit-transaction text-slate-50" aria-label="Editar operación" onclick="editTransactionForm('${id}')">
                            <span class="py-2 px-3 bg-green-600/90 hover:bg-green-700/90 rounded"><i class="fa-solid fa-pen" aria-hidden="true"></i></span>
                        </button>
                        <button class="btn-delete-transaction text-slate-50" aria-label="Eliminar operación" onclick="openDeleteModal('${id}', '${description}')">
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

const renderCategoriesOptions = (categories) => {
    cleanContainer("#category-option")
    for (const category of categories) { 
        $("#category-option").innerHTML += `
            <option value="${category.categoryName}" data-id="${category.id}" aria-label="${category.categoryName}">${category.categoryName}</option>
        `        
    }
}

const renderCategoriesTable = (categories) => {
    cleanContainer("#category-data")
    const categoriesSorted = categories.toSorted((a, b) => {
        if (a.categoryName < b.categoryName) return -1
        if (a.categoryName > b.categoryName) return 1
        return 0
    })
    for (const category of categoriesSorted) {
        $("#category-data").innerHTML += `
        <tr class="flex justify-between items-center flex-wrap mb-3 text-base">
            <td class="basis-1/2 sm:basis-auto text-left py-3"><span class="py-1 px-2.5 text-sm font-normal text-teal-600 bg-teal-100/30 rounded">${category.categoryName}</span>
            </td>
            <td class="flex justify-end gap-4 py-4">
                <button class="btn-edit-category text-slate-50" aria-label="Editar categoría">
                    <span class="py-2 px-3 bg-green-600/90 hover:bg-green-700/90 rounded"><i class="fa-solid fa-pen" aria-hidden="true"></i></span>
                </button>
                <button class="btn-delete-category text-slate-50" aria-label="Eliminar categoría">
                    <span class="py-2 px-[13px] bg-red-600/90 hover:bg-red-700/90 rounded"><i class="fa-solid fa-trash" aria-hidden="true"></i></span>
                </button>
            </td>
        </tr>
        `
    }
}

const validateTransactionForm = () => {
    const description = $("#transaction-description").value.trim()
    const amount = $("#amount").valueAsNumber

    if (description == "") {
        showElements([".description-error"])
        $("#transaction-description").classList.add("border-red-600")
    } else {
        hideElements([".description-error"])
        $("#transaction-description").classList.remove("border-red-600")
    }

    if (amount == "") {
        showElements([".amount-error"])
        $("#amount").classList.add("border-red-600")
    } else {
        hideElements([".amount-error"])
        $("#amount").classList.remove("border-red-600")
    }

    return description !== "" && amount !== ""
}

// DATA STORAGE

const saveTransactionData = (transactionId) => {
    const categoryId = $("#category-option").options[$("#category-option").selectedIndex].getAttribute("data-id")
    return {
        id: transactionId ? transactionId : randomId(),
        description: $("#transaction-description").value,
        type: $("#transaction-type").value,
        category: categoryId,
        amount: $("#amount").valueAsNumber,
        date: $("#transaction-date").value
    }
}

const saveCategoryData = () => {
    return {
        id: randomId(),
        categoryName: $("#category-name").value
    }
}

const addCategory = () => {
    const currentCategories = getData("categories")
    const newCategory = saveCategoryData()
    currentCategories.push(newCategory)
    setData("categories", currentCategories)
    renderCategoriesTable(currentCategories)
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

const editTransaction = () => {
    const transactionId = $("#btn-edit-transaction").getAttribute("data-id")
    const editedTransactions = getData("transactions").map(transaction => {
        if (transaction.id === transactionId) {
            return saveTransactionData(transaction.id)
        }
        return transaction
    })
    setData("transactions", editedTransactions)
}

const editTransactionForm = (id) => {
    hideElements(["#balance-section", "#new-transaction-title", "#btn-create-transaction"])
    showElements(["#transaction-form-section", "#edit-transaction-title", "#btn-edit-transaction"])
    $("#btn-edit-transaction").setAttribute("data-id", id)
    const transactionSelected = getData("transactions").find(transaction => transaction.id === id)
    $("#transaction-description").value = transactionSelected.description
    $("#transaction-type").value = transactionSelected.type
    $("#category-option").value = transactionSelected.category
    $("#amount").valueAsNumber = transactionSelected.amount
    $("#transaction-date").value = transactionSelected.date
}

const openDeleteModal = (id, description) => {
    showElements(["#transaction-modal"])
    $("#btn-delete-modal").setAttribute("data-id", id)
    $(".transaction-name").innerText = description
    $("#btn-cancel-modal").addEventListener("click", () => {
        hideElements(["#transaction-modal"])
    })
    $("#btn-delete-modal").addEventListener("click", () => {
        const transactionId = $("#btn-delete-modal").getAttribute("data-id")
        deleteTransaction(transactionId)
        hideElements(["#transaction-modal"])
    })
}

// EVENTS

const initializeApp = () => {
    setData("transactions", allTransactions)
    setData("categories", allCategories)
    renderTransactions(allTransactions)
    renderCategoriesOptions(allCategories)
    renderCategoriesTable(allCategories)

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
        showElements(["#transaction-form-section", "#new-transaction-title", "#btn-create-transaction"])
        hideElements(["#balance-section", "#transaction-section", "#edit-transaction-title", "#btn-edit-transaction"])
    })

    $("#btn-create-transaction").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateTransactionForm()) {
            addTransaction()
            showElements(["#new-success-message"])
            setTimeout(() => hideElements(["#new-success-message"]), 2000)
        }
    })

    $("#btn-cancel-transaction").addEventListener("click", (e) => {
        e.preventDefault()
        hideElements(["#transaction-form-section"])
        showElements(["#balance-section", "#transaction-section"])
    })

    $("#btn-edit-transaction").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateTransactionForm()) {
            editTransaction()
            showElements(["#edit-success-message"])
            setTimeout(() => hideElements(["#edit-success-message"]), 2000)
            renderTransactions(getData("transactions"))
        }
    })

    $("#amount").addEventListener("input", (e) => {
        const value = e.target.valueAsNumber
        if (isNaN(value)) {
            $("#amount").value = ""
        }
    })

    $("#btn-add-category").addEventListener("click", (e) => {
        e.preventDefault()
        addCategory()
    })


}

window.addEventListener("load", initializeApp)