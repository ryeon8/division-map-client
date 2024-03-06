import { Injectable } from '@nestjs/common';
import { lcj } from 'legal-code-jsonizer';
import path from 'path';
import fs from 'fs';

@Injectable()
export class AppService {

  legalCodeList: any[];
  geoJsonDir: string;
  geoJsonNameList: string[];

  constructor() {
    this.legalCodeList = lcj().filter(e => e.isAlive);
    this.geoJsonDir = path.join(process.cwd(), 'public', 'data');

    try {
      this.geoJsonNameList = fs.readdirSync(this.geoJsonDir);
    } catch (e) {
      console.error('Error reading directory: ', e);
      this.geoJsonNameList = [];
    }
  }

  getCityCodeList(): any[] {
    return this.legalCodeList.filter(e => e.subCode === '000');
  }

  getSubCodeList(cityCode: string): any[] {
    return this.legalCodeList.filter(e => e.cityCode === cityCode && e.subCode !== '000' && e.sub2Code === '000' && e.code === '00');
  }

  getSub2CodeList(cityCode: string, subCode: string): any[] {
    return this.legalCodeList
      .filter(e => e.cityCode === cityCode && e.subCode === subCode)
      .filter(e => e.sub2Code !== '000' && e.code === '00');
  }

  getCodeList(cityCode: string, subCode: string, sub2Code: string): any[] {
    return this.legalCodeList
      .filter(e => e.cityCode === cityCode && e.subCode === subCode && e.sub2Code === sub2Code);
  }

  getGeoJsonNameList(fullCodeLike: string) {
    return this.geoJsonNameList.filter(filename => filename.startsWith(fullCodeLike));
  }

}
