var rp = require('request-promise')

exports.main = (event,context) =>{
  var from_latitude = event.from_latitude;
  var from_longitude = event.from_longitude;
  var to_latitude = event.to_latitude;
  var to_longitude  = event.to_longitude;
  var options = {
    uri: 'https://apis.map.qq.com/ws/distance/v1/',
    qs: {
      key: 'TT6BZ-TBPKD-64C4D-HUSKZ-OPEO6-B7B4B',
      mode:'walking',
      from: `${from_latitude},${from_longitude}`,
      to: `${to_latitude},${to_longitude}`,
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
  }
  var position = rp(options).then(res =>{
    return res;
  }).catch(err =>{
    console.log(err)
  })
  return position
  }