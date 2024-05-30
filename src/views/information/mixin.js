import sichuan from '@/utils/province/sichuan.json'
import anhui from '@/utils/province/anhui.json'
import aomen from '@/utils/province/aomen.json'
import beijing from '@/utils/province/beijing.json'
import chongqing from '@/utils/province/chongqing.json'
import fujian from '@/utils/province/fujian.json'
import gansu from '@/utils/province/gansu.json'
import guangdong from '@/utils/province/guangdong.json'
import guangxi from '@/utils/province/guangxi.json'
import guizhou from '@/utils/province/guizhou.json'
import hainan from '@/utils/province/hainan.json'
import hebei from '@/utils/province/hebei.json'
import heilongjiang from '@/utils/province/heilongjiang.json'
import henan from '@/utils/province/henan.json'
import hubei from '@/utils/province/hubei.json'
import hunan from '@/utils/province/hunan.json'
import jiangsu from '@/utils/province/jiangsu.json'
import jiangxi from '@/utils/province/jiangxi.json'
import jilin from '@/utils/province/jilin.json'
import liaoning from '@/utils/province/liaoning.json'
import neimenggu from '@/utils/province/neimenggu.json'
import ningxia from '@/utils/province/ningxia.json'
import qinghai from '@/utils/province/qinghai.json'
import shandong from '@/utils/province/shandong.json'
import shanghai from '@/utils/province/shanghai.json'
import shanxi from '@/utils/province/shanxi.json'
import shanxi1 from '@/utils/province/shanxi1.json'
import tianjin from '@/utils/province/tianjin.json'
import xianggang from '@/utils/province/xianggang.json'
import xinjiang from '@/utils/province/xinjiang.json'
import xizang from '@/utils/province/xizang.json'
import yunnan from '@/utils/province/yunnan.json'
import zhejiang from '@/utils/province/zhejiang.json'
import taiwan from '@/utils/province/taiwan.json'
import china from '@/utils/china.json'


const officeOption = {
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    legend: {
        data: [],
        type: 'scroll',
        // selectedMode: false
    },
    grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
    },
    xAxis: {
        type: "category",
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: "value",
        axisLabel: {
            formatter: function (value) {
                return `${value}场`;
            }
        },
    },
    series: [
    ],
};

const provinceOption =
{
    geo: {
        map: 'china',
        type: 'map',
        zoom: 1.2,
        label: {
            emphasis: {
                show: false
            }
        }
    },
    tooltip: {
        //数据格式化
        formatter: function (params) {
            if (params.data) {
                return mixinData.methods.popStyle(params);
            } else {
                return (
                    params.name + "<br />" + "暂无数据"
                );
            }
        },
    },
    visualMap: {
        min: 0,
        right: '10%',
        inRange: {
            color: ["#e0ffff", "rgb(89,213,161)"], //取值范围的颜色 89 213 161
        },
        show: true, //图注
        calculable: true
    },
    // 鼠标悬浮提示框
    series: [
        {
            type: "map",
            geoIndex: 0,
            data: []
        }
    ],
};

const cityOption =
{
    geo: {
        map: '',
        type: 'map',
        zoom: 1.2,
        label: {
            emphasis: {
                show: false
            }
        }
    },
    tooltip: {
        //数据格式化
        formatter: function (params) {
            if (params.data) {
                return mixinData.methods.popStyle(params);
            } else {
                return (
                    params.name + "<br />" + "暂无数据"
                );
            }
        },
    },
    visualMap: {
        min: 0,
        right: '10%',
        inRange: {
            color: ["#e0ffff", "rgb(89,213,161)"], //取值范围的颜色 89 213 161
        },
        show: true, //图注
        calculable: true
    },
    // 鼠标悬浮提示框
    series: [
        {
            type: "map",
            geoIndex: 0,
            data: []
        }
    ],
};

