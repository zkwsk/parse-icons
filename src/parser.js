// NPM imports
const fs = require("fs");
const camelCase = require("camelcase");
const titleize = require("titleize");

// Toggle how to output results
writeFile = true;
writeStdOutput = true;

const iconList = {};
iconList.solid = {};
iconList.brands = {};

// The file from which to import icons
const importedIcons = require("../data/icons 4.json");

// Look up changed names between Font Awesome 4.x and 5.x
const upgradeTable = require("../data/upgrade.json");

// Font Awesome 4.x utility classes - not icons.
const blackList = [
  "fa-",
  "fa-lg",
  "fa-2x",
  "fa-3x",
  "fa-4x",
  "fa-5x",
  "fa-fw",
  "fa-li",
  "fa-pull-left",
  "fa-border",
  "fa-spin",
  "fa-pulse",
  "fa-rotate-90",
  "fa-rotate-180",
  "fa-rotate-270",
  "fa-flip-horizontal",
  "fa-flip-vertical",
  "fa-stack",
  "fa-stack-1x",
  "fa-stack-2x",
  "fa-inverse"
];
const parsePrefix = prefix => {
  const prefixMap = {
    fab: "brands",
    fas: "solid"
  };

  return prefixMap[prefix] || "solid";
};

const importTemplate = function(iconAttributes) {
  const camelName = camelCase(iconAttributes.cssClass);

  const prefix = parsePrefix(iconAttributes.prefix);

  return `import { ${camelName} as ${camelName}${titleize(
    prefix
  )} } from '@fortawesome/pro-${prefix}-svg-icons';`;
};

const objectMapTemplate = function(icon) {
  const camelName = camelCase(icon.cssClass);

  return `  ${camelCase(icon.newName)}: ${camelName}Solid,`;
};

const getUpgradeData = function(iconName) {
  return upgradeTable.find(element => element.oldName === iconName);
};

const getIconAttributes = iconClass => {
  const attributes = {};

  let iconName = iconClass.replace("fa-", "");
  const upgrade = getUpgradeData(iconName);

  if (!!upgrade) {
    return {
      ...upgrade,
      cssClass: `fa-${upgrade.newName}`,
      url: `https://fontawesome.com/icons/${upgrade.newName}`
    };
  } else {
    return {
      oldName: iconName,
      newName: iconName,
      prefix: "",
      unicode: "",
      cssClass: `fa-${iconName}`,
      url: `https://fontawesome.com/icons/${iconName}`
    };
  }
};

const addToObjectMap = iconAttributes => {
  const camelName = camelCase(iconAttributes.newName);
  const prefix = parsePrefix(iconAttributes.prefix);

  iconList[prefix] = iconList[prefix] || {};

  iconList[prefix][camelName] = `fa${titleize(camelName)}${titleize(prefix)}`;
};

const parseIcons = function() {
  let output = "";
  let importStatements = "";
  let objectMap = "";

  // Remove blacklisted icons
  const icons = importedIcons.filter(icon => blackList.indexOf(icon) === -1);

  // Write import statements.
  icons.map(icon => {
    const attributes = getIconAttributes(icon);
    importStatements += `${importTemplate(attributes)} \n`;

    //console.log(attributes);

    addToObjectMap(attributes);
    //iconList.solid[camelCase(attributes.newName)] =
    //`${camelCase(attributes.newName.replace("fa-", ""))}Solid`;
  });

  // Write object map

  objectMap = `iconList.solid = ${JSON.stringify(iconList.solid, null, 2)}`;
  objectMap += "\n\n";
  objectMap += `iconList.brands = ${JSON.stringify(iconList.brands, null, 2)}`;

  // icons.map(icon => {
  //   const attributes = getIconAttributes(icon);
  //   objectMap += `${objectMapTemplate(attributes)} \n`;

  //   console.log(attributes.newName);

  //   solid[attributes.newName] = `${attributes.newName}Solid`;
  // });

  // Stitch together the import statements and object map
  output = `${importStatements}\n\n${objectMap}`;

  if (writeFile) {
    var today = new Date();

    fs.writeFile(
      `output/output-${today.toISOString().substring(0, 10)}.js`,
      output,
      err => {
        if (err) {
          return console.error(err);
        }
      }
    );
  }
  if (writeStdOutput) {
    console.log(output);
  }
};

parseIcons();
