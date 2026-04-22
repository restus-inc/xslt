import { writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { ZipFile } from './zip'
import { getStyleSheet, transformXml } from './xml'
import { readStdin, writeErrorLine, writeLine, writeWithoutNewline } from './console'

function transformXmlInZip(zip: ZipFile, xmlFileName: string): Promise<string> {
  const xmlString = zip.getFileText(xmlFileName)
  const xslFileName = getStyleSheet(xmlString)
  if (!xslFileName) {
    throw new Error(`No stylesheet declaration found in XML file ${xmlFileName} in zip archive`)
  }
  const fullXslFileName = join(dirname(xmlFileName), xslFileName)
  const xslString = zip.getFileText(fullXslFileName)
  return transformXml(xmlString, xslString)
}

function getXmlFileNamesInZip(zip: ZipFile): string[] {
  return zip.getFileNames().filter(fileName => fileName.endsWith('.xml'))
}

export async function main(): Promise<void> {
  const argv = process.argv

  // 1. Error handling for missing zip file path argument
  if (argv.length < 3) {
    writeErrorLine('Usage: npm start -- <zip-file-path>')
    process.exit(1)
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const zipFilePath = argv[2]!
  const zipDir = dirname(zipFilePath)
  const zip = new ZipFile(zipFilePath)
  const xmlFileNames = getXmlFileNamesInZip(zip)
  if (xmlFileNames.length === 0) {
    writeLine(`No XML files found in zip archive ${zipFilePath}`)
    return
  }

  // 2. List XML files found in the zip archive
  writeLine(`Found ${xmlFileNames.length} XML file(s) in zip archive ${zipFilePath}:`)
  xmlFileNames.forEach((fileName, index) => {
    writeLine(`  ${index + 1}) ${fileName}`)
  })

  // 3. Prompt user to select an XML file by entering its number
  writeWithoutNewline('Enter the number of the XML file you want to transform: ')
  const line = await readStdin()
  const inputs = line.split(/[,|\s]+/).filter(s => s.length > 0)
  if (inputs.length === 0) {
    writeErrorLine('No input provided. Please enter a number corresponding to an XML file.')
    process.exit(1)
  }
  const numbers = inputs.map((s) => {
    const n = Number(s)
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      writeErrorLine(`Invalid input "${s}". Please enter valid integers.`)
      process.exit(1)
    }
    if (n < 1 || n > xmlFileNames.length) {
      writeErrorLine(`Invalid input "${s}". Please enter numbers between 1 and ${xmlFileNames.length}.`)
      process.exit(1)
    }
    return n
  })
  for (const n of [...new Set(numbers)]) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const selectedXmlFile = xmlFileNames[n - 1]!
    const transformedXml = await transformXmlInZip(zip, selectedXmlFile)
    const outputFilePath = `${zipDir}/${basename(selectedXmlFile, '.xml')}.html`
    writeFileSync(outputFilePath, transformedXml, 'utf-8')
    writeLine(`Transformed XML has been saved to ${outputFilePath}`)
  }
}

if (import.meta.main) {
  main()
}
