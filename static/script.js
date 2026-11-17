// ===============================
// LIBRARY DATA
// ===============================

let books = [

    {
        id: "B001",
        title: "Java Programming",
        author: "Herbert Schildt",
        status: "Available"
    },

    {
        id: "B002",
        title: "Python Programming",
        author: "Guido van Rossum",
        status: "Available"
    },

    {
        id: "B003",
        title: "Data Structures",
        author: "Seymour Lipschutz",
        status: "Available"
    },

    {
        id: "B004",
        title: "Web Development",
        author: "Jon Duckett",
        status: "Available"
    }

];


let members = [];


// ===============================
// DISPLAY BOOKS
// ===============================

function displayBooks(bookData = books) {

    const bookList =
        document.getElementById("bookList");

    bookList.innerHTML = "";


    bookData.forEach(function(book) {

        let row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${book.id}</td>

            <td>${book.title}</td>

            <td>${book.author}</td>

            <td>
                <span class="${
                    book.status === "Available"
                    ? "available"
                    : "issued"
                }">

                    ${book.status}

                </span>
            </td>

            <td>

                <button
                    class="delete"
                    onclick="deleteBook('${book.id}')">

                    Delete

                </button>

            </td>

        `;


        bookList.appendChild(row);

    });


    updateDashboard();
}


// ===============================
// ADD BOOK
// ===============================

function openAddBook() {

    document.getElementById(
        "bookModal"
    ).style.display = "flex";

}


function closeAddBook() {

    document.getElementById(
        "bookModal"
    ).style.display = "none";

}


function addBook() {

    const id =
        document.getElementById(
            "newBookId"
        ).value.trim();


    const title =
        document.getElementById(
            "newBookTitle"
        ).value.trim();


    const author =
        document.getElementById(
            "newBookAuthor"
        ).value.trim();


    if (id === "" ||
        title === "" ||
        author === "") {

        alert("Please fill all fields.");

        return;
    }


    const duplicate =
        books.some(function(book) {

            return book.id.toLowerCase()
                === id.toLowerCase();

        });


    if (duplicate) {

        alert("Book ID already exists.");

        return;
    }


    books.push({

        id: id,

        title: title,

        author: author,

        status: "Available"

    });


    displayBooks();


    document.getElementById(
        "newBookId"
    ).value = "";


    document.getElementById(
        "newBookTitle"
    ).value = "";


    document.getElementById(
        "newBookAuthor"
    ).value = "";


    closeAddBook();


    alert("Book added successfully!");

}


// ===============================
// DELETE BOOK
// ===============================

function deleteBook(id) {

    const book =
        books.find(function(book) {

            return book.id === id;

        });


    if (book.status === "Issued") {

        alert(
            "Issued book cannot be deleted."
        );

        return;
    }


    if (!confirm(
        "Do you want to delete this book?"
    )) {

        return;
    }


    books =
        books.filter(function(book) {

            return book.id !== id;

        });


    displayBooks();

}


// ===============================
// SEARCH
// ===============================

document.getElementById(
    "search"
).addEventListener(
    "input",
    function() {

        const value =
            this.value.toLowerCase();


        const result =
            books.filter(function(book) {

                return (

                    book.id
                        .toLowerCase()
                        .includes(value)

                    ||

                    book.title
                        .toLowerCase()
                        .includes(value)

                    ||

                    book.author
                        .toLowerCase()
                        .includes(value)

                );

            });


        displayBooks(result);

    }
);


// ===============================
// ADD MEMBER
// ===============================

function addMember() {

    const name =
        document.getElementById(
            "memberName"
        ).value.trim();


    const id =
        document.getElementById(
            "memberId"
        ).value.trim();


    if (name === "" || id === "") {

        alert("Please enter member details.");

        return;
    }


    const existing =
        members.some(function(member) {

            return member.id === id;

        });


    if (existing) {

        alert("Student ID already exists.");

        return;
    }


    members.push({

        id: id,

        name: name

    });


    displayMembers();


    document.getElementById(
        "memberName"
    ).value = "";


    document.getElementById(
        "memberId"
    ).value = "";


    alert("Member added successfully!");

}


// ===============================
// DISPLAY MEMBERS
// ===============================

function displayMembers() {

    const list =
        document.getElementById(
            "memberList"
        );


    list.innerHTML = "";


    members.forEach(function(member) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${member.id}</td>

            <td>${member.name}</td>

        `;


        list.appendChild(row);

    });


    updateDashboard();
}


// ===============================
// ISSUE BOOK
// ===============================

function issueBook() {

    const memberId =
        document.getElementById(
            "issueMember"
        ).value.trim();


    const bookId =
        document.getElementById(
            "issueBook"
        ).value.trim();


    const member =
        members.find(function(member) {

            return member.id === memberId;

        });


    if (!member) {

        alert("Member not found.");

        return;
    }


    const book =
        books.find(function(book) {

            return book.id === bookId;

        });


    if (!book) {

        alert("Book not found.");

        return;
    }


    if (book.status === "Issued") {

        alert("Book is already issued.");

        return;
    }


    book.status = "Issued";


    displayBooks();


    document.getElementById(
        "issueMember"
    ).value = "";


    document.getElementById(
        "issueBook"
    ).value = "";


    alert(
        "Book issued successfully to "
        + member.name
    );

}


// ===============================
// RETURN BOOK
// ===============================

function returnBook() {

    const bookId =
        document.getElementById(
            "returnBookId"
        ).value.trim();


    const book =
        books.find(function(book) {

            return book.id === bookId;

        });


    if (!book) {

        alert("Book not found.");

        return;
    }


    if (book.status === "Available") {

        alert("This book is already available.");

        return;
    }


    book.status = "Available";


    displayBooks();


    document.getElementById(
        "returnBookId"
    ).value = "";


    alert("Book returned successfully!");

}


// ===============================
// DASHBOARD
// ===============================

function updateDashboard() {

    const total =
        books.length;


    const available =
        books.filter(function(book) {

            return book.status === "Available";

        }).length;


    const issued =
        books.filter(function(book) {

            return book.status === "Issued";

        }).length;


    document.getElementById(
        "totalBooks"
    ).textContent = total;


    document.getElementById(
        "availableBooks"
    ).textContent = available;


    document.getElementById(
        "issuedBooks"
    ).textContent = issued;


    document.getElementById(
        "totalMembers"
    ).textContent = members.length;

}


// ===============================
// INITIAL LOAD
// ===============================

displayBooks();

displayMembers();

updateDashboard();