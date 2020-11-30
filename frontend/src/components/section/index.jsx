import React from 'react'
import { BorderBox12 } from '@jiaminghi/data-view-react'
import style from './index.less'

export default function Section({children, title, extra}) {
    return (
        <BorderBox12 className="border-padding-1 ">
            <div className={style.section}>
                <header className="section-header">
                    <div className="section-header-container">
                        <div className="header-title">{title}</div>
                        <div>{extra}</div>
                    </div>
                    {/* <Decoration10 className="section-header-dect" /> */}
                </header>
                <div className="section-container">
                    {children}
                </div>
            </div>
        </BorderBox12>
    )
}