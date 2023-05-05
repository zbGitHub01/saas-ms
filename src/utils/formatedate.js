let date = new Date();
let yearn = date.getYear(); //获取当前年份(2位)
let y = date.getFullYear(); //获取完整的年份(4位)
let m = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
let d = date.getDate(); //获取当前日(1-31)
date.getDay(); //获取当前星期X(0-6,0代表星期天)
date.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
let h = date.getHours(); //获取当前小时数(0-23)
let minute = date.getMinutes(); //获取当前分钟数(0-59)
let second = date.getSeconds(); //获取当前秒数(0-59)
date.getMilliseconds(); //获取当前毫秒数(0-999)
date.toLocaleDateString(); //获取当前日期
date.toLocaleTimeString(); //获取当前时间
date.toLocaleString(); //获取日期与时间
export function formatedate() {
  let mytime =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return mytime;
}
export function formate() {
  let mytime =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  return mytime;
}
export function time(date) {
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  return y + "-" + m;
}
export function formatehours() {
  if (0 < m < 11) {
    if (d < 10) {
      let news =
        y + "年0" + m + "月0" + d + "日" + h + ":" + minute + ":" + second;
      return news;
    } else {
      let newst =
        y + "年0" + m + "月" + d + "日" + h + ":" + minute + ":" + second;
      return newst;
    }
  } else {
    if (d < 10) {
      let newsq =
        y + "年" + m + "月0" + d + "日" + h + ":" + minute + ":" + second;
      return newsq;
    } else {
      let neww =
        y + "年" + m + "月" + d + "日" + h + ":" + minute + ":" + second;
      return neww;
    }
  }
}
export function yearstimes(date) {
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  h = h < 10 ? "0" + h : h;
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  let mytime = y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
  return mytime;
}
// 时间戳转时间格式
export function timestampToDate(timestamp) {
  const currDate = new Date(timestamp)
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = date.getDate() + ' '
  const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':'
  const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':'
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}

//时间日期格式转换

export function fordate(date) {
  let arr = date.split('-')
  arr.splice(1, 0, '年');
  arr.splice(3, 0, '月');
  let value = arr.join('')
  return value;
}

/**
 * 获取下一个月-第一种
 * @date 格式为yyyy-mm-dd的日期
 *
 */
export function getNextMonth(date) {
  var arr = date.split('-');
  var year = arr[0]; //获取当前日期的年份
  var month = arr[1]; //获取当前日期的月份
  var day = arr[2]; //获取当前日期的日
  var month2 = parseInt(month) + 1;
  if (month2 == 13) {
    year = parseInt(year) + 1;
    month2 = 1;
  }
  var day2 = day;
  var days2 = new Date(year, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }
  var t2 = year + '-' + month2;
  return t2;
}

// 获取当前时间前几个月
// beformonth 前几个月
export function getBeforMonth(beformonth) {
  let date = new Date();
  let year = date.getFullYear()
  let MonthData = []
  let month = ''
  let m = date.getMonth() + 1 - beformonth;
  for (let i = 0; i < beformonth; i++) {

    if (m < 0) {

      month = 12 - (Math.abs(m) % 12) + i
      // console.log('m>>>',m,month)
      // month > 12当前年份 <12 前一年
      if (month > 12) {
        // 月份小于补0
        month = month - 12 < 10 ? ('0' + (month - 12)) : month - 12
        // console.log('month>>>',month)
        month = year + '-' + month
      }else{
        // 月份小于补0
        month = (year - 1) + '-' + (month < 10 ? ('0' + month) : month )
      }
      MonthData.push(month)
    } else {

      month = year + '-' + ( (m + i < 10 ? '0' + (m + i) : (m + i)))
      // console.log('>>>>',month,( m + i))
      if (month == 0) {

        month = year + '-' + 12
      }
      MonthData.push(month)
    }
  }
  return MonthData
}

