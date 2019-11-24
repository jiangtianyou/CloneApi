import * as req from "request-promise-native";

export async function getUrlContent(path: string): Promise<string> {
  let requestPromise = req.get(path);
  return requestPromise.then((res) => {
    return res;
  }).catch(err => {
    console.log('请求地址:%s失败',path)
  });
}
