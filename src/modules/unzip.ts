import * as fs from "node:fs";
import * as unzip from "unzip-stream";
import { makeDirectoryIfDoesNotExist } from "./fileservice.js";

export function unzipAndStoreFile(
  fileLocation: string,
  extension: string,
  storeLocation: string
) {
  fs.readdir(fileLocation, (error, files) => {
    files.forEach((file) => {
      console.log(file);
      fs.createReadStream(fileLocation + file)
        .pipe(unzip.Parse())
        .on("entry", (entry) => {
          const fileName = entry.path;
          console.log(fileName);
          const fileType = entry.type;

          switch (fileType) {
            case "Directory":
              if (fileName.includes("plugins")) {
                const split = fileName.split("/plugins/");
                if (split.length > 1 && split[1] !== "") {
                  makeDirectoryIfDoesNotExist(storeLocation + split[1]);
                }
              } else {
                entry.autodrain();
              }

            case "File":
              if (doesPathContainDllExtension(fileName)) {
                createFileAtPath(
                  entry,
                  storeLocation + fileName.split("/").pop()
                );
              } else if (doesPathNotHaveAnExtension(fileName)) {
                if (fileName.includes("plugins")) {
                  createFileAtPath(
                    entry,
                    storeLocation + fileName.split("/plugins/").pop()
                  );
                } else {
                  createFileAtPath(entry, storeLocation + fileName);
                }
              } else {
                entry.autodrain();
              }
          }
        })
        .on("error", (error) => {
          console.log("An error occurred " + error.message);
        });
    });
  });
}

const doesPathContainDllExtension = (path: string) => {
  if (path.includes(".dll")) {
    return true;
  } else {
    return false;
  }
};

const doesPathNotHaveAnExtension = (path: string) => {
  if (path.includes(".")) {
    return false;
  } else {
    return true;
  }
};

const createFileAtPath = (file: any, path: string) => {
  file.pipe(
    fs.createWriteStream(path).on("error", (error) => {
      console.log(
        "An error occurred writing: " +
          JSON.stringify(file) +
          "to path: " +
          path
      );
    })
  );
};