/*获取下个月的最后一天*/
export function nextMonthLastDay() {
  var time = new Date();
  var year = time.getFullYear();
  var month = time.getMonth() + 2;
  if (month > 12) {
    month = month - 12;
    year = year + 1;
  }
  var day = nextMonthDay(year, month);
  if(month < 10) {
    month = '0' + month
  }
  return year + '-' + month + '-' + day;
}
function nextMonthDay(year, month) {//判断每月多少天
  var day31 = [1, 3, 5, 7, 8, 10, 12];
  var day30 = [4, 6, 9, 11];
  if (day31.indexOf(month) > -1) {
    return 31;
  } else if (day30.indexOf(month) > -1) {
    return 30;
  } else {
    if (isLeapYear(year)) {
      return 29;
    } else {
      return 28;
    }
  }
}
function isLeapYear(year) {//判断是否为闰年
  return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
}

//获取一个月的开始和结束日期
export function getMonthTime(time) {
  let currentDay = new Date(time);
  let currentFullYear = currentDay.getFullYear();
  let currentMonth = currentDay.getMonth();
  return {
    startDay: new Date(currentDay.setDate(1)),
    endDay: new Date(new Date(currentFullYear, currentMonth + 1, 0))
  }
}

export function formatDate(datetime) {
  let date = new Date(datetime); //datetime时间戳为13位毫秒级别,如为10位需乘1000
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let sdate = ("0" + date.getDate()).slice(-2);
  let thatDate = date.getFullYear() + "-" + month + "-" + sdate;
  // 返回
  return thatDate;
}


//地区截取
export function foreara(data) {
  data.map(item => {
    if (item.children.length === 0) {
      item.children = undefined;
    } else {
      item.children.map(value => {
        if (value.children.length === 0) {
          value.children = undefined;
        } else {
          value.children.map(items => {
            if (items.children.length === 0) {
              items.children = undefined;
            } else {}
          });
        }
      });
    }
  });
  return data;
}
//来源截取
export function foresoure(data) {
  data.map(item => {
    if (item.childList.length === 0) {
      item.childList = undefined;
    } else {
      item.childList.map(value => {
        if (value.childList.length === 0) {
          value.childList = undefined;
        } else {
          value.childList.map(items => {
            if (items.childList.length === 0) {
              items.childList = undefined;
            } else {}
          });
        }
      });
    }
  });
  return data;
}
//数据刷新

export function infor(x, y) {
  let resultList = [];
  for (let i = 0; i < x.length; i++) {
    let obj = x[i];
    let num = obj.name;
    for (let j = 0; j < y.length; j++) {
      let aj = y[j];
      let n = aj.name;
      if (n === num) {
        resultList.push(obj);
      }
    }
  }
  return resultList;
}

//获取选择数据

export function getcheckList(x, y) {
  let resultList = [];
  x.map(item => {
    for (let i = 0; i <= y.length; i++) {
      if (item.id === y[i]) {
        resultList.push(item);
      }
    }
  });
  return resultList;
}

//获取默认显示数据
export function defaultcheckList(x) {
  let resultList = x.map(item => {
    return item["id"];
  });
  return resultList;
}

//数组不同
export function uninfor(x, y) {
  let intersection = x.filter(v => y.includes(v));
  let difference = x.concat(y).filter(v => !x.includes(v) || !y.includes(v));
  return difference;
}
//年月日
export function beformonth() {
  let arr = [];
  let today = new Date().getTime();
  let lastDay = getTimeByDay(30); //获取30前后的日期
  let newDay = formatTime(today);
  let lastTime = formatTime(lastDay);
  arr.push(lastTime);
  arr.push(newDay);
  return arr;
}

//前一周
export function beforweek() {
  let arr = [];
  let today = new Date().getTime();
  let lastDay = getTimeByDay(7); //获取7天前的日期
  let newDay = formatTime(today) + " 12" + ":00" + ":00";
  let lastTime = formatTime(lastDay) + " 12" + ":00" + ":00";
  arr.push(lastTime);
  arr.push(newDay);
  return arr;
}

