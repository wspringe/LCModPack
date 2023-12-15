import * as fs from "node:fs";
import * as unzip from "unzip-stream";

export function unzipAndStoreFile(
  fileLocation: string,
  extension: string,
  storeLocation: string
) {
  const files = fs.readdir(fileLocation, (error, files) => {
    files.forEach((file) => {
      console.log(file);
      fs.createReadStream(fileLocation + file)
        .pipe(unzip.Parse())
        .on("entry", (entry) => {
          const fileName = entry.path;
          console.log(fileName);
          const type = entry.type;
          if (fileName.includes(extension)) {
            entry.pipe(
              fs.createWriteStream(storeLocation + fileName.split("/").pop())
            );
          } else {
            entry.autodrain();
          }
        })
        .on("error", (error) => {
          console.log("An error occurred " + error.message);
        })
        .on("finish", () => {
          console.log("finished");
        });
    });
  });
}
