(function() {
  var obj = {};
  var observable = observerFactory();
  observable(obj);

  obj.on("event", callback0); // При каждом событии event вызвать callback
  obj.fire("event"); // I'm called!
  obj.fire("event"); // I'm called!

  obj.one("event2", callback4); // Подписаться на событие единожды
  obj.fire("event2"); // I'm called too!
  obj.fire("event2"); // Ничего не происходит

  obj.unbind("event"); // Отписаться от события
  obj.fire("event"); // Ничего не происходит
  obj.on("event", callback1);
  obj.on("event", callback2);
  obj.fire("event"); // callback1 и callback2 вызваны
  obj.unbind("event", callback1);
  obj.fire("event"); //  callback2 вызван

  obj.on("event2", callback3);
  obj.fire("event2", 1, 2); // 3

  function callback0(){
      console.log("I'm called!");
  }

  function callback1(){
      console.log('callback 1');
  }

  function callback2(){
      console.log('callback 2');
  }

  function callback3(one, two){
      console.log(one + two);
  }

  function callback4(){
      console.log("I'm called too!");
  }

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
          (event, ' undind: ', callbacks.splice(index, 1));
        }
      });
    }

    function fire(event) {
      var args = [].slice.call(arguments, 1);
      var callbacks = this[event] || [];
      callbacks.forEach(function(callback) {
        if (typeof callback === 'function') {
          callback.apply(null, args)
        }
      });
      if (callbacks.unbind) {
        unbind.call(this, event);
      }
    }
  }

})();
