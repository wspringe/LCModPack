# LC Mod Pack

This repo is simple in that is focuses on downloading the mods found in [the modlist](./modList.json).

## How

The compiled scripts will download all listed mods in [the modlist](./modList.json), unzip them, search for any .dll files, and then store them in a plugins folder. It will then package the batch script and plugin files into a tarball. Finall, the build will then publish the tarball under a latest release.

## Usage

Simply run `npm run retrieve` in order to get your mods from the thunderstore.
