import useMainStore from "src/stores/mainStore/mainStore";

/**
 * ip定位
 */
function getLocalCityByIp(domIdString) {
  var map = new BMapGL.Map(domIdString); // 一定要有一个div
  var point = new BMapGL.Point(116.331398, 39.897445);
  map.centerAndZoom(point, 12);

  async function myFun(result) {
    var cityName = await result.name;
    map.setCenter(cityName);

    console.log("当前定位城市:" + cityName);
    const mainStore = useMainStore();
    mainStore.localCity = cityName;
  }
  var myCity = new BMapGL.LocalCity();
  myCity.get(myFun);
}

export { getLocalCityByIp };
