function createBooks() {
  return [
    {
      id: '0',
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Lev Nikolayevich Tolstoy',
      read: false
    },
    {
      id: '1',
      title: 'Les Misérables',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      read: false
    },
    {
      id: '2',
      title: 'The Time Machine',
      genre: 'Science Fiction',
      author: 'H. G. Wells',
      read: false
    },
    {
      id: '3',
      title: 'A Journey into the Center of the Earth',
      genre: 'Science Fiction',
      author: 'Jules Verne',
      read: false
    },
    {
      id: '4',
      title: 'The Dark World',
      genre: 'Fantasy',
      author: 'Henry Kuttner',
      read: false
    },
    {
      id: '5',
      title: 'The Wind in the Willows',
      genre: 'Fantasy',
      author: 'Kenneth Grahame',
      read: false
    },
    {
      id: '6',
      title: 'Life On The Mississippi',
      genre: 'History',
      author: 'Mark Twain',
      read: false
    },
    {
      id: '7',
      title: 'Childhood',
      genre: 'Biography',
      author: 'Lev Nikolayevich Tolstoy',
      read: false
    }
  ];
}

function printBooksSQLInsert() {
  const books = createBooks();

  const sqlBookList = [];
  books.forEach((book, index) => {
    sqlBookList.push(`    (${index}, '${book.title}', '${book.author}')`);
  });

  console.log('INSERT INTO books (id, title, author) VALUES');
  console.log(sqlBookList.join(', \n'));
}

module.exports = {
  createBooks,
  printBooksSQLInsert
};
