const $ = new Env('助力码提交');
const urlSchema = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/3KSjXqQabiTuD1cJ28QskrpWoBKT/index.html%22%20%7D`;
const jxOpenUrl = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://wqsd.jd.com/pingou/dream_factory/index.html%22%20%7D`;

let cookiesArr = [], cookie = '', notify;
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const JX_API_HOST = 'https://m.jingxi.com';

let codeArr = [`0`,`0`,`0`,`0`,`0`];
let urlArr = [`jdzz`,`ddfactory`,`jxfactory`,`bean`,`farm`,`pet`];
const nameArr = [`京东赚赚`,`东东工厂`,`京喜工厂`,`种豆得豆`,`东东农场`,`东东萌宠`]

!(async () => {
    await requireConfig();
    if (!cookiesArr[0]) {
      $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
      return;
    }
    for (let i = 0; i < cookiesArr.length; i++) {
      if (cookiesArr[i]) {
        cookie = cookiesArr[i];
        $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = '';
        await TotalBean();
        console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
        if (!$.isLogin) {
          $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
  
          if ($.isNode()) {
            await notify.sendNotify(`cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
          } else {
            $.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。$.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
          }
          continue
        }
        message = '';
        subTitle = '';
        option = {};
        await jdzz();//京东赚赚
        await $.wait(500);
        await jdfactory();//东东工厂
        await $.wait(500);
        await jxfactory();//京喜工厂
        await $.wait(500);
        await jdPlantBean();//种豆得豆
        await $.wait(500);
        await jdFruit();//东东农场
        await $.wait(500);
        await jdPet();//萌宠

        for(let i = 0; i < codeArr.length; i++) {
          if (codeArr[i] === `0`){
            console.log(`${nameArr[i]}未获取助力码`);
            continue
          }
          console.log(`[ ${nameArr[i]} ] 互助码 ${codeArr[i]}\n`)
        }
        for(let i = 0; i < codeArr.length; i++) {
          await $.wait(1000);
          await subCode(i,urlArr[i],codeArr[i]);
        }
      }
    }
  })()
      .catch((e) => {
        $.log('', `❌ }, 失败! 原因: ${e}!`, '')
      })
      .finally(() => {
        $.done();
      })
      async function subCode(i,url,code) {
          return new Promise(async resolve => {
            $.get({url: `http://api.turinglabs.net/api/v1/jd/${url}/create/${code}/`}, (err, resp, data) => {
              try {
                if (err) {
                  console.log(`${JSON.stringify(err)}`)
                  console.log(`助力码服务器 API请求失败，请检查网路重试`)
                } else {
                  if (data) {                  
                    data = JSON.parse(data);
                    if(data.code = 200) {
                      console.log(`${nameArr[i]}助力码提交成功 ${JSON.stringify(data)}`);
                      message += `${nameArr[i]}助力码提交成功`
                    }else{
                      console.log(`${nameArr[i]}助力发提交失败  ${data}`);
                    }
                  }
                }
              } catch (e) {
                $.logErr(e, resp)
              } finally {
                resolve(data);
              }
            })
            await $.wait(5000);
            resolve()
          })
        
        
      }
/*function doGet() {
  if(jdfactorycode){
        $.get({url: `http://api.turinglabs.net/api/v1/jd/ddfactory/create/${jdfactorycode}`}, async (err, resp, data) => {
        if(err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`东东工厂助力码提交API请求失败`);
        } else {
          console.log(`${JSON.stringify(data)}`)
          data = JSON.parse(data);
          if(data.code = 200) {
            console.log(`东东工厂助力码提交成功`);
          }else{
            console.log(`东东工厂助力发提交失败  ${data}`);
          }
          
        }
        })
  }else{
    console.log(`东东工厂助力码为空,提交失败`);
  }
}*/

function showMsg() {
  subTitle = `提交成功`;
  $.msg($.name, subTitle, message);
}
function suburl(functionId,code) {
  return {
    url: `http://api.turinglabs.net/api/v1/jd/${functionId}/create/${code}`
  }
}


     async function jdfactory() {
        return new Promise(resolve => {
          $.post(taskPostUrl("jdfactory_getTaskDetail", {}, "jdfactory_getTaskDetail"), async (err, resp, data) => {
            try {
              if (err) {
                console.log(`${JSON.stringify(err)}`)
                console.log(`东东工厂 API请求失败，请检查网路重试`)
              } else {
                if (safeGet(data)) {
                  data = JSON.parse(data);
                  if (data.data.bizCode === 0) {
                    $.taskVos = data.data.result.taskVos;//任务列表
                    $.taskVos.map(item => {
                      if (item.taskType === 14) {
                        console.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的东东工厂好友互助码】${item.assistTaskDetailVo.taskToken}\n`)
                        codeArr[1] = `${item.assistTaskDetailVo.taskToken}`;
                      }else {
                        console.log(`东东工厂获取互助码失败`);
                      }
                    })
                  }
                }
              }
            } catch (e) {
              $.logErr(e, resp)
            } finally {
              resolve();
            }
          })
        })
      }
      function taskPostUrl(function_id, body = {}, function_id2) {
        let url = `${JD_API_HOST}`;
        if (function_id2) {
          url += `?functionId=${function_id2}`;
        }
        return {
          url,
          body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.1.0`,
          headers: {
            "Cookie": cookie,
            "origin": "https://h5.m.jd.com",
            "referer": "https://h5.m.jd.com/",
            'Content-Type': 'application/x-www-form-urlencoded',
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
          }
        }
      }
      async function jdFruit() {
        await initForFarm();
        if ($.farmInfo.farmUserPro) {
          // option['media-url'] = $.farmInfo.farmUserPro.goodsImage;
         
          console.log(`\n【您的东东农场互助码shareCode】 ${$.farmInfo.farmUserPro.shareCode}\n`);

          codeArr[4] = `${$.farmInfo.farmUserPro.shareCode}`;
        } else {
          console.log(`初始化农场数据异常, 请登录京东 app查看农场0元水果功能是否正常,农场初始化数据: ${JSON.stringify($.farmInfo)}`);
          message = `【京东账号${$.index}】 ${$.nickName || $.UserName}\n【数据异常】请手动登录京东app查看此账号东东农场是否正常`;
        }
      }

      async function jdPlantBean() {
        await plantBeanIndex();
        // console.log(plantBeanIndexResult.data.taskList);
        if ($.plantBeanIndexResult.code === '0') {
          const shareUrl = $.plantBeanIndexResult.data.jwordShareInfo.shareUrl
          $.myPlantUuid = getParam(shareUrl, 'plantUuid')
          console.log(`\n【您的种豆得豆互助码】 ${$.myPlantUuid}\n`);
          codeArr[3] =`${$.myPlantUuid}`;

        } else {
          console.log(`种豆得豆-初始失败:  ${JSON.stringify($.plantBeanIndexResult)}`);
        }
      }
      function getParam(url, name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
        const r = url.match(reg)
        if (r != null) return unescape(r[2]);
        return null;
      }
      async function plantBeanIndex() {
        $.plantBeanIndexResult = await beanrequest('plantBeanIndex');//plantBeanIndexBody
      }
      function beanrequest(function_id, body = {}){
        return new Promise(async resolve => {
          await $.wait(2000);
          $.post(beantaskUrl(function_id, body), (err, resp, data) => {
            try {
              if (err) {
                console.log('\n种豆得豆: API查询请求失败 ‼️‼️')
                console.log(`function_id:${function_id}`)
                $.logErr(err);
              } else {
                data = JSON.parse(data);
              }
            } catch (e) {
              $.logErr(e, resp);
            } finally {
              resolve(data);
            }
          })
        })
      }
      function beantaskUrl(function_id, body) {
        body["version"] = "9.0.0.1";
        body["monitor_source"] = "plant_app_plant_index";
        body["monitor_refer"] = "";
        return {
          url: JD_API_HOST,
          body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&area=5_274_49707_49973&build=167283&clientVersion=9.1.0`,
          headers: {
            'Cookie': cookie,
            'Host': 'api.m.jd.com',
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
            'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': "application/x-www-form-urlencoded"
          }
        }
      }
     async function jxfactory() {
        return new Promise(async resolve => {
          $.get(dreamfactorytaskurl('userinfo/GetUserInfo', `pin=&sharePin=&shareType=&materialTuanPin=&materialTuanId=`), async (err, resp, data) => {
            try {
              if (err) {
                console.log(`${JSON.stringify(err)}`)
                console.log(`京喜工厂 API请求失败，请检查网路重试`)
              } else {
                if (safeGet(data)) {
                  data = JSON.parse(data);
                  if (data['ret'] === 0) {
                    data = data['data'];
                    if (data.factoryList && data.productionList) {
                      console.log(`\n【京喜工厂互助码】${data.user.encryptPin}`);
                    
                      codeArr[2] = `${data.user.encryptPin}`;
                    } 
                  } else {
                    
                    console.log(`GetUserInfo异常：${JSON.stringify(data)}`)
                  }
                }
              }
            } catch (e) {
              $.logErr(e, resp)
            } finally {
              resolve();
            }
          })
        })
      }
      function dreamfactorytaskurl(functionId, body = '') {
        return {
          url: `${JX_API_HOST}/dreamfactory/${functionId}?zone=dream_factory&${body}&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now()}`,
          headers: {
            'Cookie': cookie,
            'Host': 'm.jingxi.com',
            'Accept': '*/*',
            'Connection': 'keep-alive',
            'User-Agent': 'jdpingou;iPhone;3.14.4;14.0;ae75259f6ca8378672006fc41079cd8c90c53be8;network/wifi;model/iPhone10,2;appBuild/100351;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/62;pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
            'Accept-Language': 'zh-cn',
            'Referer': 'https://wqsd.jd.com/pingou/dream_factory/index.html',
            'Accept-Encoding': 'gzip, deflate, br',
          }
        }
      }
     async function jdzz() {
        return new Promise(resolve => {
          $.get(zztaskUrl("interactIndex"), async (err, resp, data) => {
            try {
              if (err) {
                console.log(`${JSON.stringify(err)}`)
                console.log(`京东赚赚 API请求失败，请检查网路重试`)
              } else {
                if (safeGet(data)) {
                  data = JSON.parse(data);
                  if (data.data.shareTaskRes) {
                    console.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的京东赚赚好友互助码】${data.data.shareTaskRes.itemId}\n`);
                    codeArr[0] =`${data.data.shareTaskRes.itemId}`;
                  } else {
                    console.log(`已满5人助力,暂时看不到您的京东赚赚好友助力码`)
                  }
                }
              }
            } catch (e) {
              $.logErr(e, resp)
            } finally {
              resolve(data);
            }
          })
        })
      }
      
function zztaskUrl(functionId, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.1.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Referer': 'http://wq.jd.com/wxapp/pages/hd-interaction/index/index',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}
async function jdPet() {
  //查询jd宠物信息
  const initPetTownRes = await petrequest('initPetTown');
  if (initPetTownRes.code === '0' && initPetTownRes.resultCode === '0' && initPetTownRes.message === 'success') {
    $.petInfo = initPetTownRes.result;
    if ($.petInfo.userStatus === 0) {
      $.msg($.name, '', `【提示】京东账号${$.index}${$.nickName}\n萌宠活动未开启\n请手动去京东APP开启活动\n入口：我的->游戏与互动->查看更多开启`, { "open-url": "openapp.jdmoble://" });
      return
    }
    console.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的萌宠好友互助码】${$.petInfo.shareCode}\n`);

    codeArr[5] =`${$.petInfo.shareCode}`;

  } else {
    console.log(`初始化萌宠失败:  ${initPetTownRes.message}`);
  }
  async function petrequest(function_id, body = {}) {
    await $.wait(3000); //歇口气儿, 不然会报操作频繁
    return new Promise((resolve, reject) => {
      $.post(pettaskUrl(function_id, body), (err, resp, data) => {
        try {
          if (err) {
            console.log('\n东东萌宠: API查询请求失败 ‼️‼️');
            console.log(JSON.stringify(err));
            $.logErr(err);
          } else {
            data = JSON.parse(data);
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve(data)
        }
      })
    })
  }

  function pettaskUrl(function_id, body = {}) {
    body["version"] = 2;
    body["channel"] = 'app';
    return {
      url: `${JD_API_HOST}?functionId=${function_id}`,
      body: `body=${escape(JSON.stringify(body))}&appid=wh5&loginWQBiz=pet-town&clientVersion=9.0.4`,
      headers: {
        'Cookie': cookie,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
        'Host': 'api.m.jd.com',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
  }
}
      async function initForFarm() {
        return new Promise(resolve => {
          const option =  {
            url: `${JD_API_HOST}?functionId=initForFarm`,
            body: `body=${escape(JSON.stringify({"version":4}))}&appid=wh5&clientVersion=9.1.0`,
            headers: {
              "accept": "*/*",
              "accept-encoding": "gzip, deflate, br",
              "accept-language": "zh-CN,zh;q=0.9",
              "cache-control": "no-cache",
              "cookie": cookie,
              "origin": "https://home.m.jd.com",
              "pragma": "no-cache",
              "referer": "https://home.m.jd.com/myJd/newhome.action",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-site",
              "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
              "Content-Type": "application/x-www-form-urlencoded"
            }
          };
          $.post(option, (err, resp, data) => {
            try {
              if (err) {
                console.log('\n东东农场: API查询请求失败 ‼️‼️');
                console.log(JSON.stringify(err));
                $.logErr(err);
              } else {
                if (safeGet(data)) {
                  $.farmInfo = JSON.parse(data)
                }
              }
            } catch (e) {
              $.logErr(e, resp)
            } finally {
              resolve();
            }
          })
        })
      }
      function TotalBean() {
        return new Promise(async resolve => {
          const options = {
            "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
            "headers": {
              "Accept": "application/json,text/plain, */*",
              "Content-Type": "application/x-www-form-urlencoded",
              "Accept-Encoding": "gzip, deflate, br",
              "Accept-Language": "zh-cn",
              "Connection": "keep-alive",
              "Cookie": cookie,
              "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
              "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
            }
          }
          $.post(options, (err, resp, data) => {
            try {
              if (err) {
                console.log(`${JSON.stringify(err)}`)
                console.log(`API请求失败，请检查网路重试`)
              } else {
                if (data) {
                  data = JSON.parse(data);
                  if (data['retcode'] === 13) {
                    $.isLogin = false; //cookie过期
                    return
                  }
                  $.nickName = data['base'].nickname;
                } else {
                  console.log(`京东服务器返回空数据`)
                }
              }
            } catch (e) {
              $.logErr(e, resp)
            } finally {
              resolve();
            }
          })
        })
      }
      function requireConfig() {
        return new Promise(resolve => {
          console.log('开始获取配置文件\n')
          notify = $.isNode() ? require('./sendNotify') : '';
          //Node.js用户请在jdCookie.js处填写京东ck;
          cookiesArr.push(...[$.getdata('CookieJD'), $.getdata('CookieJD2')]);
          
          console.log(`共${cookiesArr.length}个京东账号\n`)
          
          resolve()
        })
      }
      function safeGet(data) {
        try {
          if (typeof JSON.parse(data) == "object") {
            return true;
          }
        } catch (e) {
          console.log(e);
          console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
          return false;
        }
      }
      function subGet(data) {
        try {
          if (typeof JSON.parse(data) == "object") {
            return true;
          }
        } catch (e) {
          console.log(e);
          console.log(`助力码服务器访问数据为空，请检查自身设备网络情况`);
          return false;
        }
      }

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,o)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),h=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t))}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",o){const r=t=>{if(!t||!this.isLoon()&&this.isSurge())return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,r(o)):this.isQuanX()&&$notify(e,s,i,r(o)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
