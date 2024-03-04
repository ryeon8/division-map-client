const draw = {
  line: (map, latLngList) => {
    const path = latLngList.map(latLngPair => new kakao.maps.LatLng(latLngPair[1], latLngPair[0]));
    const polyline = new kakao.maps.Polyline({
      path: path,
      strokeWeight: 5,
      strokeColor: 'blue',
      strokeOpacity: 0.7,
      strokeStyle: 'solid'
    });

    polyline.setMap(map);
  }
}

const remove = {
  line: () => {
    console.log('remove line')
  }
}

export { draw, remove }