export function bmonthbeformonth() {
  let arr = [];
  let today = new Date().getTime();
  let lastDay = getTimeByDay(31); //获取30前后的日期
  let toolastDay = getTimeByDay(62); //获取60前后的日期
  let newDay = formatTime(today);
  let lastTime = formatTime(lastDay);
  let toolastTime = formatTime(toolastDay);
  arr.push(toolastTime);
  arr.push(lastTime);
  arr.push(newDay);
  return arr;
}
export function beformonthdate() {
  let lastDay = getTimeByDay(31); //获取30前后的日期
  let lastTime = formatTime(lastDay);
  return lastTime
}
/*
num 获取当天多少天后的日期
*/
function getTimeByDay(num) {
  let today = new Date().getTime();
  return today - 60 * 60 * 1000 * 24 * num;
}

function formatTime(time) {
  //new Date(time).toISOString()    => 2019-02-23T08:40:35.825Z
  return new Date(time).toISOString().split("T")[0];
}

//图表数据格式化
export function frechart(data, type) {
  let arr = [];
  let arrs = [];
  for (const key in data) {
    if (type === 2) {
      let obj = {
        name: key,
        stack: "比例",
        barMaxWidth: 40,
        type: key === "回款率" ? "bar" : "line",
        yAxisIndex: key === "回款率" ? 1 : 0,
        data: data[key]
      };
      arr.push(key);
      arrs.push(obj);
    } else if (type === 3) {
      let obj = {};
      if (key === "repayAmounts") {
        obj = {
          name: "回收金额",
          barMaxWidth: 40,
          type: "bar",
          data: data[key]
        };
        arr.push("回收金额");
      } else {
        obj = {
          name: "回收率",
          type: "line",
          yAxisIndex: 1,
          data: data[key]
        };
        arr.push("回收率");
      }
      arrs.push(obj);
    } else if (type === 4) {
      let obj = {
        name: key,
        type: key === "回收率" ? "line" : "bar",
        barMaxWidth: 40,
        yAxisIndex: key === "回收率" ? 1 : 0,
        data: data[key]
      };
      arr.push(key);
      arrs.push(obj);
    } else if (type === 5) {
      let obj = {
        name: key,
        barMaxWidth: 40,
        yAxisIndex: key === "回收率" ? 1 : 0,
        type: key === "回收率" ? "line" : "bar",
        data: data[key]
      };
      arr.push(key);
      arrs.push(obj);
    } else if (type === 0) {
      let obj = {};
      if (key === "回款率") {
        obj = {
          name: key,
          type: "line",
          yAxisIndex: 1,
          data: data[key]
        };
      } else {
        obj = {
          name: key,
          stack: "回款金额",
          barMaxWidth: 40,
          type: "bar",
          data: data[key]
        };
      }
      arr.push(key);
      arrs.push(obj);
    } else {
      let obj = {
        name: key,
        barMaxWidth: 40,
        type: type === 6 ? "line" : "bar",
        symbol: type === 6 ? "circle" : "none",
        symbolSize: 6,
        // smooth: type === 6 ?  true : false,
        data: data[key]
      };
      arr.push(key);
      arrs.push(obj);
    }
  }
  return {
    arr,
    arrs
  };
}

//金额处理
export function formatMoney(money) {
  money = Math.floor((money / 10000) * 100) / 100; //保留小数点两位
  //n = parseInt((n /10000) * 100 / 100); //取整
  money = money + "万";
  return money;
}

//金额处理不加万
export function formatNoMoney(money) {
  money = Math.floor((money / 10000) * 100) / 100; //保留小数点两位
  //n = parseInt((n /10000) * 100 / 100); //取整
  money = money;
  return money;
}
//金额处理
export function formatMoney2(money) {
  money = Math.floor((money / 10000000) * 100) / 100; //保留小数点两位
  //n = parseInt((n /10000) * 100 / 100); //取整
  money = money + "亿";
  return money;
}

//js精度处理
export function tofixedMoney(money) {}

