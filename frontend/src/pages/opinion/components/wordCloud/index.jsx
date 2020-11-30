import React, { useRef, useEffect } from 'react'
import echarts from 'echarts'
import 'echarts-wordcloud'
import Section from '@/components/section';

const option = {
    series: {
        name: '热点分析',
        type: 'wordCloud',
        //size: ['9%', '99%'],
        sizeRange: [6, 66],
        //textRotation: [0, 45, 90, -45],
        rotationRange: [-45, 90],
        //shape: 'circle',
        textPadding: 0,
        autoSize: {
            enable: true,
            minSize: 6
        },
        textStyle: {
            normal: {
                color: function() {
                    return 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')';
                }
            },
            emphasis: {
                shadowBlur: 10,
                shadowColor: '#333'
            }
        },
        data: [{
            name: "Jayfee",
            value: 666
        }, {
            name: "Nancy",
            value: 520
        }]
    }
}

export default function WordCloud() {
    const container = useRef(null)
    const chart = useRef(null)
    
    useEffect(() => {
        chart.current = echarts.init(container.current);
        chart.current.setOption(option)
        return () => {
        }
    }, [])
    return (
        <Section title="谣言词云">
            <div className="chart-container"
                ref={container}
            />
        </Section>
    )
}
