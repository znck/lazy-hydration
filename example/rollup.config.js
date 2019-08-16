import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import node from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'

export default {
  input: 'src/ssr.js',
  inlineDynamicImports: true,
  plugins: [
    vue({
      template: { optimizeSSR: true, compilerOptions: { whitespace: 'whitespace' } },
      normalizer: '~vue-runtime-helpers/dist/normalize-component.mjs',
      styleInjectorSSR: '~vue-runtime-helpers/dist/inject-style/server.mjs',
    }),
    replace({
      'process.env.NODE_ENV': '"production"'
    }),
    babel({ plugins: ['@babel/plugin-syntax-dynamic-import', '@znck/prop-types/remove'] }),
    node(),
  ],
  output: [
    {
      format: 'cjs',
      file: 'dist/ssr.js',
    },
  ],
  external: ['express', 'vue-server-renderer', 'vue', 'vue-router', 'fs', 'path'],
}