//将多个数组合并成对象
export function transObj(type, data) {
  let list = [];
  if (type == "type1") {
    let money = data.get("money") ?? []; //数据类型中对应的数据
    let num = data.get("num"); //数据类型中对应的数据
    let product = data.get("product"); //数据类型中对应的数据
    for (let i = 0; i < money.length; i++) {
      list.push({
        id: i + 1,
        money: money[i],
        num: num[i],
        product: product[i]
      });
    }
  } else if (type == "type2") {
    let halfRepayRates = data.get("halfRepayRates"); //数据类型中对应的数据
    let last1RepayRates = data.get("last1RepayRates"); //数据类型中对应的数据
    let last2RepayRates = data.get("last2RepayRates"); //数据类型中对应的数据
    let last3RepayRates = data.get("last3RepayRates"); //数据类型中对应的数据
    let oneRepayRates = data.get("oneRepayRates"); //数据类型中对应的数据
    let sumRepayRates = data.get("sumRepayRates"); //数据类型中对应的数据
    let products = data.get("products"); //数据类型中对应的数据
    for (let i = 0; i < halfRepayRates.length; i++) {
      list.push({
        id: i + 1,
        halfRepayRates: halfRepayRates[i],
        last1RepayRates: last1RepayRates[i],
        last2RepayRates: last2RepayRates[i],
        last3RepayRates: last3RepayRates[i],
        oneRepayRates: oneRepayRates[i],
        sumRepayRates: sumRepayRates[i],
        products: products[i],
      });
    }
  }
  return list;
}

//对比数据补0
export function addvalue(x, y) {
  y.map(item => {
    if (item.name.substr(item.name.length - 1, 1) === "省") {
      item.name = item.name.substr(0, item.name.length - 1);
    } else if (item.name.substr(item.name.length - 1, 1) === "市") {
      item.name = item.name.substr(0, item.name.length - 1);
    } else if (item.name === "广西壮族自治区") {
      item.name = "广西";
    } else if (item.name === "内蒙古自治区") {
      item.name = "内蒙古";
    } else if (item.name === "新疆维吾尔自治区") {
      item.name = "新疆";
    } else if (item.name === "宁夏回族自治区") {
      item.name = "宁夏";
    } else if (item.name === "西藏自治区") {
      item.name = "西藏";
    }
  });
  x.map(item => {
    y.map(items => {
      //
      if (item.name === items.name) {
        item.value = items.value;
      }
    });
  });
  return x;
}

//获取数组中的最大值
export function getValue(arr) {
  return Math.max.apply(Math, arr);
}

//绩效统计获取天数集合
export function getPerformancedayList(object) {
  const reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
  let arr = []
  for (const key in object) {
    if (reg.test(key)) {
      arr.push(key)
    }
  }
  let arrs = []
  arr.map((item, index) => {
    arrs.push({ name: item, key: item, id: index })
  })
  return arrs
}

//机构回馈进度获取天数集合
export function getdayList(object) {
  let arr = [];
  for (const key in object) {
    if (key !== "productName" && key !== "orgCount") {
      arr.push(key);
    }
  }
  let obj = {
    name: null,
    key: null,
    id: null
  };
  let arrs = [];
  arr.map((item, index) => {
    switch (item) {
      case "orgCount":
        obj = {
          name: "机构",
          key: item,
          id: index
        };
        break;
      case "entrustManager":
        obj = {
          name: "委外经理",
          key: item,
          id: index
        };
        break;
        case "entrustCount":
        obj = {
          name: "委案户数",
          key: item,
          id: index
        };
        break;
      case "entrustPriceList":
        obj = {
          name: "委案金额",
          key: item,
          id: index
        };
        break;
      case "targetPriceCountList":
        obj = {
          name: "目标回款额",
          key: item,
          id: index
        };
        break;
      case "targetRateList":
        obj = {
          name: "目标回款率",
          key: item,
          id: index
        };
        break;
      case "repayPriceCountList":
        obj = {
          name: "回款总额",
          key: item,
          id: index
        };
        break;
      case "repayPriceRateList":
        obj = {
          name: "回款比例",
          key: item,
          id: index
        };
        break;
      case "repayPriceScheduleList":
        obj = {
          name: "回款进度",
          key: item,
          id: index
        };
        break;
      case "repayPriceCount":
        obj = {
          name: "总计",
          key: item,
          id: index
        };
        break;
      default:
        obj = {
          name: item,
          key: item,
          id: index
        };
        break;
    }
    arrs.push(obj);
  });
  return arrs;
}


