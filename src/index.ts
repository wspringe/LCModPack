import getModList from "./modules/modList.js";
import { ThunderStoreApi } from "./modules/api.js";
import { unzipAndStoreFile } from "./modules/unzip.js";
import { makeDirectoryIfDoesNotExist } from "./modules/fileservice.js";

interface Version {
  download_url: string;
}

interface Package {
  name: string;
  owner: string;
  versions: Version[];
}

const getLatestMods = async () => {
  const modList = getModList();

  const thunderstoreApi = new ThunderStoreApi("lethal-company");
  const manifestJson = await thunderstoreApi.getPackageManifest();
  const packageManifest: Package[] = JSON.parse(JSON.stringify(manifestJson));
  let promises: any[] = [];
  makeDirectoryIfDoesNotExist("./downloads/");
  makeDirectoryIfDoesNotExist("./plugins/");

  packageManifest.forEach((pkg) => {
    let downloadUrl: string;
    modList.forEach((mod) => {
      if (mod.name === pkg.name && mod.owner === pkg.owner) {
        downloadUrl = pkg.versions[0].download_url;

        promises.push(
          thunderstoreApi.downloadMod(
            downloadUrl,
            "./downloads/" + pkg.name + ".zip"
          )
        );
      }
    });
  });

  Promise.all(promises).then(() => {
    try {
      unzipAndStoreFile("downloads/", ".dll", "./plugins/");
    } catch (e) {
      if (typeof e === "string") {
        console.log("An error has occurred unzipping: " + e);
      } else if (e instanceof Error) {
        console.log("An error has occurred unzipping: " + e.message);
      }
    }
  });
};

getLatestMods();
