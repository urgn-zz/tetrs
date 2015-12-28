/**
 * @class Resources
 * @static
 * AJAX resource loader
 */

Resources = {
  loadConfig : function(fileName, callback) {
      var me = this,
          req = new XMLHttpRequest(),
          configJSON,
          imgList,
          toLoad = 0, loaded = 0,
          graphics,
          checkLoad = function() {
              if (++loaded >= toLoad) {
                  callback();
              }
          };

      req.onreadystatechange = function() {
          if (req.readyState == 4 && req.status == 200) {
              configJSON = JSON.parse(req.responseText);

              me.Options = configJSON["options"];
              me.Graphics = {};

              imgList = configJSON["images"];
              toLoad = Object.keys(imgList).length;

              for (var name in imgList) {
                  var container = new Image();
                  container.onload = (function(name, container) {
                          return function () {
                              me.Graphics[name] = container;
                              checkLoad();
                          }
                    })(name, container);
                  container.src = imgList[name];
               }
          }
      };


      req.open("GET", fileName, true);
      req.send();
  }

};