import { Injectable } from '@nestjs/common';
import { lcj } from 'legal-code-jsonizer';

@Injectable()
export class AppService {

  legalCodeList: any[];

  constructor() {
    this.legalCodeList = lcj().filter(e => e.isAlive);
  }

  getCityCodeList(): any[] {
    console.log(this.legalCodeList)
    return this.legalCodeList.filter(e => e.subCode === '000');
  }

  getSubCodeList(cityCode: string): any[] {
    return this.legalCodeList.filter(e => e.cityCode === cityCode && e.subCode !== '000' && e.code === '00000');
  }

  getCodeList(cityCode: string, subCode: string): any[] {
    return this.legalCodeList
      .filter(e => e.cityCode === cityCode && e.subCode === subCode)
      .filter(e => e.code !== '00000');
  }
}