const topOption = {
    grid: {
        left: '2%',
        y: 0,
        y2: 0,
        x2: '10%',
        containLabel: true,
    },
    tooltip: {
        trigger: "axis"
    },
    xAxis: {
        type: 'value',
        min: 0,
        axisLabel: {
            show: false,
            textStyle: {
                fontSize: '20'
            }
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'category',
        inverse: true,
        offset: 0,
        axisTick: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisLabel: {
            formatter: function (value) {
                if (value.length > 4) {
                    return `${value.slice(0, 4)}...`;
                }
                return value;
            }
        },
        data: []
    },
    series: [{
        name: '',
        type: 'bar',
        barWidth: 8,
        data: [],
        label: {
            show: true,
            formatter: '{c}', //显示数据带上百分比
            position: 'right'
        },
        itemStyle: {
            normal: {
                color: "rgb(89,213,161)",
                lineStyle: {
                    color: "rgb(89,213,161)"
                }
            }
        }
    }]
};

let mixinData = {
    data() {
        return {
            inComeData: {},//票房数据
            officeCharts: null, //折线图
            currentProvince: '江苏省', //默认江苏
            provinceManuChart: null, //省地图
            cityManuChart: null, //地区地图
            topStoreChart: null, //top店铺
            topStoreObj: null,
            areaOptions: [],//省数据
            provinceAuthCountList: [], //省授权数量
            cityAuthCountList: [], //地区授权数量
            provinceTotal: 0,
            cityTotal: 0,
            topStoreList: [], //Top10店铺数据
            averageDramaInfo: null, //店均开本次数
            uvBoxOfficeCount: {}, //票房本指标趋势-开本数
            income: 0,
            openCount: 0
        }
    },
    methods: {
        //查询票房数据
        async queryTicketData() {
            officeOption.xAxis.data = [];
            officeOption.series = [];
            officeOption.tooltip = {};
            officeOption.legend.data = [];

            if(this.searchObj.beginDate && this.searchObj.endDate){
                this.officeCharts.showLoading();

                try {
                    let inComeData = await this.$api.biStoreUvBiBoxIncomeData({
                        "startTime": this.searchObj.beginDate,
                        "endTime": this.searchObj.endDate
                    })
                    
                    //计算总价
                    this.income = 0;
                    this.openCount = 0;

                    inComeData.map(v=>{
                        v.map(game=>{
                            this.income += game.onlineGameIncome
                            this.openCount += game.onlineGameNum
                        })
                    })

                    //X轴
                    inComeData[0].map(it => {
                        officeOption.xAxis.data.push(it.time);
                    })
                    //Y轴
                    inComeData.map(it => {
                        it.map(v=>{
                            v['value'] = v.onlineGameNum
                        })
                        
                        officeOption.series.push({
                            name: it[0].dramaName,
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            data: it,
                            emphasis: {
                                focus: 'series'
                            },

                        })
                    })

                    inComeData.map(it => {
                        officeOption.legend.data.push({
                            name: it[0].dramaName,
                        })
                    })

                    officeOption.tooltip = {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                              backgroundColor: '#6a7985'
                            }
                        },
                        formatter: function (params) {
                            
                            let count = 0;
                            let income = 0;
                            params.map(it => {
                                count += it.data.onlineGameNum;
                                income += it.data.onlineGameIncome;
                            })
                            return `${params[0].name}<br/><div>开本数：${count}场<span style="margin-left:30px;">收入：${income/100}元</span></div><ul>
                                ${params.map(item => {
                                return ` <li style="display: flex;align-items: center;justify-content: space-between;"><div>${item.marker} ${item.seriesName}：</div><div>${item.data.onlineGameNum}场 ${item.data.onlineGameIncome/100}元</div></li>`
                            }).join('')
                                }
                            </ul>`
                        }
                    }

                    this.officeCharts.setOption(officeOption, true);
                    
                    let that = this;
                    this.officeCharts.on('legendselectchanged', function(params) {
                        that.income = 0;
                        that.openCount = 0;

                        inComeData.map(v=>{
                            v.map(game=>{
                                if(params.selected[game.dramaName]){
                                    that.income += game.onlineGameIncome
                                    that.openCount += game.onlineGameNum
                                }
                            })
                        })
                    });
                
                    this.officeCharts.hideLoading();
                } catch (e) {
                    this.officeCharts.hideLoading();
                }
            }
        },
        //绘制折线图
        drawLine(id) {
            let that = this;
            this.officeCharts = this.$echarts.init(document.getElementById(id));

            window.addEventListener("resize", function () {
                that.officeCharts.resize();
            });
        },
        //绘制排行
        drawRanking(id) {
            let that = this;
            this.topStoreChart = this.$echarts.init(document.getElementById(id));

            window.addEventListener("resize", function () {
                that.topStoreChart.resize();
            });
        },
        //绘制中国地图
        drawChinaMap(id) {
            let that = this;
            this.provinceManuChart = this.$echarts.init(document.getElementById(id));

            window.addEventListener("resize", function () {
                that.provinceManuChart.resize();
            });
        },
        //绘制省份地图
        drawProvinceMap(id) {
            let that = this;
            this.cityManuChart = this.$echarts.init(document.getElementById(id));

            window.addEventListener("resize", function () {
                that.cityManuChart.resize();
            });
        },
        //注册省地图
        registerMap() {
            this.$echarts.registerMap('四川省', sichuan);
            this.$echarts.registerMap('安徽省', anhui);
            this.$echarts.registerMap('澳门特别行政区', aomen);
            this.$echarts.registerMap('北京市', beijing);
            this.$echarts.registerMap('重庆市', chongqing);
            this.$echarts.registerMap('福建省', fujian);
            this.$echarts.registerMap('甘肃省', gansu);
            this.$echarts.registerMap('广东省', guangdong);
            this.$echarts.registerMap('广西壮族自治区', guangxi);
            this.$echarts.registerMap('贵州省', guizhou);
            this.$echarts.registerMap('海南省', hainan);
            this.$echarts.registerMap('河北省', hebei);
            this.$echarts.registerMap('黑龙江省', heilongjiang);
            this.$echarts.registerMap('河南省', henan);
            this.$echarts.registerMap('湖北省', hubei);
            this.$echarts.registerMap('湖南省', hunan);
            this.$echarts.registerMap('江苏省', jiangsu);
            this.$echarts.registerMap('江西省', jiangxi);
            this.$echarts.registerMap('吉林省', jilin);
            this.$echarts.registerMap('辽宁省', liaoning);
            this.$echarts.registerMap('内蒙古自治区', neimenggu);
            this.$echarts.registerMap('宁夏回族自治区', ningxia);
            this.$echarts.registerMap('青海省', qinghai);
            this.$echarts.registerMap('山东省', shandong);
            this.$echarts.registerMap('上海市', shanghai);
            this.$echarts.registerMap('山西省', shanxi);
            this.$echarts.registerMap('陕西省', shanxi1);
            this.$echarts.registerMap('天津市', tianjin);
            this.$echarts.registerMap('香港特别行政区', xianggang);
            this.$echarts.registerMap('新疆维吾尔自治区', xinjiang);
            this.$echarts.registerMap('西藏自治区', xizang);
            this.$echarts.registerMap('云南省', yunnan);
            this.$echarts.registerMap('浙江省', zhejiang);
            this.$echarts.registerMap('台湾省', taiwan);
            this.$echarts.registerMap('china', china);
        },
        //  获取地区集联数据
        async initAreaData() {
            let data = await this.$api.regionQueryRegionCascadeList({});
            data.map(it => {
                if (it.regionName !== '海外') {
                    this.areaOptions.push(it);
                }
            })
        },
        //弹出框样式
        popStyle(params) {
            return `<div style="padding: 5px;border: transparent!important;">
            <div style="font-size: 10px;">${params.data.areaName}</div>
            <div style="padding-top: 10px;font-size: 14px;display:flex;align-items: center;">
              <div style="background: rgb(187,222,215); width: 5px; height: 5px;border-radius: 5px;margin-right:5px;"></div>
               ${params.data.isAuth ? ('授权数：' + params.data.number) : ('收入：' + params.data.income / 100)}
            </div>
            <div style="padding-top: 10px;font-size: 14px;display:flex;align-items: center;">
              <div style="background: rgb(187,222,215); width: 5px; height: 5px;border-radius: 5px;margin-right:5px;"></div>
              占比 ${(params.data.percent * 100).toFixed(2)}%
            </div>
          </div>`
        },
        //查询中国授权数量
        async queryProvinceAuthCount() {
            this.provinceManuChart.showLoading();
            try {
                let data = await this.$api.biStoreUvBiStoreAuthorizationByProvince({
                    pageNo: 1,
                    pageSize: 100,
                    "dramaId": this.searchObj.dramaId,
                    "startTime": this.searchObj.beginDate,
                    "endTime": this.searchObj.endDate
                })
                this.provinceTotal = data.total;
                this.provinceAuthCountList = data.list;
                provinceOption.visualMap.precision = '0';

                if (data.list && data.list.length) {
                    data.list.map(it => {
                        it['name'] = it.areaName;
                        it['value'] = it.number;
                        it['isAuth'] = true;
                    })
                    //修改注解最大值
                    let max = data.list.sort((a, b) => { return a.number > b.number });
                    provinceOption.visualMap.max = max[0].number;
                    //传入数据
                    provinceOption.series[0].data = this.provinceAuthCountList;
                } else {
                    provinceOption.visualMap.max = 100;
                    provinceOption.series[0].data = [];
                }
                //刷新地图
                this.provinceManuChart.setOption(provinceOption);
                this.provinceManuChart.hideLoading();
            } catch (e) {
                this.provinceManuChart.hideLoading();
            }
        },
        //查询中国票房收入
        async queryProvinceTicketAmount() {
            this.provinceManuChart.showLoading();
            try {
                let data = await this.$api.biStoreUvBiStoreIncomeByProvince({
                    pageNo: 1,
                    pageSize: 100,
                    "dramaId": this.searchObj.dramaId,
                    "startTime": this.searchObj.beginDate,
                    "endTime": this.searchObj.endDate
                })
                this.provinceAuthCountList = data.list;
                this.provinceTotal = data.total;
                provinceOption.visualMap.precision = '2';

                if (data.list && data.list.length) {
                    data.list.map(it => {
                        it['name'] = it.areaName;
                        it['value'] = it.income / 100;
                        it['isAuth'] = false;
                    })
                    //修改注解最大值
                    let max = data.list.sort((a, b) => { return a.income > b.income });
                    provinceOption.visualMap.max = max[0].income / 100;
                    //传入数据
                    provinceOption.series[0].data = this.provinceAuthCountList;
                } else {
                    provinceOption.visualMap.max = 100;
                    provinceOption.series[0].data = [];
                }
                //刷新地图
                this.provinceManuChart.setOption(provinceOption);
                this.provinceManuChart.hideLoading();
            } catch (e) {
                this.provinceManuChart.hideLoading();
            }
        },
        //查询地区授权数量
        async queryCityAuthCount() {
            this.cityManuChart.showLoading();
            try {
                let cityId = '';
                this.areaOptions.map(it => {
                    if (it.regionName === this.currentProvince) {
                        cityId = it.id
                    }
                })
                let data = await this.$api.biStoreUvBiStoreAuthorizationByCity({
                    pageNo: 1,
                    pageSize: 100,
                    areaId: cityId,
                    "dramaId": this.searchObj.dramaId,
                    "startTime": this.searchObj.beginDate,
                    "endTime": this.searchObj.endDate
                })
                //选择地区
                cityOption.geo.map = this.currentProvince;
                cityOption.visualMap.precision = '0';

                this.cityAuthCountList = data.list;
                this.cityTotal = data.total;

                if (data.list && data.list.length) {
                    data.list.map(it => {
                        it['name'] = it.areaName;
                        it['value'] = it.number;
                        it['isAuth'] = true;
                    })
                    //修改注解最大值
                    let max = data.list.sort((a, b) => { return a.number > b.number });
                    cityOption.visualMap.max = max[0].number;
                    //传入数据
                    cityOption.series[0].data = this.cityAuthCountList;
                } else {
                    cityOption.visualMap.max = 100;
                    cityOption.series[0].data = [];
                }
                //刷新地图
                this.cityManuChart.setOption(cityOption);
                this.cityManuChart.hideLoading();
            } catch (e) {
                this.cityManuChart.hideLoading();
            }
        },
        //查询地区票房收入
        async queryCityTicketAmount() {
            this.cityManuChart.showLoading();
            try {
                let cityId = '';
                this.areaOptions.map(it => {
                    if (it.regionName === this.currentProvince) {
                        cityId = it.id
                    }
                })
                let data = await this.$api.biStoreUvBiStoreIncomeByCity({
                    pageNo: 1,
                    pageSize: 100,
                    areaId: cityId,
                    "dramaId": this.searchObj.dramaId,
                    "startTime": this.searchObj.beginDate,
                    "endTime": this.searchObj.endDate
                })
                this.cityAuthCountList = data.list;
                this.cityTotal = data.total;
                cityOption.visualMap.precision = '2';

                if (data.list && data.list.length) {
                    data.list.map(it => {
                        it['name'] = it.areaName;
                        it['value'] = it.income / 100;
                        it['isAuth'] = false;
                    })
                    //修改注解最大值
                    let max = data.list.sort((a, b) => { return a.income > b.income });
                    cityOption.visualMap.max = max[0].income / 100;
                    //传入数据
                    cityOption.series[0].data = this.cityAuthCountList;
                } else {
                    cityOption.visualMap.max = 100;
                    cityOption.series[0].data = [];
                }

                this.cityManuChart.setOption(cityOption);
                this.cityManuChart.hideLoading();
            } catch (e) {
                this.cityManuChart.hideLoading();
            }
        },
        //查询店铺Top10
        async queryTopStore() {
            this.topStoreChart.showLoading();

            try {
                let data = await this.$api.biStoreUvBiStoreIncomeTop10({
                    "dramaId": this.searchObj.dramaId,
                    "startTime": this.searchObj.beginDate,
                    "endTime": this.searchObj.endDate
                })
                this.topStoreObj = data;

                if (data) {
                    topOption.series[0].data = [];
                    topOption.yAxis.data = [];
                    topOption.tooltip = {
                        trigger: 'axis',
                        formatter: function (params) {
                            return (
                                params[0].name +
                                '<br />' +
                                params[0].marker + '收入：' + params[0].value
                            );
                        }
                    }

                    data.map(it => {
                        topOption.yAxis.data.push(it.storeName);
                        topOption.series[0].data.push(this.$filters.currency(it.income, ''));
                    })
                    this.topStoreChart.setOption(topOption);
                }
                this.topStoreChart.hideLoading();
            } catch (e) {
                this.topStoreChart.hideLoading();
            }
        },
        //店铺均开本次数
        async queryOpenDramaCount() {
            try {
                let data = await this.$api.biStoreUvBiStoreAverageTime({
                    "dramaId": this.searchObj.dramaId,
                    "startTime": this.searchObj.beginDate,
                    "endTime": this.searchObj.endDate
                })

                data['nums'] = String(data.averageTime).split("");
                this.averageDramaInfo = data;
                this.loading.close();
            } catch (e) {
                this.loading.close();
            }
        },
        //查询票房本指标趋势-开本数（场）
        async queryOfficeCountData() {
            this.officeCharts.showLoading();
            try {
                let data = await this.$api.biStoreUvBiBoxOfficeCountData({
                    "dramaId": this.searchObj.dramaId,
                    "startTime": this.searchObj.beginDate,
                    "endTime": this.searchObj.endDate
                })
                this.uvBoxOfficeCount = data;

                officeOption.xAxis.data = [];
                officeOption.series[0].data = [];
                officeOption.series[1].data = [];
                officeOption.series[0].itemStyle.normal.label.show = true;
                officeOption.series[1].itemStyle.normal.label.show = true;
                officeOption.yAxis.axisLabel = {
                    show: true,
                    interval: 'auto',
                    formatter: '{value}',
                }
                officeOption.tooltip = {
                    trigger: 'axis'
                }

                //判断起始日期是否是同一年
                let isSameYear = true;
                if (new Date(data.boxOfficeCountItems[0].date).getFullYear() !== new Date(data.boxOfficeCountItems[data.boxOfficeCountItems.length - 1].date).getFullYear()) {
                    isSameYear = false;
                }

                data.boxOfficeCountItems.map(it => {
                    officeOption.xAxis.data.push(`${this.$dayjs(it.date).format(isSameYear ? 'MM/DD' : 'YYYY/MM/DD')} ${this.getWeek(it.date)}`);
                    officeOption.series[0].name = '场次';
                    officeOption.series[0].data.push(it.count)
                })
                this.officeCharts.setOption(officeOption, true);
                this.officeCharts.hideLoading();
            } catch (e) {
                this.officeCharts.hideLoading();
            }
        },
        //查询收入数据
        async queryBiIncomeData() {
            this.officeCharts.showLoading();
            try {
                let data = await this.$api.biStoreUvBiBoxOfficeIncomeData({
                    "dramaId": this.searchObj.dramaId,
                    "startTime": this.searchObj.beginDate,
                    "endTime": this.searchObj.endDate
                })
                this.uvBoxOfficeCount = data;

                officeOption.xAxis.data = [];
                officeOption.series[0].data = [];
                officeOption.series[1].data = [];
                officeOption.series[0].itemStyle.normal.label.show = true;
                officeOption.series[1].itemStyle.normal.label.show = true;
                officeOption.yAxis.axisLabel = {
                    show: true,
                    interval: 'auto',
                    formatter: '{value}',
                }
                officeOption.tooltip = {
                    trigger: 'axis'
                }

                //判断起始日期是否是同一年
                let isSameYear = true;
                if (new Date(data.boxOfficeCountItems[0].date).getFullYear() !== new Date(data.boxOfficeCountItems[data.boxOfficeCountItems.length - 1].date).getFullYear()) {
                    isSameYear = false;
                }

                data.boxOfficeCountItems.map(it => {
                    officeOption.xAxis.data.push(`${this.$dayjs(it.date).format(isSameYear ? 'MM/DD' : 'YYYY/MM/DD')} ${this.getWeek(it.date)}`);
                    officeOption.series[0].name = '收入';
                    officeOption.series[0].data.push(it.income / 100)
                })
                this.officeCharts.setOption(officeOption, true);
                this.officeCharts.hideLoading();
            } catch (e) {
                this.officeCharts.hideLoading();
            }
        },
        //查询票房本指标趋势-开本率
        async queryBiPlayRateData() {
            this.officeCharts.showLoading();
            try {
                let data = await this.$api.biStoreUvBiBoxOfficePlayRateData({
                    "dramaId": this.searchObj.dramaId,
                    "startTime": this.searchObj.beginDate,
                    "endTime": this.searchObj.endDate
                })
                this.uvBoxOfficeCount = data;

                officeOption.xAxis.data = [];
                officeOption.series[0].data = [];
                officeOption.series[1].data = [];
                officeOption.series[0].itemStyle.normal.label.show = false;
                officeOption.series[1].itemStyle.normal.label.show = false;
                //格式化百分比
                officeOption.yAxis.axisLabel = {
                    show: true,
                    interval: 'auto',
                    formatter: '{value}%',
                }
                officeOption.tooltip = {
                    trigger: 'axis',
                    formatter: function (params) {
                        return (
                            params[0].name +
                            '<br />' +
                            params[0].marker + '开本率：' + params[0].value + '%' +
                            '<br />' +
                            params[1].marker + '复开率：' + params[1].value + '%'
                        );
                    }
                }

                //判断起始日期是否是同一年
                let isSameYear = true;
                if (new Date(data.boxOfficePlayRateDataItem[0].date).getFullYear() !== new Date(data.boxOfficePlayRateDataItem[data.boxOfficePlayRateDataItem.length - 1].date).getFullYear()) {
                    isSameYear = false;
                }

                this.uvBoxOfficeCount.boxOfficePlayRateDataItem.map(it => {
                    officeOption.xAxis.data.push(`${this.$dayjs(it.date).format('MM/DD')} ${this.getWeek(it.date)}`);
                    officeOption.series[0].name = '开本率';
                    officeOption.series[0].data.push(it.splitCopyRatio);
                    officeOption.series[1].name = '复开率';
                    officeOption.series[1].data.push(it.rateOfReturn)
                })
                this.officeCharts.setOption(officeOption, true);
                this.officeCharts.hideLoading();
            } catch (e) {
                this.officeCharts.hideLoading();
            }
        },
        //查询市场流水预估
        async queryBiFlowForecastData() {
            this.officeCharts.showLoading();
            try {
                let data = await this.$api.biStoreUvBiBoxOfficeFlowForecastData({
                    "dramaId": this.searchObj.dramaId,
                    "startTime": this.searchObj.beginDate,
                    "endTime": this.searchObj.endDate
                })
                this.uvBoxOfficeCount = data;

                officeOption.xAxis.data = [];
                officeOption.series[0].data = [];
                officeOption.series[1].data = [];
                officeOption.series[0].itemStyle.normal.label.show = true;
                officeOption.series[1].itemStyle.normal.label.show = true;
                officeOption.yAxis.axisLabel = {
                    show: true,
                    interval: 'auto',
                    formatter: '{value}',
                }
                officeOption.tooltip = {
                    trigger: 'axis'
                }

                //判断起始日期是否是同一年
                let isSameYear = true;
                if (new Date(data.boxOfficeFlowForecastItems[0].date).getFullYear() !== new Date(data.boxOfficeFlowForecastItems[data.boxOfficeFlowForecastItems.length - 1].date).getFullYear()) {
                    isSameYear = false;
                }

                data.boxOfficeFlowForecastItems.map(it => {
                    officeOption.xAxis.data.push(`${this.$dayjs(it.date).format(isSameYear ? 'MM/DD' : 'YYYY/MM/DD')} ${this.getWeek(it.date)}`);
                    officeOption.series[0].name = '流水';
                    officeOption.series[0].data.push(it.flow / 100)
                })
                this.officeCharts.setOption(officeOption, true);
                this.officeCharts.hideLoading();
            } catch (e) {
                this.officeCharts.hideLoading();
            }
        },
        /**
         * 转换日期
         */
        getWeek(dateString) {
            dateString = dateString.replace(/-/g, "/");
            let date = new Date(dateString).getDay();
            var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
            return "周" + weeks[date];
        }
    }

}
export default mixinData;