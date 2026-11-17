from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)

DATABASE = "library.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# Create database
def create_database():

    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            status TEXT DEFAULT 'Available'
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            member_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# Home page
@app.route("/")
def home():

    return render_template("index.html")


# Get all books
@app.route("/api/books", methods=["GET"])
def get_books():

    conn = get_db()

    books = conn.execute(
        "SELECT * FROM books ORDER BY id DESC"
    ).fetchall()

    conn.close()

    return jsonify([
        dict(book) for book in books
    ])


# Add book
@app.route("/api/books", methods=["POST"])
def add_book():

    data = request.json

    book_id = data["book_id"]
    title = data["title"]
    author = data["author"]

    conn = get_db()

    try:

        conn.execute("""
            INSERT INTO books
            (book_id, title, author)
            VALUES (?, ?, ?)
        """, (book_id, title, author))

        conn.commit()

        message = "Book added successfully"

    except sqlite3.IntegrityError:

        conn.close()

        return jsonify({
            "error": "Book ID already exists"
        }), 400

    conn.close()

    return jsonify({
        "message": message
    })


# Delete book
@app.route("/api/books/<book_id>", methods=["DELETE"])
def delete_book(book_id):

    conn = get_db()

    conn.execute(
        "DELETE FROM books WHERE book_id = ?",
        (book_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Book deleted successfully"
    })


# Add member
@app.route("/api/members", methods=["POST"])
def add_member():

    data = request.json

    member_id = data["member_id"]
    name = data["name"]

    conn = get_db()

    try:

        conn.execute("""
            INSERT INTO members
            (member_id, name)
            VALUES (?, ?)
        """, (member_id, name))

        conn.commit()

    except sqlite3.IntegrityError:

        conn.close()

        return jsonify({
            "error": "Member ID already exists"
        }), 400

    conn.close()

    return jsonify({
        "message": "Member added successfully"
    })


# Get members
@app.route("/api/members", methods=["GET"])
def get_members():

    conn = get_db()

    members = conn.execute(
        "SELECT * FROM members ORDER BY id DESC"
    ).fetchall()

    conn.close()

    return jsonify([
        dict(member) for member in members
    ])


# Issue book
@app.route("/api/issue", methods=["POST"])
def issue_book():

    data = request.json

    book_id = data["book_id"]

    conn = get_db()

    book = conn.execute(
        "SELECT * FROM books WHERE book_id = ?",
        (book_id,)
    ).fetchone()

    if book is None:

        conn.close()

        return jsonify({
            "error": "Book not found"
        }), 404

    if book["status"] == "Issued":

        conn.close()

        return jsonify({
            "error": "Book is already issued"
        }), 400

    conn.execute("""
        UPDATE books
        SET status = 'Issued'
        WHERE book_id = ?
    """, (book_id,))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Book issued successfully"
    })


# Return book
@app.route("/api/return/<book_id>", methods=["PUT"])
def return_book(book_id):

    conn = get_db()

    book = conn.execute(
        "SELECT * FROM books WHERE book_id = ?",
        (book_id,)
    ).fetchone()

    if book is None:

        conn.close()

        return jsonify({
            "error": "Book not found"
        }), 404

    conn.execute("""
        UPDATE books
        SET status = 'Available'
        WHERE book_id = ?
    """, (book_id,))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Book returned successfully"
    })


# Run application

if __name__ == "__main__":

    create_database()

    app.run(debug=True)
    from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)

@app.route("/add_book", methods=["POST"])
def add_book():
    title = request.form["title"]
    author = request.form["author"]

    conn = sqlite3.connect("library.db")
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO books (title, author) VALUES (?, ?)",
        (title, author)
    )

    conn.commit()
    conn.close()

    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)