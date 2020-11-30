import React from 'react'
import Table from './components/table'
import NewNCount from './components/newNCount'
import Rumors from './components/rumors'
import Calendar from './components/calendar'
import style from './index.less'
import Section from '@/components/section'
import BarChart from './components/barChart'

export default function Opinion() {
    return (
        <div className={style.opinion}>
            <div className="opinion-left">
                <div className="opinionChart">
                    <NewNCount />
                </div>
                <div className="hotTopic">
                    <Table />
                </div>
            </div>
            <div className="opinion-center">
                <div className="main-chart">
                    <BarChart />
                </div>
                <div className="analys-table">
                    <Rumors />
                </div>
            </div>
            <div className="opinion-right">
                <div className="calendar">
                <Section title="每日谣言热点分布">
                    <Calendar />
                </Section>
                </div>
            </div>
        </div>
    )
}
