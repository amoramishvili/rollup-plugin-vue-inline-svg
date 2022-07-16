'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var path = _interopDefault(require('path'));
var pluginutils = require('@rollup/pluginutils');
var SVGO = _interopDefault(require('svgo'));

var optimizeSvg = function (content, config, path) { return new Promise(function (resolve, reject) {
  var svgo = new SVGO(config);
  svgo.optimize(content, { path: path }).then(function (result) {
    if (result.error) { return reject(result.error); }
    return resolve(result.data);
  });
}); };

function index (options) {
  var include = options && options.include;
  var exclude = options && options.exclude;
  var config = options && options.svgoConfig || { plugins: ['removeDoctype', 'removeComments'] };
  var filter = pluginutils.createFilter(include || '**/*.svg', exclude);
  return {
    name: 'vue-inline-svg',
    resolveId: function (source) {
      // Matches absolute path of svgs in node_modules
      // that are skipped by default in rollup
      var regexp = /^(?!\.)\S+\.svg$/gi;
      if (source.match(regexp)) {
        var id = path.resolve('node_modules/', source);
        return { id: id, external: false };
      }
      return null;
    },
    transform: function (source, id) {
      if (!filter(id)) { return null; }
      return optimizeSvg(source, config, id).then(function (result) {
        return ("<template><svg " + (result.substring(5, result.length)) + "</template>");
      });
    },
  };
}

module.exports = index;
