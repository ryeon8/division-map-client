import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { lcj } from 'legal-code-jsonizer';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) { }

  @Get()
  @Render('index')
  index(): any {
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

  @Get('/sub2/list/:cityCode/:subCode')
  @Render('sub2List')
  sub2List(@Param('cityCode') cityCode: string, @Param('subCode') subCode: string) {
    return {
      cityCode: cityCode,
      subCode: subCode,
      sub2CodeList: this.service.getSub2CodeList(cityCode, subCode)
    }
  }

  @Get('/code/list/:cityCode/:subCode/:sub2Code')
  @Render('codeList')
  codeList(@Param('cityCode') cityCode: string, @Param('subCode') subCode: string, @Param('sub2Code') sub2Code: string) {
    return {
      cityCode: cityCode,
      subCode: subCode,
      sub2Code: sub2Code,
      codeList: this.service.getCodeList(cityCode, subCode, sub2Code)
    }
  }

  @Get('/geo/json/name/list/:fullCodeLike')
  geoJsonNameList(@Param('fullCodeLike') fullCodeLike: string) {
    return this.service.getGeoJsonNameList(fullCodeLike);
  }

}
