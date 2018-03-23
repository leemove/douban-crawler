const config = require('./config.json')
const r = require('request-promise-native')
const phantom = require('phantom');
const _ = require('lodash')
const fs = require('fs')

async function main(){
  const maxPage = 5
  const pageStarts = _.range(5).map(item => item *50)
  const proArr = pageStarts.map(item => getPage(item))
  try {
    let res = await Promise.all(proArr)
    res.forEach(element => {
      fs.writeFile('note' + element.start, element.content)
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
  return {content, start};
}
main()