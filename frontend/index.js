const http = require('http')
const fs = require('fs')
const path = require('path')

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.svg': 'application/image/svg+xml'
}

http.createServer((request, response) => {
  let filePath = '.' + request.url
  if (filePath === './') {
    filePath = './index.html'
  }

  let extname = String(path.extname(filePath)).toLowerCase()

  let contentType = MIME_TYPES[extname] || 'application/octet-stream'

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code === 'ENOENT') {
          fs.readFile('./404.html', (error, content) => {
              response.writeHead(200, { 'Content-Type': contentType })
              response.end(content, 'utf-8')
          })
      }
      else {
        response.writeHead(500)
        response.end(`[${error.code}] INTERNAL SERVER ERROR`)
        response.end()
      }
    } else {
      response.writeHead(200, { 'Content-Type': contentType })
      response.end(content, 'utf-8')
    }
  })
}).listen(8125)

console.log('Server running at http://127.0.0.1:8125/')
