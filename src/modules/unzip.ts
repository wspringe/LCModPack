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
      fs.createReadStream(fileLocation + file)
        .pipe(unzip.Parse())
        .on("entry", (entry) => {
          const fileName = entry.path;
          console.log(fileName);

          createPrecedingDirectories(fileName, storeLocation);

          if (doesPathContainDllExtension(fileName)) {
            createFileAtPath(entry, storeLocation + fileName.split("/").pop());
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
        })
        .on("error", (error) => {
          console.log("An error occurred " + error.message);
        });
    });
  });
}

const createPrecedingDirectories = (
  fileName: string,
  storeLocation: string
) => {
  const pluginsSplit = fileName.split("/plugins/");
  if (
    pluginsSplit.length >= 1 &&
    pluginsSplit[1] != undefined &&
    pluginsSplit[1] != ""
  ) {
    const dirSplit = pluginsSplit[1].split("/");
    if (dirSplit.length > 0) {
      for (let i = 0; i < dirSplit.length - 1; i++) {
        makeDirectoryIfDoesNotExist(storeLocation + dirSplit[i]);
      }
    }
  }
};

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
          " to path: " +
          path +
          error
      );
    })
  );
};
