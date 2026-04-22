import { XmlParser, Xslt } from 'xslt-processor'

/**
 * Extracts the href of the xml-stylesheet processing instruction from the given XML string.
 * @param xmlString XML string
 * @returns The href of the xml-stylesheet processing instruction, or null if not found or not of type "text/xsl"
 */
export function getStyleSheet(xmlString: string): string | null {
  const match = xmlString.match(/<\?xml-stylesheet .*\?>/)
  if (!match) {
    return null
  }
  const { type, href } = match[0].slice(2, -2).split(/\s+/).reduce<{ type?: string, href?: string }>(
    (acc, part) => {
      const [key, value] = part.split('=')
      if (key && value) {
        if (key === 'type') {
          acc.type = value.replace(/"/g, '')
        } else if (key === 'href') {
          acc.href = value.replace(/"/g, '')
        }
      }
      return acc
    },
    {},
  )
  if (type !== 'text/xsl') {
    return null
  }
  return href ?? null
}

/**
 * Transforms the given XML string using the given XSL string and returns the result as a string.
 * @param xmlString Source XML string
 * @param xslString XSL string using stylesheet
 * @returns Transformed HTML string
 */
export async function transformXml(xmlString: string, xslString: string): Promise<string> {
  const xmlParser = new XmlParser()
  const xmlDoc = xmlParser.xmlParse(xmlString)
  const xslDoc = xmlParser.xmlParse(
    // format-number 関数は動かないので、単純に引数を返すように置換しておく
    xslString.replace(/format-number\((.+?), '##'\)/g, (_, p1: string) => p1),
  )
  const xslt = new Xslt({
    escape: false,
    outputMethod: 'html',
  })
  return xslt.xsltProcess(xmlDoc, xslDoc)
}
