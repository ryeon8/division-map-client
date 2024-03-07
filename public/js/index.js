import * as mapApi from './kakaoMapApiFacade.js';
import ajaxHelper from './ajaxHelper.js';

const domParser = new DOMParser();
let map;

function createMap() {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(36.3891245329566, 127.705321271931),
    level: 12
  };
  return new kakao.maps.Map(container, options);
}

async function displayAreaLine() {
  const cityCode = document.getElementById('cityCode').value;
  const subCode = document.getElementById('subCode')?.value || '';
  const sub2Code = document.getElementById('sub2Code')?.value || '';
  const code = document.getElementById('code')?.value || '';

  mapApi.remove.all();
  const geoJsonNameList = await ajaxHelper.get(`/geo/json/name/list/${cityCode}${subCode}${sub2Code}${code}`, 'json');
  for (let filename of geoJsonNameList) {
    const data = await ajaxHelper.get(`/data/${filename}`);
    mapApi.draw.line(map, data.geometry.coordinates[0][0]);
  }
}

async function displayCodeList() {
  const codeListHtml = await ajaxHelper.get(`/code/list/${this.dataset.cityCode}/${this.dataset.subCode}/${this.value}`);
  this.parentNode.querySelector('[name=code]')?.remove();

  const $codeListEl = domParser.parseFromString(codeListHtml, 'text/html').body.childNodes[1];
  this.parentNode.appendChild($codeListEl);

  $codeListEl.onchange = displayAreaLine;
}

async function displaySub2CodeList() {
  const sub2CodeListHtml = await ajaxHelper.get(`/sub2/list/${this.dataset.cityCode}/${this.value}`);
  Array.from(this.parentNode.querySelectorAll('[name=sub2Code], [name=code]')).forEach(e => e.remove());

  const $sub2CodeListEl = domParser.parseFromString(sub2CodeListHtml, 'text/html').body.childNodes[1];
  this.parentNode.appendChild($sub2CodeListEl);

  $sub2CodeListEl.onchange = displayCodeList;
}

async function displaySubCodeList() {
  const subCodeListHtml = await ajaxHelper.get(`/sub/list/${this.value}`);
  Array.from(this.parentNode.querySelectorAll('select:not([name=cityCode])')).forEach(e => e.remove());

  const $subCodeListEl = domParser.parseFromString(subCodeListHtml, 'text/html').body.childNodes[1];
  this.parentNode.appendChild($subCodeListEl);

  $subCodeListEl.onchange = displaySub2CodeList;
  // $subCodeListEl.dispatchEvent(new Event('change'));
}

window.onload = async function () {
  document.getElementById('cityCode').onchange = displaySubCodeList;
  document.getElementById('cityCode').dispatchEvent(new Event('change'));

  document.getElementById('displayLineBtn').onclick = displayAreaLine;

  map = createMap();
}

