'use strict';

(function () {

// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
  ymaps.ready(init);

  function init() {
    // Создание карты.
    let myMap = new ymaps.Map("map", {
      // Координаты центра карты.
      // Порядок по умолчанию: «широта, долгота».
      // Чтобы не определять координаты центра карты вручную,
      // воспользуйтесь инструментом Определение координат.
      center: [55.73, 37.53],
      // Уровень масштабирования. Допустимые значения:
      // от 0 (весь мир) до 19.
      zoom: 9,
    });

    let data = [{
      id: '1',
      name: 'название 1',
      status: '1',
      district: 'район А',
      coords: [55.71, 37.51],
    }, {
      id: '2',
      name: 'название 2',
      status: '1',
      district: 'район А',
      coords: [55.75, 37.54],
    }, {
      id: '3',
      name: 'название 3',
      status: '0',
      district: 'район А',
      coords: [55.71, 37.51],
    }, {
      id: '4',
      name: 'название 4',
      status: '0',
      district: 'район Г',
      coords: [55.72, 37.52],
    }, {
      id: '5',
      name: 'название 5',
      status: '0',
      district: 'район Г',
      coords: [55.71, 37.53],
    }, {
      id: '6',
      name: 'название 6',
      status: '0',
      district: 'район Г',
      coords: [55.74, 37.57],
    }];

    // Создаем метки, которые будут входить в состав кластера.

    function setIconColor(status) {
      if (status === '0') {
        return 'islands#redStretchyIcon';
      }
      return 'islands#greenStretchyIcon';
    }

    let placemarks = data.map(function (el) {

      return new ymaps.GeoObject(
        {
          geometry: {
            type: "Point",
            coordinates: el.coords,
          },
          properties: {
            iconContent: 'id: ' + el.id,
            hintContent: el.name,
            balloonContentHeader: el.name,
            balloonContentBody: 'Статус: ' + el.status,
          },
        },
        {
          preset: setIconColor(el.status),
        }
      );
    });

    let cluster = new ymaps.Clusterer({
      clusterIconLayout: 'default#pieChart',
      gridSize: '64',
    });





    cluster.add(placemarks);
    myMap.geoObjects.add(cluster);


    ymaps.borders.load('RU', {
      lang: 'ru',
      quality: 1
    }).then(function (geojson) {

      var regions = ymaps.geoQuery(geojson);
      console.log(regions);

      regions.search('properties.iso3166 = "RU-KRS"').setOptions('fillColor', '#ff001a');
      regions.addToMap(myMap);
    });


  }

})();

