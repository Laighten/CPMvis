import { observable, action, computed } from "mobx"
import moment from "moment"
import axios from "@/services"
import _ from "lodash"

class Store {
	@observable topic = ""

	@observable weiboContent = []

	@observable originData = {}

	@observable originAllData = []

	days =
		(moment("2020-4-1").valueOf() - moment("2020-1-9").valueOf()) /
		(3600 * 24 * 1000)

	@action initData = () => {
		const promiseArr = []
		for (let i = 0; i < this.days; i++) {
			;((i) => {
				const date = moment("2020/1/9")
					.add(i, "days")
					.format("YYYY-M-D")
				promiseArr.push(
					axios(`weibo_processed_json/${date}.csv`).then((res) => {
						this.originData[date] = res
					})
				)
			})(i)
		}
		Promise.all(promiseArr).then(() => {
			this.originAllData = _.chain(this.originData)
				.values()
				.flattenDeep()
				.value()
		})
	}

	@action updateContent = (topic) => {
		this.topic = topic
		this.weiboContent = _.chain(this.originData[this.currentDateFormat])
			.filter((d) => d.topic.includes(topic))
			.orderBy((d) => d.thubs + d.forward + d.comment, "desc")
			.slice(0, 5)
			// .head()
			// .map((d, k) => ({
			//     type: k,
			//     value: d,
			// }))
			.value()
	}

	@observable currentDate = moment("2020/1/9")

	@computed get currentDateFormat() {
		return this.currentDate.format("YYYY-M-D")
	}

	@action updateDate = (date) => {
		this.currentDate = date
		this.weiboContent = []
	}
}

export default new Store()
