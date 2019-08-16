import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

function version(name) {
  return `${name} v${require(`${name}/package.json`).version}`
}

const banner = `
/* eslint-disable */
/**
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author.name} <${pkg.author.email}> (${
  pkg.author.url
})
 * @license ${pkg.license}
 * @description Built with ${version('rollup-plugin-vue')} and ${version(
  'vue-template-compiler'
)}
 */`.trim()

export default [
  {
    input: 'Hydrate.js',
    plugins: [
      vue({
        template: { optimizeSSR: true },
        normalizer: '~vue-runtime-helpers/dist/normalize-component.mjs',
        styleInjectorSSR: '~vue-runtime-helpers/dist/inject-style/server.mjs',
      }),
      babel(),
    ],
    output: [
      {
        banner,
        format: 'cjs',
        file: pkg.main,
      },
    ],
    external: ['@znck/prop-types'],
  },
  {
    input: 'Hydrate.js',
    plugins: [vue({
      normalizer: '~vue-runtime-helpers/dist/normalize-component.mjs',
      styleInjector: '~vue-runtime-helpers/dist/inject-style/browser.mjs',
    }), babel({
      
    })],
    output: [
      {
        banner,
        format: 'es',
        file: pkg.module,
      },
    ],
    external: ['@znck/prop-types'],
  },
]
