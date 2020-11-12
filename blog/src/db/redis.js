const redis = require("redis");
const { REDIS_CONF } = require("../conf/db");

const redisClient = redis.createClient(REDIS_CONF);
redisClient.on("error", (err) => {
  console.error("REDIS / 連結錯誤 / 原因 >>> ", error);
});
redisClient.on("connect", (err) => {
  console.log("REDIS / 連接成功");
});
function set(key, val) {
console.log('k: ', key)
console.log('v: ', val)
  let _val = val
  if (typeof _val === "object") {
	console.log('stringify ing...')
        _val = JSON.stringify(_val);
  }
  return new Promise((resolve, reject) => {
    redisClient.set(key, _val, (err, ok) => {
      if(err){ return reject({dbErrNo: '211', dbErrMsg: `REDIS設值失敗,原因 >>> ${err}`})}
      if(ok === 'OK') {
        console.log('REDIS / set完成')
        return resolve(val)
      }
    });
  })
}

function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err);
        return;
      }
      if (val === null) {
        resolve(null);
      }
      try {
        resolve(JSON.parse(val));
      } catch (ex) {
        resolve(val);
      }
    });
  });
  return promise;
}

module.exports = {
  set,
  get
};

