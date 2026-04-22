import { describe, expect, it } from 'vitest'
import { getStyleSheet, transformXml } from './xml'

describe('function getStyleSheet', () => {
  it('should return the href of the stylesheet if it exists and is of type text/xsl', () => {
    const xmlString = `<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<root></root>`
    expect(getStyleSheet(xmlString)).toBe('style.xsl')
  })

  it('should return null if there is no stylesheet declaration', () => {
    const xmlString = `<?xml version="1.0"?>
<root></root>`
    expect(getStyleSheet(xmlString)).toBeNull()
  })

  it('should return null if the stylesheet declaration is not of type text/xsl', () => {
    const xmlString = `<?xml version="1.0"?>
<?xml-stylesheet type="text/css" href="style.css"?>
<root></root>`
    expect(getStyleSheet(xmlString)).toBeNull()
  })
})

describe('function transformXml', () => {
  it('should transform XML using the provided XSLT', async () => {
    const xmlString = `<?xml version="1.0"?>
<root>
  <item>1</item>
  <item>2</item>
  <item>3</item>
</root>`
    const xslString = `<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <body>
        <h2>Items</h2>
        <ul>
          <xsl:for-each select="root/item">
            <li><xsl:value-of select="."/></li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`
    const expectedOutput = `<html>
  <body>
    <h2>Items</h2>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
  </body>
</html>`
    const result = await transformXml(xmlString, xslString)
    expect(result.replace(/\s+/g, '')).toBe(expectedOutput.replace(/\s+/g, ''))
  })
})
