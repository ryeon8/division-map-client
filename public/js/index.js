import * as mapApi from './kakaoMapApiFacade.js';
import ajaxHelper from './ajaxHelper.js';

const domParser = new DOMParser();
let map;

function createMap() {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(37.5642135, 127.0016985),
    level: 13
  };
  return new kakao.maps.Map(container, options);
}

async function displayAreaLine() {
  const cityCode = document.getElementById('cityCode').value;
  const subCode = document.getElementById('subCode')?.value || '';

  const data = await ajaxHelper.get('http://localhost:3000/data/city.json');
  const coordGroupList = data.features;

  mapApi.remove.all();
  data.features
    .filter(e => e.properties.gid.startsWith(`${cityCode}${subCode}`))
    .map(e => e.geometry.coordinates).forEach((e, i) => {
      e.forEach((latLngList, i) => {
        mapApi.draw.line(map, latLngList[0]);
      })
    });
}

async function displaySubCodeList() {
  const subCodeListHtml = await ajaxHelper.get(`/sub/list/${this.value}`);
  this.parentNode.querySelector('select:not([name=cityCode])')?.remove();

  const $subCodeListEl = domParser.parseFromString(subCodeListHtml, 'text/html').body.childNodes[1];
  this.parentNode.appendChild($subCodeListEl);

  $subCodeListEl.onchange = displayCodeList;
  // $subCodeListEl.dispatchEvent(new Event('change'));
}

async function displayCodeList() {
  const codeListHtml = await ajaxHelper.get(`/code/list/${this.dataset.cityCode}/${this.value}`);
  this.parentNode.querySelector('[name=legalCode]')?.remove();

  const $codeListEl = domParser.parseFromString(codeListHtml, 'text/html').body.childNodes[1];
  this.parentNode.appendChild($codeListEl);

  $codeListEl.onchange = displayAreaLine;
  // $codeListEl.dispatchEvent(new Event('change'));
}

window.onload = async function () {
  document.getElementById('cityCode').onchange = displaySubCodeList;
  document.getElementById('cityCode').dispatchEvent(new Event('change'));

  document.getElementById('displayLineBtn').onclick = displayAreaLine;

  map = createMap();
}

