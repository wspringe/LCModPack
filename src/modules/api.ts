import Thunderstore from "./thunderstore.js";
import fetch from "node-fetch";
import * as fs from "node:fs";

interface ModStoreApi {
  getPackageManifest(): Promise<string>;
}

export class ThunderStoreApi implements ModStoreApi {
  community: string;

  constructor(community: string) {
    this.community = community;
  }

  async getPackageManifest() {
    const manifestUrl = new Thunderstore().getPackageManifestUrl(
      this.community
    );
    console.log(manifestUrl);
    const response = await fetch(manifestUrl);
    const data = (await response.json()) as string;
    return data;
  }

  async downloadMod(downloadUrl: string, storeLocation: string) {
    console.log("Downloading from " + downloadUrl);
    const response = await fetch(downloadUrl);

    let fileStream = fs.createWriteStream(storeLocation);
    response.body?.pipe(fileStream);

    await new Promise<void>((resolve) => {
      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });
    });
  }
}
