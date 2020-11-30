import React, { useEffect } from "react"
import NetworkChart from "./components/3d"
import store from "./store"
import Content from "./components/info"
import style from "./index.less"
import WordCloud from "./components/wordCloud"
import { DatePicker } from "antd"
import { observer } from "mobx-react"
import moment from "moment"

export default observer(function Index() {
	useEffect(() => {
		store.initData()
	}, [])

	return (
		<div className={style["network"]}>
			<div className="network-info">
				<div className="network-info-container">
					<div className="network-info-weibo">
						<Content />
					</div>
					<div className="wordCloud">
						<WordCloud />
					</div>
				</div>
			</div>
			<div className="network-chart">
				<NetworkChart />
			</div>
		</div>
	)
})
