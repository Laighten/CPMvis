import React, { useRef, useEffect, useState } from "react"
import * as d3 from "d3"
import moment from "moment"
import _ from "lodash"
import axios from "@/services"
import Section from "@/components/section"

const colorBar = d3.scaleOrdinal(d3.schemeAccent)

export default function BarChart() {
	const container = useRef(null)
	const svgcRef = useRef(null)
	const svg = useRef(null)
	const layout = useRef({})
	const originData = useRef({})
	const currentData = useRef([])
	const dateData = useRef([])
	const methods = useRef({})

	const [activeType, setActiveType] = useState(["positive"])

	const [theDate, setTheDate] = useState(moment('2020/2/25').format('YYYY-MM-DD'))

	useEffect(() => {
		function updateBarData(date) {
			console.log(date)

			currentData.current = _.chain(originData.current[date] || [])
				.map((d) => ({
					date: moment(d.date, "YYYY-MM-DD HH:mm")
						.startOf("hour")
						.valueOf(),
					emotion: d.emotion,
				}))
				.reduce((obj, d) => {
					const key = d.date
					if (!obj[key]) {
						obj[key] = []
					}
					obj[key].push(d)
					return obj
				}, {})
				.forEach((d, k, obj) => {
					obj[k] = { ..._.countBy(d, "emotion"), date: k }
				})
				.values()
				.orderBy("date")
				.value()
			console.log(currentData.current)
		}
		function initData() {
			const promiseArr = []
			const days =
				(moment("2020-4-1").valueOf() - moment("2020-1-9").valueOf()) /
				(3600 * 1000 * 24)

			dateData.current = []
			for (let i = 0; i < days; i++) {
				const date = moment("2020-1-9")
					.add(i, "day")
					.format("YYYY-MM-DD")
				dateData.current.push(date)
				promiseArr.push(
					axios(`emotion/${date}.json`).then((res) => {
						originData.current[date] = res.map((d) => ({
							...d,
							date: `${d.datetime} ${d.time}`,
						}))
					})
				)
			}
			Promise.all(promiseArr).then(() => {
				axios("EmotionNum.json").then((res) => {
					// currentData.current = res.map((d) => ({
					// 	date: d.date,
					// 	positive: +d.positiveNum,
					// 	negative: +d.negativeNum,
					// 	neural: +d.neuralNum,
					// }))
					const pieData = _.chain(res)
						.map("date")
						.orderBy((d) => moment(d).valueOf())
						.value()

					initChart()
				})
			})
		}

		function initChart() {
			const { clientWidth, clientHeight } = container.current
			const width = d3.min([clientWidth, clientHeight])
			const radius = width / 2
			const barRadius = [radius - radius * 0.7, radius]
			const dateRadius = [radius / 8, barRadius[0]]
			const monthRadius = [0, dateRadius[0]]
			layout.current = {
				width,
				barRadius,
				dateRadius,
				monthRadius,
			}

			d3.select(svgcRef.current).select("g").remove()
			svg.current = d3
				.select(svgcRef.current)
				.attr("width", width)
				.attr("height", width)
				.attr("viewBox", `0 0 ${width} ${width}`)
				.append("g")
				.attr("transform", `translate(${width / 2}, ${width / 2})`)

			updateBarData(theDate)

			const month = moment(theDate).month() + 1

			drawMonth()
			drawPie(month)
			updateBar()
		}

		function updateBar() {
			svg.current.selectAll("g.arcBar").remove()
			;["positive", "neural", "negative"].forEach((d) => {
				drawBar(d)
			})
		}

		function drawMonth() {
			const monthData = _.chain(dateData.current)
				.map((d) => moment(d).month() + 1)
				.uniq()
				.value()

			const pie = d3
				.pie()
				.padAngle(() => 0.02)
				.value(() => 1)

			const arcsData = pie(monthData)

			const { monthRadius } = layout.current
			const arc = d3
				.arc()
				.outerRadius(() => monthRadius[1])
				.innerRadius(() => monthRadius[0])
				.cornerRadius(() => 5)

			const arcG = svg.current
				.append("g")
				.classed("monthG", true)
				.selectAll("g.arcG")
				.data(arcsData)
				.enter()
				.append("g")
				.classed("arcDate", true)
				.on("click", (d) => {
					const { data: month } = d
					drawPie(month)
				})
				.attr("cursor", "pointer")

			arcG.append("path").attr("d", arc).attr("fill", "#ffaa00")
		}

		function drawPie(month) {
			const startDate = moment(`2020/${month}/1`)
			const endDate = moment(startDate).add(1, "month")
			const data = _.chain(dateData.current)
				.filter(
					(d) =>
						moment(d).unix() >= startDate.unix() &&
						moment(d).unix() < endDate.unix()
				)
				.value()
			const pie = d3
				.pie()
				.padAngle(() => 0.01)
				.value(() => 1)

			const arcsData = pie(data)

			const { dateRadius } = layout.current
			const arc = d3
				.arc()
				.outerRadius(() => dateRadius[1])
				.innerRadius(() => dateRadius[0])
				.cornerRadius(() => 5)

			svg.current.selectAll("g.pieDate").remove()

			const arcG = svg.current
				.append("g")
				.classed("pieDate", true)
				.selectAll("g.arcDate")
				.data(arcsData)
				.enter()
				.append("g")
				.classed("arcDate", true)
				.on("click", (d) => {
					const { data } = d
					const date = moment(data).format("YYYY-MM-DD")
					setTheDate(date)
					// updateBarData(date)
					// updateBar()
				})
				.attr("cursor", "pointer")

			arcG.append("path").attr("d", arc).attr("fill", "#202f5e")
		}

		function drawBar(sortKey) {
			const { barRadius } = layout.current
			const { current: data } = currentData

			const extent = d3.extent(data, (d) => +d[sortKey])
			const scale = d3.scaleLinear().domain(extent).range(barRadius)

			const pie = d3
				.pie()
				.padAngle(() => 0.01)
				.value(() => 1)

			const arcsData = pie(data)

			const arc = d3
				.arc()
				.outerRadius((d) => scale(+d.data[sortKey]))
				.innerRadius(() => barRadius[0])
				.cornerRadius(() => 2)

			const arcG = svg.current
				.append("g")
				.classed("arcBar", true)
				.classed(`bar-${sortKey}`, true)
				.attr("display", () =>
					activeType.includes(sortKey) ? null : "none"
				)
				.selectAll("g.arcG")
				.data(arcsData)
				.enter()
				.append("g")
				.classed("arcG", true)

			arcG.append("path")
				.attr("d", arc)
				.attr("fill", () => colorBar(sortKey))
				.attr("opacity", 0.5)
				.transition()
				.duration(400)
				.ease(d3.easeCubicOut)
				.attrTween("d", (d) => {
					const i = d3.interpolateObject(
						{
							...d,
							endAngle: d.startAngle,
							data: {
								...d.data,
								[sortKey]: 0,
							},
						},
						d
					)
					return (t) => arc(i(t))
				})
		}
		methods.current.updateBar = updateBar
		initData()
	}, [activeType, theDate])

	const handleClick = (type) => {
		let activeArr = []
		if (!activeType.includes(type)) {
			activeArr = [...activeType, type]
		} else {
			activeArr = activeType.filter((d) => d !== type)
		}
		setActiveType(activeArr)
		// setTimeout(() => {
		// 	methods.current.updateBar()
		// }, 200)
		// svg.current.selectAll("g.arcBar").attr("display", "none")
		// activeArr.forEach((d) => {
		// 	svg.current.select(`.bar-${d}`).attr("display", null)
		// })
	}
	return (
		<Section title="情感分析">
			<div
				className="chart-container barChart"
				ref={container}
				style={{ textAlign: "center" }}
			>
				<svg ref={svgcRef} />
				<div className="chart-legend">
					{[
						{
							type: "positive",
							name: "积极",
						},
						{
							type: "neural",
							name: "中立",
						},
						{
							type: "negative",
							name: "消极",
						},
					].map((item) => (
						<div
							key={item.type}
							className={`legend-item ${
								activeType.includes(item.type) ? "" : "inactive"
							}`}
							onClick={() => handleClick(item.type)}
						>
							<span
								className="legend"
								style={{ backgroundColor: colorBar(item.type) }}
							></span>
							<span className="legend-label">{item.name}</span>
						</div>
					))}
				</div>
				<div className="chart-title">
					{theDate}
				</div>
			</div>
		</Section>
	)
}
