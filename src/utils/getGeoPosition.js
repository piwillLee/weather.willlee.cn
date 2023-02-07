export default function getGeoPosition(context) {
  // 1.申请获取地理定位
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => getLocation(pos), // 成功函数
      (e) => showError(e), // 失败函数
      { timeout: 5000 } // PositionOptions参数 设置超时时间
    );
  } else {
    alert("浏览器不支持地理定位！");
  }

  // 2.成功获取到定位
  const getLocation = (pos) => {
    // 判断是否已获取到定位 ? 返回经纬度 : 直接使用ip定位
    // pos = pos ? `${pos.coords.longitude},${pos.coords.latitude}` : "auto_ip";
    pos = `${pos.coords.longitude},${pos.coords.latitude}`;
    console.log("当前城市定位", pos);
    return pos;
  };

  // 3.定位失败反馈
  // function showError(error) {
  //   vm.$store.state.posError = true;
  //   // 先自动获取一次假数据 防止页面空白
  //   // vm.$store.dispatch('getWeather', 'auto_ip');

  //   switch (error.code) {
  //     case error.PERMISSION_DENIED:
  //       alert("定位失败，用户拒绝请求地理定位");
  //       break;
  //     case error.POSITION_UNAVAILABLE:
  //       alert("定位失败，位置信息是不可用");
  //       break;
  //     case error.TIMEOUT:
  //       alert("定位失败，请求获取用户位置超时");
  //       break;
  //     case error.UNKNOWN_ERROR:
  //       alert("未知错误，定位系统失效");
  //       break;
  //   }
  // }
}