//数组叠加

export function addData(arr, type) {
  let arr2 = [];
  if (type === 1) {
    arr2 = arr.map(item => {
      return new Array(item.orgCount.length).fill(item.productName)
    })
    arr2 = ['总计'].concat(...arr2)
  } else {
    arr2 = arr;
  }
  let rowAndColumn = [];
  let pos = ""
  for (let i = 0; i < arr2.length; i++) {
    if (i === 0) {
      rowAndColumn.push(1);
      pos = 0;
    } else {
      if (arr2[i] === arr2[i - 1]) {
        // 如果storeName相等就累加，并且push 0
        rowAndColumn[pos] += 1;
        rowAndColumn.push(0);
      } else {
        // 不相等push 1
        rowAndColumn.push(1);
        pos = i;
      }
    }
  }
  return rowAndColumn
}

//获取前后七天的开始和结束日期

export function getWeekTime(time) {
  let date1 = new Date(),
    time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate(); //time1表示当前时间
  let date2 = new Date(date1);
  date2.setDate(date1.getDate() + time);
  let time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
  return {
    date1,
    date2
  }
}
// function fun_date(time){
//   let date1 = new Date(),
//   time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
//   let date2 = new Date(date1);
//   date2.setDate(date1.getDate()+time);
//   let time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
// }
// fun_date(7);//7天后的日期
// fun_date(-7);//7天前的日期




Array.prototype.sum = function (cbk) {
  //判断当前数组是否为空
  if (this?.length) {
    let total = 0 // 如果是带小数，精度高可以使用这个decimal(0)
    for (let i = 0; i < this.length; i++) {
      //获取回调函数处理好的值
      let value = cbk(this[i], i, this)
      //如果值不为空
      if (value) {
        total += parseFloat(value)
        //精度要求高可以使用下面这个
        //total = total.add(decimal(value))
      }
    }
    //返回总和
    return total
    //return total.toNumber() //高精度用这个
  }
  return 0
}

//数组数据相加算总计
export function addALLtableData(key, arr, num) {
  let obj = {
    cpeCurMonthRepaymentRate: key,
    cpeId: key,
    cpeLevel: key,
    totalAllotAmount: getKeyValue("totalAllotAmount", arr),
    cpeName: key,
    rangeOne: getKeyValue("rangeOne", arr),
    rangeZero: getKeyValue("rangeZero", arr),
    rangeThree: getKeyValue("rangeThree", arr),
    rangeTwo: getKeyValue("rangeTwo", arr),
    rangeFour: getKeyValue("rangeFour", arr),
    rangeFive: getKeyValue("rangeFive", arr),
    referAmount: num,
  };
  return obj
}
//委案值
export function getTotalAllotAmount(key, arr, num) {
  let object = arr.amountMap;
  let obj = {
    cpeCurMonthRepaymentRate: key,
    cpeId: key,
    cpeLevel: key,
    totalAllotAmount: arr.unAssignCaseAmount,
    cpeName: key,
    rangeOne: object.rangeOne,
    rangeFive: object.rangeFive,
    rangeZero: object.rangeZero,
    rangeThree: object.rangeThree,
    rangeTwo: object.rangeTwo,
    rangeFour: object.rangeFour,
    referAmount: arr.unAssignCaseAmount,
  };
  if (object === null) {
    obj.rangeZero = num
  }
  return obj
}
export function forTabel(arr) {
  arr.map((item) => {
    let num =
      forMateValue(item.cpeCaseAmount) +
      forMateValue(item.rangeOne) +
      forMateValue(item.rangeTwo) +
      forMateValue(item.rangeThree) +
      forMateValue(item.rangeFour) +
      forMateValue(item.rangeFive) +
      forMateValue(item.rangeZero);
    let totalAllotAmount =
      num - forMateValue(item.cpeCaseAmount);
    item["totalAllotAmount"] = Math.round(totalAllotAmount * 100) / 100;
    item["allNum"] = Math.round(num * 100) / 100;
    let rate = (item.allNum / item.referAmount) * 100;
    item["rate"] = Math.round(rate * 100) / 100;
  });
  return arr
}

