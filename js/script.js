/* =========================================
   DATA TRANSAKSI
========================================= */

let transactions =
    JSON.parse(
        localStorage.getItem("myExpenseTransactions")
    ) || [];


/* ID transaksi yang sedang diedit */

let editingId = null;


/* =========================================
   AMBIL ELEMENT HTML
========================================= */

const transactionForm =
    document.getElementById(
        "transactionForm"
    );

const transactionName =
    document.getElementById(
        "transactionName"
    );

const amount =
    document.getElementById(
        "amount"
    );

const category =
    document.getElementById(
        "category"
    );

const transactionType =
    document.getElementById(
        "transactionType"
    );

const transactionDate =
    document.getElementById(
        "transactionDate"
    );

const description =
    document.getElementById(
        "description"
    );

const transactionList =
    document.getElementById(
        "transactionList"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const filterType =
    document.getElementById(
        "filterType"
    );

const totalIncome =
    document.getElementById(
        "totalIncome"
    );

const totalExpense =
    document.getElementById(
        "totalExpense"
    );

const totalBalance =
    document.getElementById(
        "totalBalance"
    );

const themeToggle =
    document.getElementById(
        "themeToggle"
    );



/* =========================================
   SIMPAN DATA KE LOCAL STORAGE
========================================= */

function saveTransactions() {

    localStorage.setItem(

        "myExpenseTransactions",

        JSON.stringify(
            transactions
        )

    );

}



/* =========================================
   FORMAT RUPIAH
========================================= */

function formatRupiah(
    number
) {

    return new Intl.NumberFormat(

        "id-ID",

        {

            style: "currency",

            currency: "IDR",

            minimumFractionDigits: 0

        }

    ).format(number);

}



/* =========================================
   TAMPILKAN TRANSAKSI
========================================= */

function displayTransactions() {


    const searchKeyword =

        searchInput.value
            .toLowerCase()
            .trim();


    const selectedFilter =

        filterType.value;


    const filteredTransactions =

        transactions.filter(

            function(transaction) {


                const matchesSearch =

                    transaction.name
                        .toLowerCase()
                        .includes(
                            searchKeyword
                        );


                const matchesFilter =

                    selectedFilter === "all"

                    ||

                    transaction.type ===
                        selectedFilter;


                return (

                    matchesSearch

                    &&

                    matchesFilter

                );

            }

        );


    transactionList.innerHTML = "";


    if (
        filteredTransactions.length === 0
    ) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    filteredTransactions.forEach(

        function(transaction) {


            const card =

                document.createElement(
                    "div"
                );


            card.className =
                "transaction-card";


            const typeText =

                transaction.type ===
                    "income"

                    ?

                    "💰 Pemasukan"

                    :

                    "💸 Pengeluaran";


            const amountClass =

                transaction.type ===
                    "income"

                    ?

                    "income"

                    :

                    "expense";


            const amountSymbol =

                transaction.type ===
                    "income"

                    ?

                    "+"

                    :

                    "-";


            card.innerHTML = `

                <div class="transaction-info">

                    <h3>
                        ${transaction.name}
                    </h3>

                    <p>
                        📂 ${transaction.category}
                    </p>

                    <p>
                        📅 ${transaction.date}
                    </p>

                    <p>
                        ${typeText}
                    </p>

                    ${
                        transaction.description

                        ?

                        `<p>
                            📝
                            ${transaction.description}
                        </p>`

                        :

                        ""

                    }

                </div>


                <div>

                    <div
                        class="transaction-amount
                        ${amountClass}"
                    >

                        ${amountSymbol}

                        ${formatRupiah(
                            transaction.amount
                        )}

                    </div>


                    <div
                        class="transaction-actions"
                    >

                        <button
                            class="edit-button"
                            onclick="
                                editTransaction(
                                    ${transaction.id}
                                )
                            "
                        >
                            ✏️ Edit
                        </button>


                        <button
                            class="delete-button"
                            onclick="
                                deleteTransaction(
                                    ${transaction.id}
                                )
                            "
                        >
                            🗑️ Hapus
                        </button>

                    </div>

                </div>

            `;


            transactionList.appendChild(
                card
            );

        }

    );

}



/* =========================================
   TAMBAH / EDIT TRANSAKSI
========================================= */

transactionForm.addEventListener(

    "submit",

    function(event) {


        event.preventDefault();


        const transactionData = {


            name:

                transactionName.value
                    .trim(),


            amount:

                Number(
                    amount.value
                ),


            category:

                category.value,


            type:

                transactionType.value,


            date:

                transactionDate.value,


            description:

                description.value
                    .trim()

        };



        /* =========================
           MODE EDIT
        ========================= */

        if (
            editingId !== null
        ) {


            const index =

                transactions.findIndex(

                    function(transaction) {

                        return (

                            transaction.id ===
                                editingId

                        );

                    }

                );


            if (
                index !== -1
            ) {


                transactions[index] = {


                    id:
                        editingId,


                    ...transactionData

                };

            }


            editingId = null;


            document.querySelector(

                ".primary-button"

            ).textContent =

                "➕ Tambah Transaksi";


            showToast(

                "✏️ Transaksi berhasil diperbarui!"

            );


        }


        /* =========================
           MODE TAMBAH
        ========================= */

        else {


            transactions.push({


                id:

                    Date.now(),


                ...transactionData


            });


            showToast(

                "✅ Transaksi berhasil ditambahkan!"

            );

        }



        saveTransactions();


        displayTransactions();


        updateStatistics();


        transactionForm.reset();


    }

);



/* =========================================
   EDIT TRANSAKSI
========================================= */

function editTransaction(
    id
) {


    const transaction =

        transactions.find(

            function(item) {

                return (
                    item.id === id
                );

            }

        );


    if (
        !transaction
    ) {

        return;

    }


    editingId =
        id;


    transactionName.value =
        transaction.name;


    amount.value =
        transaction.amount;


    category.value =
        transaction.category;


    transactionType.value =
        transaction.type;


    transactionDate.value =
        transaction.date;


    description.value =
        transaction.description;


    document.querySelector(

        ".primary-button"

    ).textContent =

        "💾 Simpan Perubahan";


    transactionForm.scrollIntoView({

        behavior:
            "smooth",

        block:
            "center"

    });

}



/* =========================================
   HAPUS TRANSAKSI
========================================= */

function deleteTransaction(
    id
) {


    const confirmDelete =

        confirm(

            "Apakah kamu yakin ingin menghapus transaksi ini?"

        );


    if (
        !confirmDelete
    ) {

        return;

    }


    transactions =

        transactions.filter(

            function(transaction) {

                return (
                    transaction.id !== id
                );

            }

        );


    saveTransactions();


    displayTransactions();


    updateStatistics();


    showToast(

        "🗑️ Transaksi berhasil dihapus!"

    );

}



/* =========================================
   UPDATE STATISTIK
========================================= */

function updateStatistics() {
    let income = 0;
    let expense = 0;

    transactions.forEach(function(transaction) {
        const transactionAmount = Number(transaction.amount) || 0;

        if (transaction.type === "income") {
            income += transactionAmount;
        } else if (transaction.type === "expense") {
            expense += transactionAmount;
        }
    });

    const balance = income - expense;

    totalIncome.textContent = formatRupiah(income);
    totalExpense.textContent = formatRupiah(expense);
    totalBalance.textContent = formatRupiah(balance);

    // Update Ringkasan Keuangan
const chartIncome = document.getElementById("chartIncome");
const chartExpense = document.getElementById("chartExpense");
const incomeBar = document.getElementById("incomeBar");
const expenseBar = document.getElementById("expenseBar");

if (chartIncome) {
    chartIncome.textContent = formatRupiah(income);
}

if (chartExpense) {
    chartExpense.textContent = formatRupiah(expense);
}

// Hitung persentase progress bar
const total = income + expense;

if (total > 0) {
    if (incomeBar) {
        incomeBar.style.width = (income / total * 100) + "%";
    }

    if (expenseBar) {
        expenseBar.style.width = (expense / total * 100) + "%";
    }
} else {
    if (incomeBar) {
        incomeBar.style.width = "0%";
    }

    if (expenseBar) {
        expenseBar.style.width = "0%";
    }
}

    // Update ringkasan berdasarkan kategori
    updateCategorySummary();
}



/* =========================================
   PENCARIAN
========================================= */

searchInput.addEventListener(

    "input",

    displayTransactions

);



/* =========================================
   FILTER
========================================= */

filterType.addEventListener(

    "change",

    displayTransactions

);



/* =========================================
   DARK MODE
========================================= */

themeToggle.addEventListener(

    "click",

    function() {


        document.body.classList.toggle(

            "dark-mode"

        );


        const darkModeActive =

            document.body.classList.contains(

                "dark-mode"

            );


        localStorage.setItem(

            "darkMode",

            darkModeActive

        );


        themeToggle.textContent =

            darkModeActive

                ?

                "☀️"

                :

                "🌙";

    }

);



/* =========================================
   CEK DARK MODE
========================================= */

const savedDarkMode =

    localStorage.getItem(
        "darkMode"
    );


if (
    savedDarkMode === "true"
) {


    document.body.classList.add(

        "dark-mode"

    );


    themeToggle.textContent =
        "☀️";

}



/* =========================================
   JAM DIGITAL
========================================= */

function updateDigitalClock() {


    const clock =

        document.getElementById(

            "digitalClock"

        );


    if (
        !clock
    ) {

        return;

    }


    const now =
        new Date();


    const hours =

        String(

            now.getHours()

        ).padStart(

            2,

            "0"

        );


    const minutes =

        String(

            now.getMinutes()

        ).padStart(

            2,

            "0"

        );


    const seconds =

        String(

            now.getSeconds()

        ).padStart(

            2,

            "0"

        );


    clock.textContent =

        `${hours}:${minutes}:${seconds}`;

}


updateDigitalClock();


setInterval(

    updateDigitalClock,

    1000

);



/* =========================================
   TANGGAL HARI INI
========================================= */

function updateCurrentDate() {


    const dateElement =

        document.getElementById(

            "currentDate"

        );


    if (
        !dateElement
    ) {

        return;

    }


    const today =
        new Date();


    const options = {


        weekday:
            "long",


        year:
            "numeric",


        month:
            "long",


        day:
            "numeric"

    };


    dateElement.textContent =

        today.toLocaleDateString(

            "id-ID",

            options

        );

}


updateCurrentDate();



/* =========================================
   NOTIFIKASI TOAST
========================================= */

function showToast(
    message
) {


    const container =

        document.getElementById(

            "toastContainer"

        );


    if (
        !container
    ) {

        return;

    }


    const toast =

        document.createElement(

            "div"

        );


    toast.className =
        "toast";


    toast.textContent =
        message;


    container.appendChild(
        toast
    );


    setTimeout(

        function() {


            toast.remove();


        },

        3000

    );

}



/* =========================================
   TAMPILKAN DATA SAAT WEBSITE DIBUKA
========================================= */



/* =========================================
   RINGKASAN PENGELUARAN BERDASARKAN KATEGORI
========================================= */

function updateCategorySummary() {

    const categorySummary =
        document.getElementById(
            "categorySummary"
        );


    if (!categorySummary) {
        return;
    }


    const expenses =
        transactions.filter(

            function(transaction) {

                return (
                    transaction.type ===
                    "expense"
                );

            }

        );


    if (expenses.length === 0) {

        categorySummary.innerHTML = `

            <p class="empty-category">

                Belum ada data pengeluaran.

            </p>

        `;

        return;

    }


    const categories = {};


    expenses.forEach(

        function(transaction) {

            if (
                !categories[
                    transaction.category
                ]
            ) {

                categories[
                    transaction.category
                ] = 0;

            }


            categories[
                transaction.category
            ] += transaction.amount;

        }

    );


    const totalExpense =

        expenses.reduce(

            function(total, transaction) {

                return (

                    total +
                    transaction.amount

                );

            },

            0

        );


    categorySummary.innerHTML = "";


    Object.keys(categories).forEach(

        function(category) {


            const amount =
                categories[category];


            const percentage =

                (
                    amount /
                    totalExpense
                ) * 100;


            const categoryItem =

                document.createElement(
                    "div"
                );


            categoryItem.className =
                "category-item";


            categoryItem.innerHTML = `

                <div class="category-header">

                    <span>
                        📂 ${category}
                    </span>

                    <strong>
                        ${formatRupiah(amount)}
                    </strong>

                </div>


                <div class="category-bar">

                    <div
                        class="category-progress"
                        style="
                            width:
                            ${percentage}%;
                        "
                    ></div>

                </div>

            `;


            categorySummary.appendChild(

                categoryItem

            );

        }

    );

}

/* =========================================
   TAMPILKAN DATA SAAT WEBSITE DIBUKA
========================================= */

displayTransactions();

updateStatistics();