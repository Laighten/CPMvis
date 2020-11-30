import React, { useRef, useEffect } from "react"
import echarts from "echarts"
import "echarts/map/js/china"
import "echarts/map/js/province/anhui"
import "echarts/map/js/province/aomen"
import "echarts/map/js/province/beijing"
import "echarts/map/js/province/chongqing"
import "echarts/map/js/province/fujian"
import "echarts/map/js/province/gansu"
import "echarts/map/js/province/guangdong"
import "echarts/map/js/province/guangxi"
import "echarts/map/js/province/guizhou"
import "echarts/map/js/province/hainan"
import "echarts/map/js/province/hebei"
import "echarts/map/js/province/heilongjiang"
import "echarts/map/js/province/henan"
import "echarts/map/js/province/hubei"
import "echarts/map/js/province/hunan"
import "echarts/map/js/province/jiangsu"
import "echarts/map/js/province/jiangxi"
import "echarts/map/js/province/jilin"
import "echarts/map/js/province/liaoning"
import "echarts/map/js/province/neimenggu"
import "echarts/map/js/province/ningxia"
import "echarts/map/js/province/qinghai"
import "echarts/map/js/province/shandong"
import "echarts/map/js/province/shanghai"
import "echarts/map/js/province/shanxi"
import "echarts/map/js/province/shanxi1"
import "echarts/map/js/province/sichuan"
import "echarts/map/js/province/taiwan"
import "echarts/map/js/province/tianjin"
import "echarts/map/js/province/xianggang"
import "echarts/map/js/province/xinjiang"
import "echarts/map/js/province/xizang"
import "echarts/map/js/province/yunnan"
import "echarts/map/js/province/zhejiang"
import { Modal } from "antd"
import style from "./index.less"
import axios from "@/services"
import _ from "lodash"
const option = {
	title: [
		{
			show: true,
			text: "",
			textStyle: {
				color: "#fff",
				fontSize: 18,
			},
			left: 20,
			top: 20,
		},
	],
	tooltip: {
		show: true,
		formatter: function (params) {
			if (!params.data) {
				return
			}
			return params.name + "：" + params.data["value"]
		},
	},
	visualMap: {
		type: "piecewise",
		showLabel: true,
		seriesIndex: 0,
		pieces: [
			{ gt: 100 }, // (1500, Infinity]
			{ gt: 50, lte: 100 }, // (900, 1500]
			{ gt: 31, lte: 50 }, // (900, 1500]
			{ gt: 20, lte: 30 }, // (310, 1000]
			{ gt: 10, lte: 20 }, // (200, 300]
			{ gte: 1, lte: 10 }, // (10, 200]
			{ lte: 0 },
		],
		inRange: {
			color: ["#6FCF6A", "#FFFD64", "#FF5000"],
		},
		textStyle: {
			color: "#7B93A7",
		},
		align: "left",
		bottom: 5,
		left: "20",
	},
	geo: {
        zoom: .5,
		// roam: true,
		map: "china",
		left: "left",
		right: "10",
		// layoutSize: '80%',
		label: {
			emphasis: {
				show: false,
			},
		},
		itemStyle: {
			emphasis: {
				areaColor: "#fff464",
			},
		},
	},
	series: {
		name: "mapSer",
		type: "map",
		roam: false,
		geoIndex: 0,
		label: {
			show: false,
		},
		data: [],
	},
}

const TYPE_OBJ = {
	confirmed: "city_confirmedCount",
	suspected: "city_suspectedCount",
	cured: "city_curedCount",
	dead: "city_deadCount",
}

export default function Province({
	visible,
	setVisible,
	provice,
	currentDate,
	type,
}) {
	const ref = useRef(null)
	const chart = useRef(null)
	const originData = useRef({})

	useEffect(() => {
		axios("CityDataDaily.json").then((res) => {
			originData.current = _.chain(res)
				.reduce((obj, d) => {
					const key = d.provinceName
					if (!obj[key]) {
						obj[key] = []
					}
					obj[key].push(d)
					return obj
				}, {})
                .value()
                
                console.log(originData.current);
                
		})
	}, [])

	useEffect(() => {
		if (!visible) return
		setTimeout(() => {
            const data = _.chain(originData.current)
                .find((d, k) => k.includes(provice))
				.filter((d) => d.updateTime === currentDate)
				.reduce((obj, d) => {
					const key = d.cityName
					if (!obj[key]) {
						obj[key] = []
					}
					obj[key].push(d)
					return obj
				}, {})
				.map((d, k) => ({
					name: k,
					value: _.sumBy(d, d1 => +d1[TYPE_OBJ[type]]),
				}))
				.value()
            option.title[0].text = provice
            option.geo.map = provice
			option.series.data = data
			chart.current = echarts.init(ref.current)
            chart.current.setOption(option)
            
		})
	}, [visible, provice, currentDate, type])

	return (
		<Modal
			className={style["province-modal"]}
			footer={false}
			visible={visible}
			onCancel={() => setVisible(false)}
			width={"50vw"}
			bodyStyle={{
				height: "60vh",
			}}
		>
			<div className="chart-container" ref={ref}></div>
		</Modal>
	)
}
