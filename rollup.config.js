import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

function version(name) {
  return `${name} v${require(`${name}/package.json`).version}`
}

const banner = `
/**
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author.name} <${pkg.author.email}> (${pkg.author.url})
 * @license ${pkg.license}
 * @description Built with ${version('rollup-plugin-vue')} and ${version('vue-template-compiler')}
 */`.trim()

export default [
  {
    input: 'Hydrate.vue',
    plugins: [vue({ template: { optimizeSSR: true } }), babel()],
    output: [
      {
        banner,
        format: 'cjs',
        file: pkg.main,
      },
    ],
    external: ['@znck/prop-types']
  },
  {
    input: 'Hydrate.vue',
    plugins: [vue(), babel()],
    output: [
      {
        banner,
        format: 'es',
        file: pkg.module,
      },
    ],
    external: ['@znck/prop-types']
  },
]
