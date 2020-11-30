import React, { useRef, useEffect } from 'react'
import echarts from 'echarts'
import { BorderBox9 } from '@jiaminghi/data-view-react'
import Section from '@/components/section'

const option = {
    radar: {
        indicator: [
            {name: '类别1', max: 300},
            {name: '类别2', max: 250},
            {name: '类别3', max: 300},
            
        ],
        shape: 'circle',
        splitNumber: 5,
        name: {
            textStyle: {
            }
        },
        splitArea: {
            show: false
        },
        axisLine: {
            lineStyle: {
            }
        }
    },
    series: {
        name: '北京',
        type: 'radar',
        lineStyle: {
            normal: {
                width: 1,
                opacity: 0.5
            }
        },
        data: [],
        symbol: 'none',
        itemStyle: {
            color: '#F9713C'
        },
        areaStyle: {
            opacity: 0.1
        }
    },
}

export default function Radar() {
    const container = useRef(null)
    const chart = useRef(null)
    
    useEffect(() => {
        chart.current = echarts.init(container.current);
        chart.current.setOption(option)
        return () => {
        }
    }, [])
    return (
        <Section title="舆论列表">
            <div className="chart-container"
                ref={container}
            />
        </Section>
    )
}
