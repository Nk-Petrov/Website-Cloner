/* 
* Script simples apenas.
* Autor: @Nk-Petrov
* GitHub: https://github.com/Nk-Petrov
* Número: wa.me/559183721035
* Name: Website-Cloner
*/

import axios from "axios"
import fs from "fs"
import path from "path"
import readline from "readline"
import archiver from "archiver"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const cores = {
  reset: "\x1b[0m",

  branco: "\x1b[37m",
  verde: "\x1b[32m",
  vermelho: "\x1b[31m",
  cyan: "\x1b[36m",
  azulEscuro: "\x1b[34m",

  bgVerde: "\x1b[42m",
  bgVermelho: "\x1b[41m",
  bgAzul: "\x1b[44m",
  bgCyan: "\x1b[46m"
}

const log = {
  info: (msg) => {
    console.log(`${cores.bgAzul}${cores.branco}[ INFO • YUTA ]${cores.reset} ${cores.azulEscuro}- ${msg}${cores.reset}`)
  },

  success: (msg) => {
    console.log(`${cores.bgVerde}${cores.branco}[ SUCESSO ]${cores.reset} ${cores.verde}- ${msg}${cores.reset}`)
  },

  error: (msg) => {
    console.log(`${cores.bgVermelho}${cores.branco}[ ERRO ]${cores.reset} ${cores.vermelho}- ${msg}${cores.reset}`)
  },

  warn: (msg) => {
    console.log(`${cores.bgCyan}${cores.branco}[ AVISO ]${cores.reset} ${cores.cyan}- ${msg}${cores.reset}`)
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function perguntar(p) {
  return new Promise(r => rl.question(p, r))
}

function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function getDomain(url) {
  return new URL(url).hostname.replace("www.", "")
}

function getFileName(fileUrl, fallback) {
  try {
    const urlObj = new URL(fileUrl)
    let nome = path.basename(urlObj.pathname)
    if (!nome || !nome.includes(".")) return fallback
    return nome.split("?")[0]
  } catch {
    return fallback
  }
}

async function baixarArquivo(url, caminho) {
  try {
    const res = await axios.get(url, { responseType: "arraybuffer" })
    fs.writeFileSync(caminho, res.data)
    log.success(`Arquivo baixado com sucesso: ${caminho}`)
  } catch {
    log.error(`Falha ao baixar o arquivo: ${url}`)
  }
}

function criarZip(pasta, destinoZip) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(destinoZip)
    const archive = archiver("zip", { zlib: { level: 9 } })

    output.on("close", () => {
      log.success(`Arquivo ZIP criado com sucesso: ${destinoZip}`)
      resolve()
    })

    archive.on("error", err => reject(err))

    archive.pipe(output)
    archive.directory(pasta, false)
    archive.finalize()
  })
}

async function main() {
  console.clear()
  log.info("Inicializando clonador de website...")

  const url = await perguntar("URL DO SITE: ")

  if (!isValidUrl(url)) {
    log.error("A URL informada é inválida ou mal formatada.")
    process.exit()
  }

  log.info("Conectando ao site e obtendo HTML...")

  const res = await axios.get(url)
  const html = res.data

  const domain = getDomain(url)
  const base = path.join(__dirname, "output", domain)

  const pastaCSS = path.join(base, "css")
  const pastaJS = path.join(base, "js")
  const pastaIMG = path.join(base, "img")

  log.warn("Criando estrutura de diretórios...")

  ;[base, pastaCSS, pastaJS, pastaIMG].forEach(p => {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true })
      log.info(`Diretório criado: ${p}`)
    }
  })

  const cssMatches = [...html.matchAll(/<link[^>]+href=["']([^"']+\.css[^"']*)["']/gi)]
  const jsMatches = [...html.matchAll(/<script[^>]+src=["']([^"']+\.js[^"']*)["']/gi)]
  const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]

  log.info("Analisando HTML e coletando arquivos (CSS, JS, imagens)...")

  for (const m of cssMatches) {
    let fileUrl = m[1]
    if (!fileUrl.startsWith("http")) fileUrl = new URL(fileUrl, url).href

    const nome = getFileName(fileUrl, "style.css")
    await baixarArquivo(fileUrl, path.join(pastaCSS, nome))
  }

  for (const m of jsMatches) {
    let fileUrl = m[1]
    if (!fileUrl.startsWith("http")) fileUrl = new URL(fileUrl, url).href

    const nome = getFileName(fileUrl, "script.js")
    await baixarArquivo(fileUrl, path.join(pastaJS, nome))
  }

  for (const m of imgMatches) {
    let fileUrl = m[1]
    if (!fileUrl.startsWith("http")) fileUrl = new URL(fileUrl, url).href

    const nome = getFileName(fileUrl, "img.jpg")
    await baixarArquivo(fileUrl, path.join(pastaIMG, nome))
  }

  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)

  let previewImage = null

  if (ogMatch) previewImage = ogMatch[1]
  else if (twitterMatch) previewImage = twitterMatch[1]

  if (previewImage) {
    if (!previewImage.startsWith("http")) {
      previewImage = new URL(previewImage, url).href
    }

    const nome = getFileName(previewImage, "preview.jpg")

    await baixarArquivo(previewImage, path.join(pastaIMG, nome))

    log.info(`Imagem de preview detectada e salva como: ${nome}`)
  } else {
    log.warn("Nenhuma imagem de preview (og/twitter) encontrada.")
  }

  fs.writeFileSync(path.join(base, "index.html"), html)
  log.success("Arquivo index.html salvo com sucesso.")

  const zipPath = path.join(__dirname, "output", `${domain}.zip`)
  await criarZip(base, zipPath)

  log.success("Clonagem finalizada com sucesso!")
  log.info(`Arquivos salvos em: output/${domain}/`)
  log.info(`Backup compactado disponível em: output/${domain}.zip`)

  rl.close()
}

main()