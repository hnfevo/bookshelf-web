document.addEventListener("DOMContentLoaded", function () {
    //Menyimpan data buku
    const bookshelf = {
      incomplete: [], //"Belum selesai dibaca"
      complete: [],   //"Selesai dibaca"
    };
  
    //Merender daftar buku pada rak
    function renderBookList() {
      renderIncompleteBookList();
      renderCompleteBookList();
    }
  
    //Merender daftar buku "Belum selesai dibaca"
    function renderIncompleteBookList() {
      const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
      incompleteBookshelfList.innerHTML = "";
  
      bookshelf.incomplete.forEach((book) => {
        const bookItem = createBookItem(book);
        incompleteBookshelfList.appendChild(bookItem);
      });
    }
  
    //Merender daftar buku "Selesai dibaca"
    function renderCompleteBookList() {
      const completeBookshelfList = document.getElementById("completeBookshelfList");
      completeBookshelfList.innerHTML = "";
  
      bookshelf.complete.forEach((book) => {
        const bookItem = createBookItem(book);
        completeBookshelfList.appendChild(bookItem);
      });
    }
  
    //Membuat elemen buku pada daftar
    function createBookItem(book) {
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item");
  
      //Membuat elemen judul buku
      const title = document.createElement("h3");
      title.textContent = book.title;
  
      //Membuat elemen penulis buku
      const author = document.createElement("p");
      author.textContent = `Penulis: ${book.author}`;
  
      //Membuat elemen tahun terbit buku
      const year = document.createElement("p");
      year.textContent = `Tahun: ${book.year}`;
  
      //Membuat elemen selesai dibaca, belum selesai dibaca, hapus buku
      const actionDiv = document.createElement("div");
      actionDiv.classList.add("action");
  
      //Tombol untuk memindahkan buku
      const moveButton = document.createElement("button");
      moveButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
      moveButton.classList.add("green");
      moveButton.addEventListener("click", function () {
        moveBook(book);
      });
  
      //Tombol untuk menghapus buku
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Hapus buku";
      deleteButton.classList.add("red");
      deleteButton.addEventListener("click", function () {
        deleteBook(book);
      });
  
      actionDiv.appendChild(moveButton);
      actionDiv.appendChild(deleteButton);
  
      //Menyusun elemen buku
      bookItem.appendChild(title);
      bookItem.appendChild(author);
      bookItem.appendChild(year);
      bookItem.appendChild(actionDiv);
  
      return bookItem;
    }
  
    //Memindahkan buku antara rak
    function moveBook(book) {
      if (book.isComplete) {
        //Jika buku selesai dibaca, pindahkan ke rak "Belum selesai dibaca"
        bookshelf.complete = bookshelf.complete.filter((b) => b.id !== book.id);
        book.isComplete = false;
        bookshelf.incomplete.push(book);
      } else {
        //Jika buku belum selesai dibaca, pindahkan ke rak "Selesai dibaca"
        bookshelf.incomplete = bookshelf.incomplete.filter((b) => b.id !== book.id);
        book.isComplete = true;
        bookshelf.complete.push(book);
      }
  
      //Merender kembali daftar buku setelah pemindahan
      renderBookList();
  
      //Menyimpan perubahan ke dalam localStorage
      updateLocalStorage();
    }
  
    //Menghapus buku dari rak
    function deleteBook(book) {
      if (book.isComplete) {
        //Jika buku selesai dibaca, hapus dari rak "Selesai dibaca"
        bookshelf.complete = bookshelf.complete.filter((b) => b.id !== book.id);
      } else {
        //Jika buku belum selesai dibaca, hapus dari rak "Belum selesai dibaca"
        bookshelf.incomplete = bookshelf.incomplete.filter((b) => b.id !== book.id);
      }
  
      //Merender kembali daftar buku setelah penghapusan
      renderBookList();
  
      //Menyimpan perubahan ke dalam localStorage
      updateLocalStorage();
    }
  
    //Menambahkan buku ke dalam rak
    function addBookToShelf(title, author, year, isComplete) {
      //Membuat objek buku baru
      const newBook = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
      };
  
      //Menyimpan buku ke dalam rak yang sesuai
      if (isComplete) {
        bookshelf.complete.push(newBook);
      } else {
        bookshelf.incomplete.push(newBook);
      }
  
      //Merender kembali daftar buku setelah penambahan
      renderBookList();
  
      //Menyimpan perubahan ke dalam localStorage
      updateLocalStorage();
    }
  
    //Mengupdate data di localStorage
    function updateLocalStorage() {
      localStorage.setItem("bookshelf", JSON.stringify(bookshelf));
    }
  
    //Memuat data dari localStorage saat halaman dimuat
    function loadLocalStorage() {
      const storedData = localStorage.getItem("bookshelf");
  
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        bookshelf.incomplete = parsedData.incomplete || [];
        bookshelf.complete = parsedData.complete || [];
        renderBookList();
      }
    }
  
    //Memuat data dari localStorage saat halaman dimuat
    loadLocalStorage();
  
    //Menangani submit form untuk menambahkan buku
    const inputBookForm = document.getElementById("inputBook");
    inputBookForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      //Mendapatkan nilai input dari form
      const titleInput = document.getElementById("inputBookTitle");
      const authorInput = document.getElementById("inputBookAuthor");
      const yearInput = document.getElementById("inputBookYear");
      const isCompleteInput = document.getElementById("inputBookIsComplete");
  
      //Mendapatkan nilai teks dari input
      const title = titleInput.value;
      const author = authorInput.value;
      const year = parseInt(yearInput.value);
      const isComplete = isCompleteInput.checked;
  
      //Memastikan input buku lengkap sebelum menambahkan
      if (title && author && !isNaN(year)) {
        addBookToShelf(title, author, year, isComplete);
  
        //Mengosongkan nilai input setelah buku ditambahkan
        titleInput.value = "";
        authorInput.value = "";
        yearInput.value = "";
        isCompleteInput.checked = false;
      } else {
        //Menampilkan peringatan jika input tidak lengkap
        alert("Mohon lengkapi data buku dengan benar!");
      }
    });
  });
  