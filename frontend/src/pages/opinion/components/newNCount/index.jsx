import React, { useRef, useEffect } from "react"
import echarts from "echarts"
import Section from "@/components/section"
import { proxyAxios, axios } from "@/services"
import _ from "lodash"
import moment from "moment"
import { formatDate } from "@/utils"

const option = {
	backgroundColor: "transparent",
	tooltip: {
		trigger: "axis",
	},
	xAxis: [
		{
			type: "time",
			splitLine: { show: false },
		},
	],
	yAxis: [
		{
			splitLine: { show: false },
			name: "新增病例",
			axisLabel: {
				formatter: (value) => {
					if (value >= 10000) {
						return (value / 10000).toFixed(1) + "万"
					}
					if (value >= 1000) {
						return (value / 1000).toFixed(1) + "千"
					}
				},
			},
		},
		{
			splitLine: { show: false },
			name: "舆情数量",
			offset: -10,
			axisLabel: {
				formatter: (value) => {
					if (value >= 10000) {
						return (value / 10000).toFixed(1) + "万"
					}
					if (value >= 1000) {
						return (value / 1000).toFixed(1) + "千"
					}
				},
			},
		},
	],
	grid: [
		{
			top: 30,
			bottom: 20,
			left: 40,
		},
		{
			top: 30,
			bottom: 20,
		},
	],
	series: [
		{
			name: "新增病例",
			id: "new",
			type: "line",
			showSymbol: false,
			tooltip: {},
		},
		{
			name: "舆情数量",
			id: "opinion",
			type: "bar",
			showSymbol: false,
			xAxisIndex: 0,
			yAxisIndex: 1,
			tooltip: {
				formatter: "舆情数量: {b}",
			},
		},
	],
}

export default function Index() {
	const container = useRef(null)
	const chart = useRef(null)

	useEffect(() => {
		function initChart() {
			chart.current = echarts.init(container.current, "dark")
			chart.current.setOption(option)
		}

		function getData() {
			// proxyAxios('ProvinceData').then(res => {
			//     const newData = _.chain(res)
			//         .map(d => _.forEach(d, (d1, k, o) => {
			//                 o[k] = isNaN(+d1) ? d1 : Number(d1)
			//             })
			//         )
			//         .reduce((obj, d) => {
			//             const key = d.updateTime
			//             if (!obj[key]) {
			//                 obj[key] = {
			//                     data: [],
			//                     updateTime: d.updateTime,
			//                     timeStamp: moment(d.updateTime).valueOf(),
			//                 }
			//             }
			//             obj[key].data.push(d)
			//             return obj
			//         }, {})
			//         .values()
			//         .forEach((d, ind, arr) => {
			//             const { data } = d
			//             d.province_confirmedCount = _.sumBy(data, 'province_confirmedCount')
			//             d.province_curedCount = _.sumBy(data, 'province_curedCount')
			//             d.province_deadCount = _.sumBy(data, 'province_deadCount')
			//             d.province_suspectedCount = _.sumBy(data, 'province_suspectedCount')
			//             d.exist = d.province_confirmedCount
			//                 - d.province_curedCount - d.province_deadCount
			//             d.newCount = d.exist - (ind ? arr[ind - 1].exist : 0)
			//         })
			//         .orderBy('timeStamp')
			//         .map(d => [d.updateTime, d.newCount])
			//         .value()

			//         chart.current.setOption({
			//             series: {
			//                 id: 'new',
			//                 data: newData,
			//             }
			//         })
			// })
			axios("CountryDailyCount.json").then((res) => {
				chart.current.setOption({
					series: {
						id: "new",
						data: res.map((d) => [
							formatDate(d.updateTime),
							d.confirmedCount,
						]),
					},
				})
			})
			axios("CountTopicNum.json").then((res) => {
				const optionData = _.chain(res)
					.map((d) => {
						const date = moment(d.Date, "MM月DD")
						return {
							...d,
							updateTime: date.format("YYYY-MM-DD"),
							timeStamp: date.valueOf(),
						}
					})
					.orderBy("timeStamp")
					.map((d) => [d.updateTime, d["总计"]])
					.value()

				chart.current.setOption({
					series: {
						id: "opinion",
						data: optionData,
					},
				})
			})
		}
		initChart()
		getData()
	}, [])

	return (
		<Section title="每日新增与舆情数量">
			<div className="chart-container" ref={container} />
		</Section>
	)
}
