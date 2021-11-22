const chai = require('chai')
const sinon = require('sinon')
const { rollup } = require('rollup')
const VuePlugin = require('rollup-plugin-vue');
const svg = require('../')

const expect = chai.expect

function makeBundle(options, stringOptions) {
  options.plugins = [svg(stringOptions), VuePlugin({ include: [/\.vue$/i, /\.svg$/i]})]
  return rollup(options)
}

describe('rollup-plugin-vue-inline-svg', () => {
  it('should import svg from file as a compiled vue component', () => {
    return makeBundle({ input: 'test/fixtures/basic.js' }, { include: '**/*.svg' })
    .then(bundle => bundle.generate({ format: 'es', name: 'tpl' }))
    .then(({ output }) => {
      const spy = sinon.spy()
      // run self testing code
      console.log(output[0].code)
      new Function('expect', 'spy', output[0].code)(expect, spy);
    });
  });
  it('should import svg from a node_module package as a compiled vue component', () => {
    return makeBundle({ input: 'test/fixtures/from-node-modules.js' }, { include: '**/*.svg' })
    .then(bundle =>  bundle.generate({ format: 'es', name: 'tpl' }))
    .then(({ output }) => {
      const spy = sinon.spy()
      new Function('expect', 'spy', output[0].code)(expect, spy);
    });
  });
});
