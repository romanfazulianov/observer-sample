module.exports = observerFactory;

function observerFactory() {
  return observable;

  function observable(obj) {
  var storage = {};
    return extend(obj, {
      fire: fire.bind(storage),
      one: one.bind(storage),
      on: on.bind(storage),
      unbind: unbind.bind(storage)
    });
  }

  function extend(dst) {
    var key;
    var args = [].slice.call(arguments, 1);
    dst || (dst = {});
    args.forEach(function (src) {
      for(key in src) {
        dst[key] = src[key];
      }
    });
    return dst;
  }

  function on(event) {
    var args = [].slice.call(arguments, 1);
    this[event] || (this[event] = []);
    this[event] = this[event].concat(args);
  }

  function one(event) {
    on.apply(this, arguments);
    this[event].unbind = true;
  }

  function unbind(event) {
    var args = [].slice.call(arguments, 1);
    var callbacks = this[event] || [];

    if (!args.length || !callbacks.length) {
      delete this[event];
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
    var callbacks = this[event] || [];
    if (callbacks.unbind) {
      callbacks = [].slice.call(this[event], 0)
      unbind.call(this, event);
    }
    callbacks.forEach(function(callback) {
      if (typeof callback === 'function') {
        callback.apply(null, args)
      }
    });
  }
}

