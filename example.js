var ThreeGeoMap = require('./src');
var map = null,AreaList = [];
const AllowAreaList = ['china', 'hubei', 'wuhan'];
var CurrentArea = 'china';
var ptns = window.location.href.split('?area=');
if (ptns.length == 2) {
    if (_.indexOf(AllowAreaList, ptns[1]) >= 0) {
        CurrentArea = ptns[1];
    }
}

class TestFunctions {
    constructor() {
        this.AREA = CurrentArea;
    }

    switchMap(AREA) {
        window.location.href = '?area=' + AREA;
    }

    setColors() {
        var arr = [];
        var list = _.sampleSize(AreaList, _.random(1,AreaList.length-1));
        list.map(function (area) {
            arr.push({
                area: area,
                color: new THREE.Color(_.random(0.1, 1), 0.31, 1)
            });
        });
        map.setColors(arr);
    }

    setPoints() {
        var arr = [];
        var list = _.sampleSize(AreaList, _.random(1,AreaList.length-1));
        list.map(function (area) {
            arr.push({
                area: area,
                amount: _.random(0, 10000)
            });
        });
        map.setPoints(arr);
    }

    setHeight() {
        var arr = [];
        AreaList.map(function (area) {
            arr.push({
                area: area,
                amount: _.random(0, 10000)
            });
        });
        map.setHeight(arr);
    }

    setBars() {
        var arr = [];
        AreaList.map(function (area) {
            arr.push({
                area: area,
                count: _.random(0, 10000),
            });
        });
        map.setBars(arr);
    }


    setLines() {
        var lineNum = _.random(0, 50);
        var arr = [];
        for (let i = 0; i < lineNum; i++) {
            var line = _.sampleSize(AreaList, 2);
            arr.push(line);
        }

        arr = _.uniqWith(arr, _.isEqual);
        var lines = [];
        arr.map(function (item) {
            lines.push({
                form: item[0],
                to: item[1],
                count: _.random(0, 10000),
            });
        });
        map.setLines(lines);
    }

}
var test = new TestFunctions();

d3.json('/data/' + CurrentArea + '.json', function (json) {
    json.features.map(function (item) {
        AreaList.push(item.properties.name);
    });

    map = new ThreeGeoMap(json, document.getElementById('container'), {});

    var gui = new dat.GUI();
    //切换地图
    gui.add(test, 'AREA', {
        '中国': 'china',
        '湖北': 'hubei',
        '武汉': 'wuhan'
    }).onChange(test.switchMap);

    gui.add(test, 'setColors');
    gui.add(test, 'setHeight');
    gui.add(test, 'setBars');
    gui.add(test, 'setLines');
    gui.add(test, 'setPoints');

});