'use strict';

(function () {

  var Urls = {
    GET_DATA: 'https://js.dump.academy/kekstagram/data',
  };

  window.backend = {
    getData: function () {
      return fetch(Urls.GET_DATA, {
        method: 'get',
      }).then(function (response) {
        return response.json();
      });
    },

    postData: function (URL, formData) {
      return fetch(URL, {
        method: 'post',
        body: formData,
      }).then(function (response) {
        return response.json();
      });
    },
  };

})();
