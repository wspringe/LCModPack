interface PackageRepository {
  baseUrl: string;
  apiUrl: string;

  getUrl: () => string;
}

export default class Thunderstore implements PackageRepository {
  baseUrl = "https://thunderstore.io/";
  apiUrl = "/api/v1/package/";

  getUrl(): string {
    return this.baseUrl;
  }

  getPackageManifestUrl(community: string): string {
    return this.baseUrl + "c/" + community + this.apiUrl;
  }
}
