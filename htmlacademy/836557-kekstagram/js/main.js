'use strict';

/*
 * Основной код программы
 */

(function () {
  var picturesData = new window.PicturesData();

  picturesData.getProperties().then(function () {

    var picturesRenderer = new window.PicturesRenderer(picturesData.properties);
    picturesRenderer.bindEvents();

    picturesRenderer.renderDefault();

    window.BigPictureRenderer.bindEvents();

    var pictureUploader = new window.PictureUploader();

    pictureUploader.bindEvents();

  }).catch(function () {
    // TODO show error
  });

})();
