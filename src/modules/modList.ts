import modList from "../../modList.json" assert { type: "json" };

interface Metadata {}

class ModMetadata implements Metadata {
  owner: string;
  name: string;

  constructor(owner: string, name: string) {
    this.owner = owner;
    this.name = name;
  }
}

const getModList = () => {
  let mods: ModMetadata[] = [];
  modList.forEach((mod) => {
    mods.push(new ModMetadata(mod.author, mod.name));
  });

  return mods;
};

export default getModList;
