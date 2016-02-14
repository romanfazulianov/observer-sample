(function(m) {
  'use strict';
  m.exports = observerFactory();

  function observerFactory() {
    var storage = {};
    return observable;

    function observable(obj) {
      return extend(obj, {
        fire: fire,
        one: one,
        on: on,
        unbind: unbind
      });
    }

    function extend(dst) {
      var key;
      var args = [].slice.call(arguments, 1);
      if (!dst) {
        dst = {};
      }
      args.forEach(function (src) {
        for(key in src) {
          dst[key] = src[key];
        }
      });
      return dst;
    }

    function on(event) {
      var args = [].slice.call(arguments, 1);
      if (!storage[event]) {
        storage[event] = [];
      }
      storage[event] = storage[event].concat(args);
    }

    function one(event) {
      on.apply(storage, arguments);
      storage[event].unbind = true;
    }

    function unbind(event) {
      var args = [].slice.call(arguments, 1);
      var callbacks = storage[event] || [];

      if (!args.length || !callbacks.length) {
        delete storage[event];
        return;
      }
      args.forEach(function(callback) {
        var index = callbacks.indexOf(callback);
        if(index >= 0) {
          callbacks.splice(index, 1);
        }
      });
    }

    function fire(event) {
      var args = [].slice.call(arguments, 1);
      var callbacks = storage[event] || [];
      if (callbacks.unbind) {
        callbacks = [].slice.call(storage[event], 0);
        unbind.call(storage, event);
      }
      callbacks.forEach(function(callback) {
        if (typeof callback === 'function') {
          callback.apply(null, args);
        }
      });
    }
  }
})(module);
