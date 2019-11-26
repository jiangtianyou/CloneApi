#!/usr/bin/env node

import ApiItem from './model/ApiItem';
import { parse } from './scripts/parsePage';
import { saveCollection } from './scripts/postman';
import { createConfig, printTodayJoke, initEnv } from './scripts/setEnv';
import * as program from 'commander';
import * as ck from 'chalk';

const exit = process.exit,
  log = console.log;

program.version('1.1.4')
  .arguments('<bean> [key]')
  .description('clone小幺鸡api到postman')
  .action(async function(bean, key) {
    if (bean === 'config' && key && key.length > 5) {
      createConfig({ key: key });
      exit();
    }
    initEnv();
    let result: ApiItem[] = await parse(bean);
    if (result.length === 0) {
      log(ck.bgRedBright('未提取到有效的api数据，看完笑话洗洗睡吧！'));
      await printTodayJoke();
      exit();
    }
    await saveCollection(result);

    await printTodayJoke();

  })
  .parse(process.argv);


