import AdmZip from 'adm-zip'

/**
 * A simple wrapper around the adm-zip library to handle zip files.
 */
export class ZipFile {
  #zip: AdmZip

  /**
   * @param zipFilePath Path to zip file
   */
  constructor(zipFilePath: string) {
    this.#zip = new AdmZip(zipFilePath)
  }

  /**
   * Returns the names of all files in the zip archive.
   * @returns Array of file names
   */
  getFileNames(): string[] {
    return this.#zip.getEntries().map(entry => entry.entryName)
  }

  /**
   * Returns the raw data of the specified file in the zip archive.
   * @param fileName Name of the file in the zip archive
   * @returns Buffer containing the file data
   */
  getFileData(fileName: string): Buffer {
    const entry = this.#zip.getEntry(fileName)
    if (!entry) {
      throw new Error(`File ${fileName} not found in zip archive`)
    }
    return entry.getData()
  }

  /**
   * Returns the text content of the specified file in the zip archive.
   * @param fileName Name of the file in the zip archive
   * @returns String containing the file content
   */
  getFileText(fileName: string): string {
    const data = this.getFileData(fileName)
    return data.toString('utf-8')
  }
}
