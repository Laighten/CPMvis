import React, { useRef, useEffect } from "react"
import echarts from "echarts"
import "echarts-wordcloud"
import Section from "@/components/section"
import { reaction } from "mobx"
import store from "../../store"
import axios from "@/services"

const option = {
	series: {
		name: "热点分析",
		type: "wordCloud",
		//size: ['9%', '99%'],
		sizeRange: [6, 66],
		//textRotation: [0, 45, 90, -45],
		rotationRange: [-45, 90],
		//shape: 'circle',
		textPadding: 0,
		autoSize: {
			enable: true,
			minSize: 6,
		},
		textStyle: {
			normal: {
				color: function () {
					return (
						"rgb(" +
						[
							Math.round(Math.random() * 160),
							Math.round(Math.random() * 160),
							Math.round(Math.random() * 160),
						].join(",") +
						")"
					)
				},
			},
			emphasis: {
				shadowBlur: 10,
				shadowColor: "#333",
			},
		},
	},
}

export default function WordCloud() {
	const container = useRef(null)
	const chart = useRef(null)

	useEffect(() => {
		function getSeries(date) {
			axios(`weibo_wordcloud_json/${date}.json`).then((res) => {
				chart.current.setOption(
					{
						...option,
						series: {
							...option.series,
							data: res.data,
						},
					},
					true
				)
			})
		}
		const dispose = reaction(
			() => store.currentDateFormat,
			(date) => {
                getSeries(date)
            }
		)
		chart.current = echarts.init(container.current)
        getSeries(store.currentDateFormat)
		return dispose
	}, [])
	return (
		<Section title="微博词云">
			<div className="chart-container" ref={container} />
		</Section>
	)
}
