# parse-icons

Tool to help you migrate from Fontawesome 4.x to 5.x using tree-shaking to cherry-pick already icons you already use.

## How to use?

1. Place a json file in the data folder and reference it in parser.js (imported icons). The file should be an array with strings with original (4.x.) font awesome classes. For example:

```
(/data/icons.json)
[
    "fa-user",
    "fa-group"
    ...
]
```

2. Run `npm run` to generate a file in the output folder containing import statements and an object that will map all of your icons so it's possible to iterate over them and import them into the Font Awesome 5 library.

## What does it do?

- Removes font-awesome "utility classes" which are not actually icons (i.e. `fa-2x`, `fa-stack`, etc. - see the `blackList` object in parser.js for details)
- Maps old icon names to new ones (font awesome changed some icon names from 4.x to 5.x)
- Imports `solid` icon variations by default. If brand icons are used they will be imported correctly.

## Preparation

To get a list of all icons in your project in order to create the initial `icons.json` file this process is recommended:

1. Make a copy of your project and delete `node_modules`, `vendor`-folders or any other folder that may contain built files.
2. `cd` to the project root and run the following command:

```
grep -roEhs "fa-[a-z0-9\-]*" --include="*.js" --include="*.html" --include="*.js" ./
```

    (This will recursively look for hyphen-delimited words starting with `fa-` and output them to the terminal.)

3. Copy paste the output and turn the list into a js array and save the file as a json file.
