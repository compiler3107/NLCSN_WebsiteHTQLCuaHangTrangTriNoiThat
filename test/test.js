const  readXlsxFile =require('read-excel-file/node');

readXlsxFile('./test.xlsx').then((rows) => {
  console.log(rows)
  // each row being an array of cells.
})
