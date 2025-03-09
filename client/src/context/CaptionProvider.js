import React, { createContext, useState } from 'react'

const CaptionContext = createContext({})

export const CaptionProvider = ({ children }) => {
    const [caption, setCaption] = useState('Überschrift');
    const [href, setHref] = useState()

    return (
        <CaptionContext.Provider value={{ caption, setCaption, href, setHref }}>
            {children}
        </CaptionContext.Provider>
    )
}

export default CaptionContext