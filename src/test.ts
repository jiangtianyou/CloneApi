// 测试jsdom的使用
import {JSDOM} from 'jsdom';
import {ResourceLoader} from 'jsdom';

const resourceLoader = new ResourceLoader({
  proxy: "http://www.xiaoyaoji.cn/doc/1QnSRmRbAx",
  strictSSL: false,
  userAgent: "Mellblomenator/9000",
});
const dom = new JSDOM(``, { resources: resourceLoader });

console.log(dom)
