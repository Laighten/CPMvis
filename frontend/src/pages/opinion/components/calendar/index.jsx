import React, { useRef, useEffect } from "react"
import echarts from "echarts"
import moment from "moment"
import _ from "lodash"
import axios from "@/services"
import { extent } from "d3"
import { formatDate } from "@/utils"

const cellSize = [30, 30]
const pieRadius = cellSize[0] / 2

function getPieSeries(data, chart) {
	const series = data.map(function (item, index) {
		const center = chart.convertToPixel({ seriesId: "label" }, item.date)
		return {
            name: item.date,
			id: index + "pie",
			type: "pie",
			center,
			label: {
				normal: {
					formatter: "{c}",
					position: "inside",
					fontSize: 8,
				},
			},
			radius: pieRadius,
			data: [
				..._.map(item.data, (d, k) => ({
					name: k,
					value: d,
				})),
			],
			tooltip: { show: true },
		}
	})
	return series
}

const option = {
	backgroundColor: "transparent",
	title: {
		show: false,
    },
    tooltip: {},
	calendar: {
		top: 25,
		left: "30",
		right: "5%",
		orient: "vertical",
		cellSize,
		range: "2020/01",
		itemStyle: {
			borderColor: "#fff",
			borderWidth: 1,
			color: "transparent",
		},
		splitLine: {
			show: false,
		},
		yearLabel: { show: false },
		dayLabel: {
			nameMap: "cn",
			color: "#aaa",
			position: "end",
		},
		monthLabel: {
			nameMap: "cn",
			color: "#aaa",
		},
	},
	series: [
		{
			id: "label",
			type: "scatter",
			coordinateSystem: "calendar",
			symbolSize: 1,
			label: {
				normal: {
					show: false,
					formatter: function (params) {
						return echarts.format.formatTime("dd", params.value[0])
					},
					offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
					textStyle: {
						color: "#000",
						fontSize: 14,
					},
				},
			},
			z: 0,
		},
	],
}

export default function Index() {
	const chart = useRef()
	const container = useRef(null)

	useEffect(() => {
		function initData() {
			axios("谣言.json").then((res) => {
				const data = _.chain(res)
					.reduce((obj, d) => {
						const key = d.data
						if (!obj[key]) {
							obj[key] = {
								timeStamp: moment(key).valueOf(),
								date: key,
								data: [],
							}
						}
						obj[key].data.push(d.category)
						return obj
					}, {})
					.values()
					.orderBy("timeStamp")
					.map((d) => ({
						timeStamp: d.timeStamp,
						date: formatDate(d.date),
						data: _.countBy(d.data),
					}))
					.value()

				const categorys = _.chain(res).map("category").uniq().value()

				const dateRagnge = extent(data, (d) => d.timeStamp).map((d) =>
					moment(d).format("YYYY-MM-DD")
				)

				const scatterData = data.map((d) => [d.date, 1])

				chart.current.setOption({
					calendar: {
						range: dateRagnge,
					},
				})

				chart.current.setOption({
					legend: {
						data: categorys,
					},
					series: [
						{
							id: "label",
							data: scatterData,
						},
						...getPieSeries(data, chart.current, categorys),
					],
				})
			})
		}

		chart.current = echarts.init(container.current, "dark")
		chart.current.setOption(option)
		initData()
	}, [])
	return <div ref={container} className="chart-container" />
}
