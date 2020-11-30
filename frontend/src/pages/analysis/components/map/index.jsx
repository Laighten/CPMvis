import React, { useRef, useEffect, useState } from "react"
import echarts from "echarts"
import "echarts/map/js/china"

import { BorderBox7 } from "@jiaminghi/data-view-react"
import style from "./index.less"
import { DatePicker } from "antd"
import moment from "moment"
import axios from "@/services"
import Section from "@/components/section"
import Modal from "./modal"

const compare = (property) => {
	return (a, b) => {
		return b[property] - a[property]
	}
}

export default function Radar() {
	const [currentLevel, setCurrentLevel] = useState("province") //当前层级

	const [currentDate, setCurrentDate] = useState("2020-01-30") //当前日期
	function onDateChange(date, dateString) {
		setCurrentDate(dateString)
	}

	const [currentBtn, setCurrentBtn] = useState("confirmed") //当前类型
	const selectBtn = (type) => {
		setCurrentBtn(type)
	}

	const [currentMap, setCurrentMap] = useState("china") //当前地图

	const [visible, setVisible] = useState(false)

	const container = useRef(null)
	const chart = useRef(null)
	useEffect(() => {
		const title =
			currentLevel === "province"
				? `ProvinceDataDaily.json`
				: "CityDataDaily.json"
		axios("ProvinceDataDaily.json").then(
			(res) => {
				let data = [] //热力图数据
				if (true) {
					res.map((item) => {
						if (item.updateTime === currentDate) {
							let obj = {}
							if (currentBtn === "confirmed") {
								obj.name = item.provinceName
								obj.value = Number(item.province_confirmedCount)
							}
							if (currentBtn === "suspected") {
								obj.name = item.provinceName
								obj.value = Number(item.province_suspectedCount)
							}
							if (currentBtn === "cured") {
								obj.name = item.provinceName
								obj.value = Number(item.province_curedCount)
							}
							if (currentBtn === "dead") {
								obj.name = item.provinceName
								obj.value = Number(item.province_deadCount)
							}
							data.push(obj)
						}
					})
				} else {
					const arr = res.filter(
						(item) =>
							item.provinceName.indexOf(currentMap) !== -1 &&
							item.updateTime === currentDate
					)
					arr.map((item) => {
						let obj = {}
						if (currentBtn === "confirmed") {
							obj.name = item.cityName
							obj.value = Number(item.city_confirmedCount)
						}
						if (currentBtn === "suspected") {
							obj.name = item.cityName
							obj.value = Number(item.city_suspectedCount)
						}
						if (currentBtn === "cured") {
							obj.name = item.cityName
							obj.value = Number(item.city_curedCount)
						}
						if (currentBtn === "dead") {
							obj.name = item.cityName
							obj.value = Number(item.city_deadCount)
						}
						data.push(obj)
					})
				}
				let option = {}
				if (data.length) {
					data = data.sort(compare("value"))
					const yData = [] //排行榜名称
					const barData = [] //排行榜数据
					for (let i = 0; i < 5; i++) {
						barData.push(data[i])
						yData.push(i + data[i].name)
					}

					option = {
						title: [
							{
								show: true,
								text: "排名情况",
								textStyle: {
									color: "#fff",
									fontSize: 18,
								},
								right: 180,
								top: 30,
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
							// orient: "horizontal",
							// itemWidth: 10,
							// itemHeight: 80,
							// text: ["高", "低"],
							showLabel: true,
							seriesIndex: 0,
							// min: 0,
							// max: barData[0].value,
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
							align: "right",
							bottom: 5,
							// left: "right"
							left: "45%",
						},
						grid: {
							right: 10,
							top: 70,
							bottom: 100,
							width: "20%",
						},
						xAxis: {
							show: false,
						},
						yAxis: {
							type: "category",
							inverse: true,
							nameGap: 16,
							axisLine: {
								show: false,
								lineStyle: {
									color: "#ddd",
								},
							},
							axisTick: {
								show: false,
								lineStyle: {
									color: "#ddd",
								},
							},
							axisLabel: {
								interval: 0,
								margin: 85,
								textStyle: {
									color: "#455A74",
									align: "left",
									fontSize: 14,
								},
								rich: {
									a: {
										color: "#fff",
										backgroundColor: "#FAAA39",
										width: 20,
										height: 20,
										align: "center",
										borderRadius: 2,
									},
									b: {
										color: "#fff",
										backgroundColor: "#4197FD",
										width: 20,
										height: 20,
										align: "center",
										borderRadius: 2,
									},
								},
								formatter: function (params) {
									if (parseInt(params.slice(0, 1)) < 3) {
										return [
											"{a|" +
												(parseInt(params.slice(0, 1)) +
													1) +
												"}" +
												"  " +
												params.slice(1),
										].join("\n")
									} else {
										return [
											"{b|" +
												(parseInt(params.slice(0, 1)) +
													1) +
												"}" +
												"  " +
												params.slice(1),
										].join("\n")
									}
								},
							},
							data: yData,
						},
						geo: {
							// roam: true,
							map: "china",
							left: "left",
							right: "300",
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
						series: [
							{
								name: "mapSer",
								type: "map",
								roam: false,
								geoIndex: 0,
								label: {
									show: false,
								},
								data: data,
							},
							{
								name: "barSer",
								type: "bar",
								roam: false,
								visualMap: false,
								zlevel: 2,
								barMaxWidth: 8,
								barGap: 0,
								itemStyle: {
									normal: {
										color: function (params) {
											// build a color map as your need.
											var colorList = [
												{
													colorStops: [
														{
															offset: 0,
															color: "#FFD119", // 0% 处的颜色
														},
														{
															offset: 1,
															color: "#FFAC4C", // 100% 处的颜色
														},
													],
												},
												{
													colorStops: [
														{
															offset: 0,
															color: "#00C0FA", // 0% 处的颜色
														},
														{
															offset: 1,
															color: "#2F95FA", // 100% 处的颜色
														},
													],
												},
											]
											if (params.dataIndex < 3) {
												return colorList[0]
											} else {
												return colorList[1]
											}
										},
										barBorderRadius: 15,
									},
								},
								data: barData,
							},
						],
					} //图标数据
				} else {
					return
				}

				chart.current = echarts.init(container.current)
				chart.current.setOption(option)

				chart.current.on("click", (e) => {
					if (currentLevel === "province") {
						setCurrentMap(e.name)
						setCurrentLevel("city")
						setVisible(true)
					}
				})

				return () => {}
			},
			[currentBtn, currentDate]
		)
	})

	function disabledDate(current) {
		return (
			current < moment(new Date("2020/01/24")) ||
			current > moment(new Date("2020/05/24"))
		)
	}

	function changeLevel(type) {
		setCurrentMap(type)
		setCurrentLevel("province")
	}

	return (
		<Section
			title="疫情地图"
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
			<div className={style["map"]}>
				<div className="switch-btn">
					<span onClick={() => selectBtn("confirmed")}>
						<BorderBox7
							className={
								currentBtn === "confirmed"
									? "activeBtn btn"
									: "btn"
							}
						>
							新增确诊
						</BorderBox7>
					</span>
					<span onClick={() => selectBtn("suspected")}>
						<BorderBox7
							className={
								currentBtn === "suspected"
									? "activeBtn btn"
									: "btn"
							}
						>
							新增疑似
						</BorderBox7>
					</span>
					<span onClick={() => selectBtn("cured")}>
						<BorderBox7
							className={
								currentBtn === "cured" ? "activeBtn btn" : "btn"
							}
						>
							新增治愈
						</BorderBox7>
					</span>
					<span onClick={() => selectBtn("dead")}>
						<BorderBox7
							className={
								currentBtn === "dead" ? "activeBtn btn" : "btn"
							}
						>
							新增死亡
						</BorderBox7>
					</span>
					<span onClick={() => changeLevel("china")}>
						<BorderBox7 className="btn">全国</BorderBox7>
					</span>
				</div>

				<div className="chart-container" ref={container} />
			</div>
			<Modal
				visible={visible}
				setVisible={setVisible}
				provice={currentMap}
				currentDate={currentDate}
				type={currentBtn}
			/>
		</Section>
	)
}
