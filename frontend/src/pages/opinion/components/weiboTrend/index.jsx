import React, { useRef, useEffect } from 'react'
import echarts from 'echarts'
import Section from '@/components/section';
import { proxyAxios, axios } from '@/services';
import _ from 'lodash'
import moment from 'moment'
import { formatDate } from '@/utils';


const option = {
    backgroundColor: 'transparent',
    legend: {},
    tooltip: {
        trigger: 'axis',
    },
    xAxis: [{
        type: 'time',
        splitLine: {show: false},
    }],
    yAxis: [{
        splitLine: {show: false},
        name: '',
    }, {
        splitLine: {show: false},
        name: '',

    }],
    grid: [{
        top: 30,
        bottom: 20
    }, {
        top: 30,
        bottom: 20
    }],
    series: [{
        name: '',
        id: 'positive',
        type: 'bar',
        showSymbol: false,
    },
    {
        name: '',
        id: 'neural',
        type: 'bar',
        showSymbol: false,
    },
    {
        name: '',
        id: 'negative',
        type: 'bar',
        showSymbol: false,
    },
    {
        name: '',
        id: 'new',
        type: 'line',
        showSymbol: false,
        xAxisIndex: 0,
        yAxisIndex: 1,
        
    }]
};

export default function Index() {
    const container = useRef(null)
    const chart = useRef(null)
    
    useEffect(() => {
        function initData() {
            axios('EmotionNum.json').then(res => {
                function getEmotionData(type) {
                    return res.map(d => [formatDate(d.date), d[type]])
                }
                chart.current.setOption({
                    series: [{
                        id: 'positive',
                        data: getEmotionData('positiveNum'),
                    },{
                        id: 'neural',
                        data: getEmotionData('neuralNum'),
                    }, {
                        id: 'negative',
                        data: getEmotionData('negativeNum'),
                    }]
                })
            })

            axios('CountryDailyCount.json').then(res => {
                chart.current.setOption({
                    series: {
                        id: 'new',
                        data: res.map(d => [formatDate(d.updateTime), d.confirmedCount])
                    }
                })
            })
        }
        function initChart() {
            chart.current = echarts.init(container.current, 'dark');
            chart.current.setOption(option)
        }

        initChart()
        initData()
    }, [])

    return (
        <Section title="微博用户情感变化趋势">
            <div className="chart-container"
                ref={container}
            />
        </Section>
    )
}
