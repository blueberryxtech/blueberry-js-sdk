let fileHandleA, fileHandleB;
const savedataoptions = {type: 'saveFile',
    accepts: [{
      description: 'CSV file (*.csv)',
      extensions: ['csv'],
      mimeTypes: ['text/csv'],
    }],};
buttonsavedata.addEventListener('click', async (e) => {
  fileHandleA = await window.chooseFileSystemEntries(savedataoptions);
  fileHandleB = await window.chooseFileSystemEntries(savedataoptions);
  // Do something with the file handle
  //console.log(fileHandleA)
  //console.log(fileHandleB)
});

async function writeFileA(fileHandleA, contents) {
  // Create a writer (request permission if necessary).
  const writer = await fileHandleA.createWriter();
  // Write the full length of the contents
  await writer.write(0, contents);
  // Close the file and write the contents to disk
  await writer.close();
}

async function writeFileB(fileHandleB, contents) {
  // Create a writer (request permission if necessary).
  const writer = await fileHandleB.createWriter();
  // Write the full length of the contents
  await writer.write(0, contents);
  // Close the file and write the contents to disk
  await writer.close();
}

function saveDataToFilesystemA (data) {
  // console.log("Attempting to write data to csv file")
  const Parser = json2csv.Parser;
  const fields = Object.keys(data);
  const opts = { fields , quote: '', unwind: fields}; // unwind is what puts data on many lines instead of one
  const json2csvParser = new Parser(opts);
  const csv = json2csvParser.parse(data);
  // console.log("CSV: ", csv)
  writeFileA(fileHandleA, csv)
  //console.log("Wrote data to ", fileHandle.name)
}

function saveDataToFilesystemB (data) {
  // console.log("Attempting to write data to csv file")
  const Parser = json2csv.Parser;
  const fields = Object.keys(data);
  const opts = { fields , quote: '', unwind: fields}; // unwind is what puts data on many lines instead of one
  const json2csvParser = new Parser(opts);
  const csv = json2csvParser.parse(data);
  // console.log("CSV: ", csv)
  writeFileB(fileHandleB, csv)
  //console.log("Wrote data to ", fileHandle.name)
}