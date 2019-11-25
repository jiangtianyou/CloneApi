import * as req from "request-promise-native";
import * as ora from 'ora';
import * as chalk from 'chalk';

export async function getUrlContent(path: string): Promise<string> {
  const downloadSpinner = ora(`正在下载页面${path}的数据`).start()
  let requestPromise = req.get(path);
  return requestPromise.then((res) => {
    downloadSpinner.succeed(`下载页面${path}成功`);
    return res;
  }).catch(err => {
    downloadSpinner.fail('下载失败');
  });
}
