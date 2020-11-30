import React, { useRef, useEffect, useState } from "react"
import echarts from "echarts"
import "echarts/map/js/china"
import { DatePicker, Select } from "antd"
import style from "./index.less"
import moment from "moment"
import axios from "@/services"
import Section from "@/components/section"

export default function Radar() {
	const [currentDate, setCurrentDate] = useState("2020-02-01") //当前日期
	function onDateChange(date, dateString) {
		setCurrentDate(dateString)
	}

	//获取的数据
	let comfiredData = []
	let migrateData = []

	//需要用的数据
	let provinceName = []
	let comfiredValue = []
	let migrateValue = []

	const container = useRef(null)
	const chart = useRef(null)

	useEffect(() => {
		axios("ComfiredCompare.json")
			.then(
				(res) => {
					comfiredData = res.filter(
						(item) => item.updateTime === currentDate
					)
				},
				[currentDate]
			)
			.then(
				axios("Migrate.json").then(
					(data) => {
						migrateData = data.filter(
							(item) => item.updateTime === currentDate
						)
					},
					[currentDate]
				)
			)

		setTimeout(() => {
			if (comfiredData.length && migrateData.length) {
				comfiredData.forEach((com) => {
					const obj = migrateData.find(
						(mig) => mig.provinceName === com.provinceName
					)
					if (obj) {
						provinceName.push(com.provinceName)
						comfiredValue.push(Number(com.ComfiredRatio))
						migrateValue.push(Number(obj.Ratio))
					}
				})
			}
			const option = {
				title: {
					show: false,
					text: "迁入规模与确诊对比图",
					textStyle: {
						color: "#fff",
					},
				},
				tooltip: {
					trigger: "axis",
				},
				legend: {
					data: ["迁入比例", "确诊比例"],
					textStyle: {
						color: "#fff",
					},
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
					data: provinceName,
					axisLabel: {
						color: "#fff",
					},
					axisLine: {
						lineStyle: {
							color: "#fff",
						},
					},
					axisTick: {
						inside: true,
					},
				},
				yAxis: {
					type: "value",
					axisLabel: {
						show: false,
					},
					axisLine: {
						lineStyle: {
							color: "#fff",
						},
					},
					axisTick: {
						show: false,
					},
					splitLine: { show: false },
				},
				series: [
					{
						name: "迁入比例",
						type: "line",
						stack: "比率",
						data: migrateValue,
					},
					{
						name: "确诊比例",
						type: "line",
						stack: "比率",
						data: comfiredValue,
					},
				],
			} //图标数据

			chart.current = echarts.init(container.current)
			chart.current.setOption(option)
			return () => {}
		}, 1000)
	})

	function disabledDate(current) {
		return (
			current < moment(new Date("2020/01/23")) ||
			current > moment(new Date("2020/04/30"))
		)
	}

	return (
		<Section
			title="迁入规模与确诊对比图"
			extra={
				<div style={{ textAlign: "right" }}>
					<DatePicker
						defaultValue={moment(currentDate, "YYYY-MM-DD")}
						format={"YYYY-MM-DD"}
						disabledDate={disabledDate}
						onChange={onDateChange}
					/>
				</div>
			}
		>
			<div className="chart-container" ref={container} />
		</Section>
	)
}
