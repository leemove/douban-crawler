const config = require('./config.json')
const r = require('request-promise-native')
const phantom = require('phantom');
const _ = require('lodash')
const fs = require('fs')

let pageCount = 0

async function main(){
  const maxPage = 5 // 抓取的页面数
  const pageStarts = _.range(5).map(item => item *50)
  // 放入一个数组 开始并行执行请求
  const proArr = pageStarts.map(item => getPage(item))
  try {
    let res = await Promise.all(proArr)
    res.forEach(element => {
      // fs.writeFile(__dirname + 'dist/' + 'note' + element.start, element.content)
    });
  } catch (error) {
    console.log(error)
  }
}


async function getPage(start) {
  const instance = await phantom.create();

  const page = await instance.createPage();
  await page.on('onResourceRequested', function(requestData) {
    return false
  });

  const status = await page.open(config.url + start);
  const content = await page.property('content');
  await instance.exit();
  pageCount++
  console.log(`已经抓取${pageCount}页,本页面数据范围是${start}-${start + 50}`)
  return {content, start};
}
main()