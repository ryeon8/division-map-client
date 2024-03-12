# 대한민국 법정동 경계 지도
## SUMMARY
- 대한민국 법정동 경계를 kakaomap api를 통해 지도에 출력하는 프로그램입니다.
- 사용 전 kakao map api key가 필요합니다.
- 발급받은 api key를 envs 폴더 생성 후 dev.env에 저장해 주세요.
- api key를 전달하는 부분은 app.controller.ts에 있습니다. 필요한 경우 process.env.KAKAO_MAP_API_KEY를 검색해 수정해 주세요.

## USAGE
```
npm i
npm start
```

기본 3000 포트에서 서비스하도록 되어 있습니다. 변경하려는 경우는 main.ts를 수정해 주세요.

## env
- node v20.11.1
- npm 10.4.0
- nestJS 10.0.0