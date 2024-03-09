/**
 * index.js. 사이트에서 제공하는 대부분의 front-service를 담당.
 * 
 * @author r3n
 * @since 2024. 03. 08.
 */
import * as mapApi from './kakaoMapApiFacade.js';
import ajaxHelper from './ajaxHelper.js';

const domParser = new DOMParser();
let map;

/** 
 * 현재 선택된 option의 text 반환. 
 * 
 * @param {HTMLElement} $el (선택) select 엘리먼트
 * @return 현재 선택된 option의 text. 전체라는 문자열이 포함된 경우 유효하지 않은 값으로 보고 공백 문자열 반환.
 */
function getOptionText($el) {
  if ($el) {
    const text = $el.options[$el.selectedIndex].text;
    return text.includes('전체') ? '' : text.trim();
  }

  return '';
}

/**
 * 선택된 시군구읍면동명 조합 반환.
 * 
 * @returns 시 + 군/구 + 읍/면 명을 공백 문자(' ')로 연결해 반환. 만약 시 항목만 선택되어 있다면 시 항목명만 반환.
 */
function areaname() {
  const cityname = getOptionText(document.getElementById('cityCode'));
  const subname = getOptionText(document.getElementById('subCode'));
  const sub2name = getOptionText(document.getElementById('sub2Code'));

  return [cityname, subname, sub2name].join(' ');
}

/**
 * 선택된 시/군,구/읍,면 수준에 따른 맵 확대 레벨 조회.
 * 
 * @param {string} cityCode 시 코드
 * @param {string} subCode 군/구 코드
 * @param {string} sub2Code 읍/면 코드
 * @returns 맵 확대 레벨.
 */
function mapLevel(cityCode, subCode, sub2Code) {
  if (sub2Code) {
    return document.getElementById('sub2Code').dataset.mapLevel;
  } else if (subCode) {
    return document.getElementById('subCode').dataset.mapLevel;
  } else {
    return document.getElementById('cityCode').dataset.mapLevel;
  }
}

/** 선택된 법정동 경계선 표시 처리. */
async function displayAreaLine() {
  const cityCode = document.getElementById('cityCode').value;
  const subCode = document.getElementById('subCode')?.value || '';
  const sub2Code = document.getElementById('sub2Code')?.value || '';

  // 지도 확대 레벨 및 중앙 좌표 변경.
  map.setLevel(mapLevel(cityCode, subCode, sub2Code));
  const center = await mapApi.search.byKeyword(areaname());
  map.setCenter(center);

  // 경계선 표시.
  mapApi.remove.all();
  const geoJsonNameList = await ajaxHelper.get(`/geo/json/name/list/${cityCode}${subCode}${sub2Code}`, 'json');
  for (let filename of geoJsonNameList) {
    const data = await ajaxHelper.get(`/data/${filename}`);
    mapApi.draw.line(map, data.geometry.coordinates[0][0]);
  }
}

/**
 * 리 코드 select 항목 표시 처리.
 * 
 * @deprecated 리 단위 코드 목록은 노출하지 않도록 변경. 대체 함수 없음.
 */
async function displayCodeList() {
  const codeListHtml = await ajaxHelper.get(`/code/list/${this.dataset.cityCode}/${this.dataset.subCode}/${this.value}`);
  this.parentNode.querySelector('[name=code]')?.remove();

  const $codeListEl = domParser.parseFromString(codeListHtml, 'text/html').body.childNodes[1];
  this.parentNode.appendChild($codeListEl);

  $codeListEl.onchange = displayAreaLine;
}

/** 읍/면 select 요소 생성 및 표시 처리. */
async function displaySub2CodeList() {
  const sub2CodeListHtml = await ajaxHelper.get(`/sub2/list/${this.dataset.cityCode}/${this.value}`);
  Array.from(this.parentNode.querySelectorAll('[name=sub2Code], [name=code]')).forEach(e => e.remove());

  const $sub2CodeListEl = domParser.parseFromString(sub2CodeListHtml, 'text/html').body.childNodes[1];
  this.parentNode.appendChild($sub2CodeListEl);

  // $sub2CodeListEl.onchange = displayCodeList;
}

/** 군/구 select 요소 생성 및 표시 처리. */
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

  map = mapApi.createKakaoMap();
}

