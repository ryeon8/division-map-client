/**
 * kakao map api 호출부 facade.
 * 
 * @author r3n
 * @since 2024. 03. 04.
 */

let objectsOnMap = [];
const geocoder = new kakao.maps.services.Geocoder();
const ps = new kakao.maps.services.Places();

function createKakaoMap() {
  // map 생성
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(36.3891245329566, 127.705321271931),
    level: 12
  };
  const map = new kakao.maps.Map(container, options);

  // map zoom control 추가.
  map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);

  // 클릭 시 해당 좌표 주소 인포 박스 생성 이벤트 추가.
  const marker = new kakao.maps.Marker();
  const infowindow = new kakao.maps.InfoWindow({ zindex: 1 });

  kakao.maps.event.addListener(map, 'click', async function (mouseEvent) {
    const result = await search.byCoords(mouseEvent.latLng);
    if (result) {
      const $addr = document.getElementById('addrClicked');
      $addr.textContent = result[0].address_name;
      $addr.classList.add('active');
    }
  });

  return map;
}

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
  }, byCoords: (coords) => {
    return new Promise((resolve, reject) => {
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          // 행정동의 region_type 값은 'H'
          resolve(result.filter(e => e.region_type === 'H'));
        } else {
          reject(status)
        }
      });
    });
  }
}

export { createKakaoMap, draw, remove, search }