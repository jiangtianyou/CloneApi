/**
 * 调用postman接口生成api
 */
import ApiItem from '../model/ApiItem';
import * as jp from 'jsonpath';
import Config from '../model/Config';
import * as req from 'request-promise-native';
import * as ck from 'chalk';
import * as ora from 'ora';

const URL = {
  CREATE_COLLECTION: 'https://api.getpostman.com/collections', // POST
  GET_SINGLE_COLLECTION: 'https://api.getpostman.com/collections/{{collection_uid}}', //GET
  GET_ALL_COLLECTION: 'https://api.getpostman.com/collections', //GET
  UPDATE_COLLECTION: 'https://api.getpostman.com/collections/{{collection_uid}}', //PUT
  CREATE_ENV: 'https://api.getpostman.com/environments', //Post
};


function getFolderName(entityArr: ApiItem[]): string {
  if (!entityArr || entityArr.length == 0) {
    return '';
  }
  return entityArr[0].folderName;
}


function buildSingleRequest(api: ApiItem) {

  let args = api.data.requestArgs;
  let transformedArgs = {};
  if (args) {
    // json形式的参数
    args.forEach((ele,index) => {
      transformedArgs[ele.name] = !ele.description ? '' :ele.description ;
    })
    // form形式的参数
    // transformedArgs = api.data.requestArgs.map(item => {
    //   return {
    //     key: item.name,
    //     description: item.description,
    //   };
    // });
  }

  return {
    'name': api.name,
    'request': {
      'url': api.fullPath,
      'description': api.data.description,
      'method': 'POST',
      'header': [
        {
          'key': 'Content-Type',
          'name': 'Content-Type',
          'type': 'text',
          'value': 'application/json',
        }
      ],
      'body': {
        'mode': 'raw',
        'raw': JSON.stringify(transformedArgs,null,2)
        // 'urlencoded': !api.data.requestArgs ? [] : transformedArgs,
      },
    },
  };
}

export async function saveCollection(rawData: ApiItem[]) {
  const convertSpinner = ora('将数据转换成postman需要的数据').start();
  let options = getOptions(URL.GET_ALL_COLLECTION);
  let resText = await req.get(options);
  let names: CollectionItem[] = jp.query(JSON.parse(resText), '$.collections.*');
  let oldId = names.filter(item => item.name == Config.collectionName).map(item => item.id)[0];
  if (oldId) {
    options.url = URL.GET_SINGLE_COLLECTION.replace('{{collection_uid}}', oldId);
    let collectionText = await req.get(options);
    let oldData = JSON.parse(collectionText);
    let toSaveData = _mergeWithOldPostmanData(rawData, oldData);
    convertSpinner.succeed('数据转换完成');
    await saveCollectionData(oldId, toSaveData);
  } else {
    let toSaveData = _buildBrandNewPostmanData(rawData);
    convertSpinner.succeed('数据转换完成');
    await saveCollectionData(null, toSaveData);
  }
}


async function saveCollectionData(id: string, toSaveData: any) {
  const saveSpinner = ora('推送数据到postman....').start();
  let options = getOptions(URL.CREATE_COLLECTION);
  if (!id) {
    //创建
    options['json'] = toSaveData;
    let res = req.post(options);
    await res.then(content => {
      saveSpinner.succeed(`成功推送数据到postman`);
      saveSpinner.succeed('Done! :)');
    })
      .catch(err => {
        saveSpinner.fail('请查询postman key是否已过期！（创建时如果为默认选项key有效为为60天）');
      });
  } else {
    //更新
    options.url = URL.UPDATE_COLLECTION.replace('{{collection_uid}}', id);
    options['json'] = toSaveData;
    let resPro = req.put(options);
    await resPro.then(content => {
      saveSpinner.succeed(`成功推送数据到postman`);
      saveSpinner.succeed('Done! :)');
    })
      .catch(err => {
        saveSpinner.fail('请查询postman key是否已过期！（创建时如果为默认选项key有效为为60天）');
      });
  }
}


function getOptions(url: string): any {
  let key = Config.key;
  return {
    url: url,
    headers: {
      'X-Api-Key': key,
    },
  };
}


interface CollectionItem {
  id: string,
  name: string,
  owner: string
}


function _buildBrandNewPostmanData(entityArr: ApiItem[]) {
  if (entityArr.length < 1) {
    console.error('没有要生成的文档');
    process.exit();
  }
  let folderName = getFolderName(entityArr);
  let requestArr = entityArr.map(item => buildSingleRequest(item));
  return {
    'collection': {
      'info': {
        'name': Config.collectionName,
        'description': '放置小幺鸡生成的文档请勿删除',
        'schema': 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      'item': [
        {
          'name': folderName,
          'item': requestArr,
        },
      ],
    },
  };
}


function _mergeWithOldPostmanData(entityArr: ApiItem[], oldData: any) {
  if (entityArr.length < 1) {
    console.error('没有要合并的文档');
    return null;
  }
  // 与旧的集合合并调用update接口
  let itemArr = jp.query(oldData, '$.collection.item.*');
  let find = false;
  if (entityArr.length == 1) {
    // 尝试从旧的数据中找所属文件夹
    let toFindFolderName = getFolderName(entityArr);
    for (let obj of itemArr) {
      if (obj['name'] === toFindFolderName) {
        find = true;
        obj['item'].push(buildSingleRequest(entityArr[0]));
      }
    }
  }
  if (find === false) {
    // 新建文件夹往item里push
    let item = {
      'name': entityArr[0].folderName,
      'item': entityArr.map(item => buildSingleRequest(item)),
    };
    itemArr.push(item);
  }

  jp.apply(oldData, '$.collection.item', function(item) {
    return itemArr;
  });
  return oldData;
}

