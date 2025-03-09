const formatWithReturn = (with_return) => {
    if(with_return==="true")
        return "Hin- und Rückfahrt"
    else
        return "nur Hinfahrt"
}

export default formatWithReturn