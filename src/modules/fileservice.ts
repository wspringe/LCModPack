import * as fs from "node:fs";

export function makeDirectoryIfDoesNotExist(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
