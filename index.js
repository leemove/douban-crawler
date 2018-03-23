const config = require('./config.json')
const phantom = require('phantom')
const _ = require('lodash')
const fs = require('fs')
const cheerio = require('cheerio')
// var mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017');
// var db = mongoose.connection;
// db.once('open', function() {
//   console.log('数据库连接')
// });

let pageCount = 0

async function main(){
  const maxPage = 1 // 抓取的页面数
  const pageStarts = _.range(maxPage).map(item => item *50)
  // 放入一个数组 开始并行执行请求
  const proArr = pageStarts.map(item => getPage(item))
  try {
    let res = await Promise.all(proArr)
    res.forEach(element => {
    const $ = cheerio.load(element.content)
    const trs = $('table.olt td.title a')
    trs.each((index, element) => {
      element = cheerio(element)
      const title = element.attr('title')
      const herf = element.attr('href')
      const parent = element.parent().parent()
      const timeStr = cheerio(parent).find('td.time').text()
      const time = new Date('2018-' + timeStr)
      console.log({title, herf, time})
    })
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