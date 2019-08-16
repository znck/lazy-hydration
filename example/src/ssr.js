import createServer from 'express'
import { createRenderer } from 'vue-server-renderer'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createApp } from './app'

const renderer = createRenderer({
  template: readFileSync(resolve(__dirname, './index.html'), {
    encoding: 'utf8',
  }).replace(/<div id="?app"?><\/div>/, `<!--vue-ssr-outlet-->`),
})
const server = createServer()

server.use(createServer.static(__dirname))

server.get('*', (req, res) => {
  const { app, router } = createApp()

  router.push(req.url)
  router.onReady(async () => {
    console.log(`> ${req.path}`)
    const components = router.getMatchedComponents()
    if (!components.length) {
      res.sendStatus(404)
      console.error('Not Found')

      return
    }

    try {
      const output = await renderer.renderToString(app, {})

      console.log(output)

      res.send(output)
    } catch (error) {
      console.error(error)
    }
    console.log('\n\n')
  })
})

server.listen(process.env.PORT || 8080, () => {
  console.log('Server started!')
})
