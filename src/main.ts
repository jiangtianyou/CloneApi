#!/usr/bin/env node

import ApiItem from './model/ApiItem';
import { parse } from './scripts/parsePage';
import { saveCollection } from './scripts/postman';
import { createConfig, initEnv } from './scripts/setEnv';
import * as program from 'commander';
import * as ck from 'chalk';
import * as ora from 'ora';

const exit = process.exit,
  log = console.log;

// program.version('1.0.0')
//   .arguments('<bean> [key]')
//   .description('clone小幺鸡api到postman')
//   .action(async function(bean, key) {
//     if (bean === 'config' && key && key.length > 5) {
//       createConfig({ key: key });
//       exit();
//     }
//     initEnv();
//     let result: ApiItem[] = await parse(bean);
//     if (result.length === 0) {
//       log(ck.bgRedBright('未提取到有效的api数据，程序将要推出'));
//       exit();
//     }
//     await saveCollection(result);
//   })
//   .parse(process.argv);



const spinner = ora('Loading unicorns').start();

setTimeout(() => {
  spinner.color = 'yellow';
  spinner.text = 'Loading rainbows';
}, 1000);