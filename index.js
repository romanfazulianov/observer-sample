(function(observable) {
  var obj = {};

  observable(obj);

  obj.on("event", callback0);
  obj.fire("event");
  obj.fire("event");

  obj.one("event2", callback4);
  obj.fire("event2");
  obj.fire("event2");

  obj.unbind("event");
  obj.fire("event");
  obj.on("event", callback1);
  obj.on("event", callback2);
  obj.fire("event");
  obj.unbind("event", callback1);
  obj.fire("event");

  obj.on("event2", callback3);
  obj.fire("event2", 1, 2);

  obj.one("one", function(){
    console.log("first");
    obj.one("one", function(){
      console.log("second");
    });
  });

  obj.fire("one");
  obj.fire("one");

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
})(require('./observable.js')());
