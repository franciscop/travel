(function (name, definition){
  // Note: ignoring because this is the Universal Module Definition
  /* istanbul ignore next */
  if (typeof define === 'function'){ // AMD
    define(function(){ return definition; });
  } else if (typeof module !== 'undefined' && module.exports) { // Node.js
    module.exports = definition;
  } else { // Browser
    var theModule = definition, global = this, old = global[name];
    theModule.noConflict = function () {
      global[name] = old;
      return theModule;
    };
    global[name] = theModule;
  }
})('travel', function (...relations) {

  // Accept comma-separated values
  relations = relations.join(',').trim().split(/\s*,\s*/g);

  return function (raw = {}) {
    // Clone the element so it works without references
    raw = JSON.parse(JSON.stringify(raw));

    // From the library dotty, functions search and get. No need to test again
    /* istanbul ignore next */
    var search=function e(n,r,i){if("string"==typeof r&&(r=r.split(".")),r instanceof Array&&0!==r.length){var t=(r=r.slice()).shift();if("object"==typeof n&&null!==n)return"*"===t&&(t=".*"),"string"==typeof t&&(t=new RegExp(t)),0===r.length?Object.keys(n).filter(t.test.bind(t)).map(function(t){var e=n[t];return i&&i(e,n,t),e}):Array.prototype.concat.apply([],Object.keys(n).filter(t.test.bind(t)).map(function(t){return e(n[t],r,i)}))}};
    /* istanbul ignore next */
    var get=function t(e,n){if("string"==typeof n&&(n=n.split(".")),n instanceof Array&&0!==n.length){var i=(n=n.slice()).shift();if("object"==typeof e&&null!==e)return 0===n.length?e[i]:n.length?t(e[i],n):void 0}};

    // Perform each of the relationships
    relations.filter(a => a).forEach(rel => {
      const [from, to] = rel.split(/\s*=>\s*/);
      search(raw, from, function (val, data, i) {
        // console.log(to + '.' + val, raw, get(raw, to + '.' + val));
        data[i] = get(raw, to + '.' + val);
      })
    });

    // The logic for the concatenation
    var getter = function (orig, key) {
      // Native method
      if ((orig).constructor.name === 'Array' && [][key]) {
        return orig[key];
      }
      if (!orig[key]) return 'Not found';
      if (typeof orig[key] === 'object') {
        return new Proxy(orig[key], { get: getter });
      }
      return orig[key];
    };

    return new Proxy(raw, { get: getter });
  }
});
