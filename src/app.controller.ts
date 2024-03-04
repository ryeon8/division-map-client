import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { lcj } from 'legal-code-jsonizer';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) { }

  @Get()
  @Render('index')
  index(): any {
    console.log(this.service.getCityCodeList())
    return {
      apiKey: process.env.KAKAO_MAP_API_KEY,
      cityCodeList: this.service.getCityCodeList()
    };
  }

  @Get('/sub/list/:cityCode')
  @Render('subList')
  subList(@Param('cityCode') cityCode: string) {
    return {
      cityCode: cityCode,
      subCodeList: this.service.getSubCodeList(cityCode)
    }
  }

  @Get('/code/list/:cityCode/:subCode')
  @Render('codeList')
  codeList(@Param('cityCode') cityCode: string, @Param('subCode') subCode: string) {
    return {
      cityCode: cityCode,
      subCode: subCode,
      codeList: this.service.getCodeList(cityCode, subCode)
    }
  }

}
