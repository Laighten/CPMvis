import React, { useState, useEffect } from 'react'
import { getFomatTime } from '@/utils';
import style from './index.less'

export default function Clock() {
    const [time, setTime] = useState(getFomatTime());
    useEffect(() => {
        function update() {
            requestAnimationFrame(update);
            setTime(getFomatTime())
        }
        update();
    }, [])
    return (
        <div className={style.clock}>{time}</div>
    )
}
