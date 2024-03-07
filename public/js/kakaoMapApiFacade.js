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
      strokeWeight: 2,
      strokeColor: 'blue',
      strokeOpacity: 1,
      strokeStyle: 'solid'
    });

    polyline.setMap(map);
    objectsOnMap.push(polyline);
  }
}

const geocoder = new kakao.maps.services.Geocoder();
const ps = new kakao.maps.services.Places();
const search = {
  byAddress: (addr) => {
    if (addr) {
      geocoder.addressSearch(addr, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          return new kakao.maps.LatLng(result[0].y, result[0].x);
        }
      });
    }
  }, byKeyword: async (keyword) => {
    return await new Promise((resolve, reject) => {
      ps.keywordSearch(keyword, function placesSearchCB(data, status) {
        if (status === kakao.maps.services.Status.OK) {
          const latLng = new kakao.maps.LatLng(data[0].y, data[0].x);
          resolve(latLng);
        } else {
          reject(status);
        }
      });
    })
  }
}

export { draw, remove, search }