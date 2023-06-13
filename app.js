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

const getCategoryName = (id) => getData("categories").find(categ => categ.id === id).categoryName

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
    EXPENSE: "expense",
    EARNING: "earning"
}

const renderTransactions = (transactions) => {
    cleanContainer("#table-data")
    if (transactions.length) {
        hideElements(["#no-transactions-message"])
        showElements(["#transaction-table"])
        for (const { id, description, type, category, date, amount} of transactions) {
            const categoryName = getCategoryName(category)
            const isExpense = type === TRANSACTION_TYPE.EXPENSE
            $("#table-data").innerHTML += `
                <tr class="flex justify-between items-center flex-wrap mb-4 md:mb-0 text-lg sm:text-base">
                    <td class="basis-1/2 sm:basis-auto text-left font-medium py-4">${description}</td>
                    <td class="basis-1/2 sm:basis-auto text-right md:text-left py-3"><span class="py-1 px-2.5 text-base font-normal text-teal-600 bg-teal-100/30 rounded">${categoryName}</span></td>
                    <td class="text-right py-4 hidden md:block">${date}</td>
                    <td class="text-right text-2xl sm:text-base font-bold py-3 ${isExpense ? "text-red-600" : "text-green-600" }">${isExpense ? "-" : "+"}${amount}</td>
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
    cleanContainer("#category-menu")
    const categoriesSorted = categories.toSorted((a, b) => {
        if (a.categoryName < b.categoryName) return -1
        if (a.categoryName > b.categoryName) return 1
        return 0
    })
    $("#category-menu").innerHTML += `
        <option value="" aria-label="Mostrar todas">Todas</option>`
    for (const { categoryName, id } of categoriesSorted) { 
        $("#category-option").innerHTML += `
            <option value="${id}" aria-label="${categoryName}">${categoryName}</option>
        `
        $("#category-menu").innerHTML += `
        <option value="${id}" aria-label="${categoryName}">${categoryName}</option>
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
    for (const { categoryName, id } of categoriesSorted) {
        $("#category-data").innerHTML += `
        <tr class="flex justify-between items-center flex-wrap mb-3 text-base">
            <td class="basis-1/2 sm:basis-auto text-left py-3"><span class="py-1 px-2.5 text-sm font-normal text-teal-600 bg-teal-100/30 rounded">${categoryName}</span>
            </td>
            <td class="flex justify-end gap-4 py-4">
                <button class="btn-edit-category text-slate-50" aria-label="Editar categoría" onclick="editCategoryForm('${id}')">
                    <span class="py-2 px-3 bg-green-600/90 hover:bg-green-700/90 rounded"><i class="fa-solid fa-pen" aria-hidden="true"></i></span>
                </button>
                <button class="btn-delete-category text-slate-50" aria-label="Eliminar categoría" onclick="deleteCategory('${id}')">
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

const validateCategoryForm = () => {
    const category = $("#category-name").value.trim()

    if (category == "") {
        showElements([".category-error"])
        $("#category-name").classList.add("border-red-600")
    } else {
        hideElements([".category-error"])
        $("#category-name").classList.remove("border-red-600")
    }
    return category !== ""
}

const initializeDate = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const initialDate = `${year}-${month}-01`
    $("#date-filter").value = initialDate
}

// DATA STORAGE

const saveTransactionData = (transactionId) => {
    return {
        id: transactionId ? transactionId : randomId(),
        description: $("#transaction-description").value,
        type: $("#transaction-type").value,
        category: $("#category-option").value,
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

const addTransaction = () => {
    const currentTransactions = getData("transactions")
    const newTransaction = saveTransactionData()
    currentTransactions.push(newTransaction)
    setData("transactions", currentTransactions)
    renderTransactions(currentTransactions)
}

const addCategory = () => {
    const currentCategories = getData("categories")
    const newCategory = saveCategoryData()
    currentCategories.push(newCategory)
    setData("categories", currentCategories)
    renderCategoriesTable(currentCategories)
}

const deleteTransaction = (id) => {
    const currentTransactions = getData("transactions").filter(transaction => transaction.id !== id)
    setData("transactions", currentTransactions)
    renderTransactions(currentTransactions)
}

const deleteTransactionsByCategory = (category) => {
    const currentTransactions = getData("transactions").filter(transaction => transaction.category !== category)
    setData("transactions", currentTransactions)
    renderTransactions(currentTransactions)
}

const deleteCategory = (id) => {
    const currentCategories = getData("categories").filter(category => category.id !== id)
    setData("categories", currentCategories)
    renderCategoriesTable(currentCategories)
    renderCategoriesOptions(currentCategories)
    deleteTransactionsByCategory(id)
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

const editCategory = () => {
    const categoryId = $("#btn-edit-category").getAttribute("data-id")
    const editedCategories = getData("categories").map(category => {
        if (category.id === categoryId) {
            return saveCategoryData(category.id)
        }
        return category
    })
    setData("categories", editedCategories)
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

const editCategoryForm = (id) => {
    hideElements(["#new-category-title", "#btn-add-category", "#category-table"])
    showElements(["#edit-category-title", "#edit-btns-container"])
    $("#edit-function-container").classList.add("flex-col")
    $("#edit-function-container").classList.remove("flex-row")
    $("#btn-edit-category").setAttribute("data-id", id)
    const categorySelected = getData("categories").find(category => category.id === id)
    $("#category-name").value = categorySelected.categoryName
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



// FILTERS

const getfilteredTransactions = () => {
    const dateValue = $("#date-filter").value
    const currentTransactions = getData("transactions").filter(({ date }) => dateValue <= date)
      
    const typeValue = $("#transaction-option").value
    let transactionsByType = currentTransactions
    if (typeValue) {
      transactionsByType = transactionsByType.filter(({ type }) => type === typeValue)  
    }
    
    const categoryId = $("#category-menu").value
    let transactionsByCategory = transactionsByType
    if (categoryId) {
      transactionsByCategory = transactionsByCategory.filter(({ category }) => category === categoryId)
    }  
  
    const orderValue = $("#order-menu").value
    let transactionsByOrder = transactionsByCategory
    if (orderValue === "most-recent-data") {
      transactionsByOrder = transactionsByCategory.toSorted((a, b) => {
        if (a.date < b.date) return 1
        if (a.date > b.date) return -1
        return 0
      })
    } else if (orderValue === "less-recent-data"){
      transactionsByOrder = transactionsByCategory.toSorted((a, b) => {
        if (a.date < b.date) return -1
        if (a.date > b.date) return 1
        return 0
      })
    } else if (orderValue === "highest-amount"){
      transactionsByOrder = transactionsByCategory.toSorted((a, b) => b.amount - a.amount)
    } else if (orderValue === "lowest-amount"){
      transactionsByOrder = transactionsByCategory.toSorted((a, b) => a.amount - b.amount)
    } else if (orderValue === "ascendant-alphabetical-order"){
      transactionsByOrder = transactionsByCategory.toSorted((a, b) => {
        if (a.description < b.description) return -1
        if (a.description > b.description) return 1
        return 0
      })
    } else if (orderValue === "descendant-alphabetical-order"){
      transactionsByOrder = transactionsByCategory.toSorted((a, b) => 
      {
        if (a.description < b.description) return 1
        if (a.description > b.description) return -1
        return 0
      })
    } 
    return transactionsByOrder
  }

// REPORTS

// Reports Summary

const getCategoryByEarnings = () => (getCategoryReport()).toSorted((a, b) => b.totalEarnings - a.totalEarnings)[0]

const getCategoryByExpenses = () => (getCategoryReport()).toSorted((a, b) => b.totalExpenses - a.totalExpenses)[0]

const getCategoryByBalance = () => (getCategoryReport()).toSorted((a, b) => b.totalBalance - a.totalBalance)[0]

const getMonthByEarnings = () => (getMonthlyReport()).toSorted((a, b) => b.totalEarnings - a.totalEarnings)[0]

const getMonthByExpenses = () => (getMonthlyReport()).toSorted((a, b) => b.totalExpenses - a.totalExpenses)[0]

const renderCategoryByEarnings = () => {
    const { category, totalEarnings} = getCategoryByEarnings()
    $("#report-summary-table-data").innerHTML += `
        <tr class="flex justify-between items-center mb-3 text-sm sm:text-base">
            <td class="flex-1 text-left font-medium py-3">Categoría con mayor ganancia</td>
            <td class="flex-1 text-right py-3"><span class="py-1 px-2.5 text-xs font-normal text-teal-600 bg-teal-100/30 rounded">${category}</span></td>
            <td class="flex-1 text-right font-medium text-green-600 py-3">+$${totalEarnings}</td>
        </tr>
    `
}

const renderCategoryByExpenses = () => {
    const { category, totalExpenses} = getCategoryByExpenses()
    $("#report-summary-table-data").innerHTML += `
        <tr class="flex justify-between items-center mb-3 text-sm sm:text-base">
            <td class="flex-1 text-left font-medium py-3">Categoría con mayor gasto</td>
            <td class="flex-1 text-right py-3"><span class="py-1 px-2.5 text-xs font-normal text-teal-600 bg-teal-100/30 rounded">${category}</span></td>
            <td class="flex-1 text-right font-medium text-red-600 py-3">-$${totalExpenses}</td>
        </tr>
    `
}

const renderCategoryByBalance = () => {
    const { category, totalBalance} = getCategoryByBalance()
    $("#report-summary-table-data").innerHTML += `
        <tr class="flex justify-between items-center mb-3 text-sm sm:text-base">
            <td class="flex-1 text-left font-medium py-3">Categoría con mayor balance</td>
            <td class="flex-1 text-right py-3"><span class="py-1 px-2.5 text-xs font-normal text-teal-600 bg-teal-100/30 rounded">${category}</span></td>
            <td class="flex-1 text-right font-medium py-3">$${totalBalance}</td>
        </tr>
    `
}

const renderMonthByEarnings = () => {
    const { month, totalEarnings} = getMonthByEarnings()
    $("#report-summary-table-data").innerHTML += `
        <tr class="flex justify-between items-center mb-3 text-sm sm:text-base">
            <td class="flex-1 text-left font-medium py-3">Mes con mayor ganancia</td>
            <td class="flex-1 text-right py-3">${month}</td>
            <td class="flex-1 text-right font-medium text-green-600 py-3">+$${totalEarnings}</td>
        </tr>
    `
}

const renderMonthByExpenses = () => {
    const { month, totalExpenses} = getMonthByExpenses()
    $("#report-summary-table-data").innerHTML += `
        <tr class="flex justify-between items-center mb-3 text-sm sm:text-base">
            <td class="flex-1 text-left font-medium py-3">Mes con mayor gasto</td>
            <td class="flex-1 text-right py-3">${month}</td>
            <td class="flex-1 text-right font-medium text-red-600 py-3">-$${totalExpenses}</td>
        </tr>
    `
}

const renderReportSummary = (transactions) => {
    cleanContainer("#report-summary-table-data")
    if (transactions.length) {
        hideElements(["#no-reports-message"])
        showElements(["#report-table"])
        renderCategoryByEarnings()
        renderCategoryByExpenses()
        renderCategoryByBalance()
        renderMonthByEarnings()
        renderMonthByExpenses()
    } else {
        hideElements(["#report-table"])
        showElements(["#no-reports-message"])
    }
}

// Reports by Category

const getCategoryReport = () => {
    const transactions = getData("transactions").toSorted((a, b) => {
        if (a.category < b.category) return -1
        if (a.category > b.category) return 1
        return 0
    })
    
    const categoryReport = []
    let earnings = 0
    let expenses = 0
    let currentCategory = transactions[0].category
    for (const { category, amount, type } of transactions) {
        if (currentCategory !== category) {
            categoryReport.push({
                category: getCategoryName(currentCategory),
                totalEarnings: earnings,
                totalExpenses: expenses,
                totalBalance: earnings - expenses
            })
            earnings = 0
            expenses = 0
            currentCategory = category
        }
        if (type === TRANSACTION_TYPE.EXPENSE) {
            expenses += amount
        } else {
            earnings += amount
        }
    }
    categoryReport.push({
        category: getCategoryName(currentCategory),
        totalEarnings: earnings,
        totalExpenses: expenses,
        totalBalance: earnings - expenses
    })
    return categoryReport.toSorted((a, b) => {
        if (a.category < b.category) return -1
        if (a.category > b.category) return 1
        return 0
        })
}

const renderCategoryReport = (transactions) => {
    cleanContainer("#category-table-data")
    if (transactions.length) {
        hideElements(["#no-reports-message"])
        showElements(["#report-table"])
        for (const { category, totalEarnings, totalExpenses, totalBalance} of getCategoryReport()) {
            $("#category-table-data").innerHTML += `
            <tr class="flex justify-between text-sm sm:text-base">
                <td class="flex-1 text-left font-medium py-3">${category}</td>
                <td class="flex-1 text-right text-green-600 py-3">+$${totalEarnings}</td>
                <td class="flex-1 text-right text-red-600 py-3">-$${totalExpenses}</td>
                <td class="flex-1 text-right py-3">$${totalBalance}</td>
            </tr>
            `
        }
    } else {
        hideElements(["#report-table"])
        showElements(["#no-reports-message"])
    }
}

// Reports by Month

const getMonth = (date) => `${date.slice(5, 7)}/${date.slice(0, 4)}`

const getMonthlyReport = () => {
    const transactions = getData("transactions").toSorted((a, b) => b.date - a.date)
    const monthlyReport = []
    let earnings = 0
    let expenses = 0
    let currentMonth = getMonth(transactions[0].date)
    for (const { date, amount, type } of transactions) {
        if (currentMonth !== getMonth(date)) {
            monthlyReport.push({
                month: currentMonth,
                totalEarnings: earnings,
                totalExpenses: expenses,
                totalBalance: earnings - expenses
            })
            earnings = 0
            expenses = 0
            currentMonth = getMonth(date)
        }
        if (type === TRANSACTION_TYPE.EXPENSE) {
            expenses += amount
        } else {
            earnings += amount
        }
    }
    monthlyReport.push({
        month: currentMonth,
        totalEarnings: earnings,
        totalExpenses: expenses,
        totalBalance: earnings - expenses
    })
    return monthlyReport
}

const renderMonthlyReport = (transactions) => {
    cleanContainer("#monthly-table-data")
    if (transactions.length) {
        hideElements(["#no-reports-message"])
        showElements(["#report-table"])
        for (const { month, totalEarnings, totalExpenses, totalBalance} of getMonthlyReport()) {
            $("#monthly-table-data").innerHTML += `
            <tr class="flex justify-between text-sm sm:text-base">
                <td class="flex-1 text-left font-medium py-3">${month}</td>
                <td class="flex-1 text-right text-green-600 py-3">+$${totalEarnings}</td>
                <td class="flex-1 text-right text-red-600 py-3">-$${totalExpenses}</td>
                <td class="flex-1 text-right py-3">$${totalBalance}</td>
            </tr>
            `
        }
    } else {
        hideElements(["#report-table"]) 
        showElements(["#no-reports-message"])
    }
}

// EVENTS

const initializeApp = () => {
    initializeDate()
    setData("transactions", allTransactions)
    setData("categories", allCategories)
    renderTransactions(getfilteredTransactions())
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
        renderTransactions(getfilteredTransactions())
    })
    
    $("#category-link").addEventListener("click", () => {
        showElements(["#category-form-section"])
        hideElements(["#balance-section", "#transaction-form-section", "#reports-section"])
    })

    $("#reports-link").addEventListener("click", () => {
        showElements(["#reports-section"])
        hideElements(["#balance-section", "#transaction-form-section", "#category-form-section"])
        renderReportSummary(getData("transactions"))
        renderCategoryReport(getData("transactions"))
        renderMonthlyReport(getData("transactions"))
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
        $("#new-transaction-form").reset()
    })

    $("#btn-create-transaction").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateTransactionForm()) {
            addTransaction()
            showElements(["#new-success-message"])
            setTimeout(() => hideElements(["#new-success-message"]), 2000)
            renderTransactions(getfilteredTransactions())
            $("#new-transaction-form").reset()
        }
    })

    $("#btn-cancel-transaction").addEventListener("click", (e) => {
        e.preventDefault()
        hideElements(["#transaction-form-section"])
        showElements(["#balance-section", "#transaction-section"])
        renderTransactions(getfilteredTransactions())
    })

    $("#btn-edit-transaction").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateTransactionForm()) {
            editTransaction()
            showElements(["#edit-success-message"])
            setTimeout(() => hideElements(["#edit-success-message"]), 2000)
            renderTransactions(getfilteredTransactions())
            $("#new-transaction-form").reset()
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
        if (validateCategoryForm()) {
            addCategory()
            const currentCategories = getData("categories")
            renderCategoriesOptions(currentCategories)
            renderCategoriesTable(currentCategories)
            $("#new-category-form").reset()
        }
    })

    $("#btn-edit-category").addEventListener("click", (e) => {
        e.preventDefault()
        if (validateCategoryForm()) {
            editCategory()
            showElements(["#edit-category-success-message"])
            setTimeout(() => hideElements(["#edit-category-success-message"]), 2000)
            const currentCategories = getData("categories")
            renderCategoriesOptions(currentCategories)
            renderCategoriesTable(currentCategories)
            $("#new-category-form").reset()
        }
    })

    $("#btn-cancel-category").addEventListener("click", (e) => {
        e.preventDefault()
        hideElements(["#edit-category-title", "#edit-btns-container"])
        showElements(["#new-category-title", "#btn-add-category", "#category-table"])   
        $("#edit-function-container").classList.remove("flex-col")
        $("#edit-function-container").classList.add("flex-row")
    })

    $("#date-filter").addEventListener("input", () => {
        const filteredTransactions = getfilteredTransactions()
        renderTransactions(filteredTransactions)
    })
      
    $("#transaction-option").addEventListener("input", () => {
        const filteredTransactions = getfilteredTransactions()
        renderTransactions(filteredTransactions)
    })
      
    $("#category-menu").addEventListener("input", () => {
        const filteredTransactions = getfilteredTransactions()
        renderTransactions(filteredTransactions)
    })
      
    $("#order-menu").addEventListener("input", () => {
        const filteredTransactions = getfilteredTransactions()
        renderTransactions(filteredTransactions)
    }) 

}

window.addEventListener("load", initializeApp)