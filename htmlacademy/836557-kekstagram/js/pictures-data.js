'use strict';

(function () {

  /* Класс описывает массив исходных данных для вставки в DOM */
  var PicturesData = function () {
    this.properties = [];

    this.isLoaded = false;
  };

  PicturesData.prototype.getProperties = function () {
    var $this = this;

    return new window.Promise(function (resolve, reject) {

      if ($this.isLoaded) {
        resolve($this.properties);
        return;
      }

      window.backend.getData()
        .then(function (data) {
          $this.properties = data;
          $this.isLoaded = true;
          return $this.properties;
        })
        .then(resolve)
        .catch(reject);
    });

  };

  window.PicturesData = PicturesData;

})();
