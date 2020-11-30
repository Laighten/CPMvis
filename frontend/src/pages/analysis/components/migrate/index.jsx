import React, { useRef, useEffect, useState } from "react"
import "echarts/map/js/china"
import { DatePicker, Select } from "antd"
import style from "./index.less"
import moment from "moment"
import Sankey from "../sankey"
import LineArea from "../line-area"
import myContext from "../../../../assets/js/createContext"
import Section from "@/components/section"
const provinceName = [
	"北京市",
	"天津市",
	"河北省",
	"山西省",
	"内蒙古自治区",
	"辽宁省",
	"吉林省",
	"黑龙江省",
	"上海市",
	"江苏省",
	"浙江省",
	"安徽省",
	"福建省",
	"江西省",
	"山东省",
	"河南省",
	"湖南省",
	"广东省",
	"广西自治区",
	"海南省",
	"重庆市",
	"四川省",
	"贵州省",
	"云南省",
	"西藏自治区",
	"陕西省",
	"甘肃省",
	"青海省",
	"宁夏自治区",
	"新疆自治区",
	"台湾省",
	"香港特别行政区",
	"澳门特别行政区",
]

export default function Radar() {
	const [currentProvince, setCurrentProvince] = useState("北京市") //当前省份
	const selectProvinceOptions = provinceName.map((d) => ({
		label: d,
		value: d,
	}))
	function handleChangeProvince(d) {
		setCurrentProvince(d)
	}

	const [currentType, setCurrentType] = useState("迁入") //当前类型
	const selectTypeOptions = [
		{ lable: "迁入", value: "迁入" },
		{ lable: "迁出", value: "迁出" },
	]
	function handleChangeType(d) {
		setCurrentType(d)
	}

	const [currentDate, setCurrentDate] = useState("20200228") //当前日期
	function onDateChange(date, dateString) {
		setCurrentDate(dateString)
	}

	function disabledDate(current) {
		return (
			current < moment(new Date("2020/01/01")) ||
			current > moment(new Date("2020/03/15"))
		)
	}

	const selectAll = {
		curProvince: currentProvince,
		curType: currentType,
		curDate: currentDate,
	}
	return (
		<Section
			title="迁移分析"
			extra={
				<div className={style["switch-btn"]}>
					<Select
						className="select"
						value={currentProvince}
						options={selectProvinceOptions}
						dropdownStyle={{ height: "200px" }}
						onChange={handleChangeProvince}
					/>
					<Select
						className="select"
						value={currentType}
						options={selectTypeOptions}
						onChange={handleChangeType}
					/>
					<DatePicker
						defaultValue={moment(currentDate, "YYYYMMDD")}
						format={"YYYYMMDD"}
						disabledDate={disabledDate}
						onChange={onDateChange}
					/>
				</div>
			}
		>
			<div className={style["migrate"]}>
                <div className="sankey">
				<myContext.Provider value={selectAll}>
					<Sankey />
				</myContext.Provider>
                </div>
                <div className="linearea">
				<myContext.Provider value={selectAll}>
					<LineArea />
				</myContext.Provider>
                </div>
			</div>
		</Section>
	)
}
