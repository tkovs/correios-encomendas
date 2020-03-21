import cheerio from 'cheerio'
import axios from 'axios'

const url = (code: string) => `https://www.linkcorreios.com.br/?id=${code}`

export const track = async (code: string) => {
  const response = await axios.get(url(code))
  const { data } = response
  const html = cheerio.load(data)
  const final: any[] = []

  html('.linha_status').each((_i, statusElement) => {
    const object: any = {}

    html(statusElement)
      .find('li')
      .each((_j, infoElement) => {
        const text = html(infoElement).text()
        const key: any = /^\w+/.exec(text)
        const match = /:\s*(.*)$/.exec(text)

        object[key[0].toLowerCase()] = match && match[1]
      })

    final.push(object)
  })

  return final
}