function getTotalAllotAmountValue(type, object) {
  let value = 0
  for (const key in object) {
    if (key === type) {
      value = object[key]
    }
  }
  return value
}

function getKeyValue(key, arr) {
  let value = arr.sum(item => {
    if (item[key] === null) {
      item[key] = null;
    }
    return item[key]
  })
  return value
}

function forMateValue(item) {
  let value = 0;
  if (item === null) {
    value = 0;
  } else {
    value = parseInt(item);
  }
  return value;
}

//扁平数组转树状
export function arrayToTree(items) {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;
    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }
    itemMap[id] = {
      ...item,
      children: itemMap[id]['children']
    }
    if (pid === 0) {
      result.push(treeItem);

    } else {
      // if (!itemMap[pid]) {
      //   itemMap[pid] = {
      //     children: [],
      //   }
      // }
      // itemMap[pid].children.push(treeItem)
    }

  }
  return result;
}

//精确4舍5入
export function accMul(number, precision) {
  if (isNaN(number)) return NaN;
  var str = number.toString(10);
  var reg = new RegExp("\\.(\\d{" + precision + "})");
  if (/[^\-\.\d]/.test(str) || !reg.test(str)) return number;
  str = str.replace(reg, "$1.");
  return Math.round(parseFloat(str)) / Math.pow(10, precision);
}

// 处理级联不必要children
export function formatTree(data, children = 'children') {
  function setData(list) {
    list.forEach(item => {
      if (Array.isArray(item[children]) && !item[children].length) {
        item[children] = null
      }
      if (Array.isArray(item[children]) && item[children].length) {
        setData(item[children])
      }
    })
  }
  setData(data)
  return data
}

// 数值转为万，亿，并保留小数
// num 输入值 point：通过几位分隔 （point=3 千位 point=4 万位）
export function tranNumber(num, point = 4){
  let numStr = num
  if(num < 0) {
    numStr = num.toString().split('-')[1]
  }
  // console.log('numStr>>>',numStr.length)
  // 将数字转换为字符串,然后通过split方法用.分隔,取到第0个
  numStr = numStr.toString().split('.')[0]
  let pointNum = ''
  if(num.toString().split('.').length > 1) {
    pointNum = '.' + num.toString().split('.')[1]
  }
  if(numStr.length<5) { // 判断数字有多长,如果小于4,,表示1万以内的数字,让其直接显示
      // console.log(numStr);
      return num
  }else if(numStr.length>=6 && numStr.length<9){ // 如果数字大于6位,小于8位,让其数字后面加单位万
      let decimal = numStr.substring(numStr.length-4, numStr.length-4+point)
      let nums = parseFloat(parseInt(num / 10000))
    //  console.log(decimal);
      // 由千位,百位组成的一个数字
      return nums+'万'+decimal + pointNum
  }else if(numStr.length >= 9){ // 如果数字大于8位,让其数字后面加单位亿
    console.log('length>>>',numStr.length)
       let decimal = numStr.substring(numStr.length-8, numStr.length-8+point);
       let decimalEnd = numStr.substring(numStr.length-8+point, numStr.length)
      //  console.log('yi>>',decimal);
       let nums = parseFloat(parseInt(num/100000000)) ;console.log(nums)
       return nums +'亿'+ decimal + '万' + decimalEnd +  pointNum
  }
}