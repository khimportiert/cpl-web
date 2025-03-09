import React from 'react'

const formatTimeAgo = (timestamp) => {
    const now = new Date().valueOf()
    const ms = now - timestamp

    const s = Math.floor(ms/1000)
    const m = Math.floor(s/60)
    const h = Math.floor(m/60)
    const D = Math.floor(h/24)
    const M = Math.floor(D/31)
    const Y = Math.floor(M/12)

    if(Y !== 0) {
        return Y===1 ? `vor 1 Jahr` : `vor ${Y} Jahren`
    } else
    if(M !== 0) {
        return M===1 ? `vor 1 Monat` : `vor ${M} Monaten`
    } else
    if(D !== 0) {
        return D===1 ? `vor 1 Tag` : `vor ${D} Tagen`
    } else
    if(h !== 0) {
        return h===1 ? `vor 1 Stunde` : `vor ${h} Stunden`
    } else
    if(m !== 0) {
        return m===1 ? `vor 1 Minute` : `vor ${m} Minuten`
    } else {
        return "gerade eben"
    }

}

export default formatTimeAgo