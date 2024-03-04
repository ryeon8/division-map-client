/**
 * kakao map api 호출부 facade.
 * 
 * @author r3n
 * @since 2024. 03. 04.
 */

let objectsOnMap = []

const remove = {
  all: () => {
    objectsOnMap.forEach(e => e.setMap(null));
    objectsOnMap = [];
  },
  line: () => {
    console.log('remove line')
  }
}

const draw = {
  line: (map, latLngList) => {
    const path = latLngList.map(latLngPair => new kakao.maps.LatLng(latLngPair[1], latLngPair[0]));
    const polyline = new kakao.maps.Polyline({
      path: path,
      strokeWeight: 3,
      strokeColor: 'blue',
      strokeOpacity: 1,
      strokeStyle: 'solid'
    });

    polyline.setMap(map);
    objectsOnMap.push(polyline);
  }
}

export { draw, remove }