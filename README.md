# XSLT Transformer

This program generates HTML from zip-compressed XML files and XSL files.

By specifying an XML file contained within a zip archive, the program retrieves the XSL stylesheet specified in that file from the archive,
performs an XSLT transformation, and generates an HTML file for display.

## Usage

Build the project and run the following command:

```sh
$ node dist/index.js path/to/archive.zip
```

When you run it, the following prompt will appear, so specify the number of the XML file to be transformed with XSLT.

```text
Found 2 XML file(s) in zip archive path/to/archive.zip:
  1) dir-in-zip/foo.xml
  2) dir-in-zip/bar.xml
Enter the number of the XML file you want to transform:
```
Then, a file will be created in the directory containing the zip archive.
The generated file name is the specified XML file with its extension changed to `.html`.

You can also specify multiple XML file numbers separated by a delimiter.
The delimiter is `,`, `|`, whitespace or line terminator character.

## npm scripts

script | description
--- | ---
`npm run build` | Builds the project. The output destination of the built module is `./dist`.
`npm run clean` | Executes all `npm run clean:*` commands.
`npm run clean:build` | Removes directory `./dist` .
`npm run lint` | Executes all `npm run lint:*` commands.
`npm run lint:es` | Statically analyzes the source program using [ESLint](https://eslint.org/).
`npm run lint:tsc` | Performs type checking on the source program.
`npm start` | Runs `src/index.ts` directly without building the project. Specifying command-line arguments, enter `--` followed by the arguments.
`npm test` | Runs automated tests.
