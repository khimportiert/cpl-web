const formatDate = (timestamp) => {
    const givenDate = new Date(timestamp)
    const givenDay = givenDate.getDate()

    const newDate = new Date()
    const today = newDate.getDate()
    const tomorrow = newDate.getDate()+1
    const yesterday = newDate.getDate()-1

    const currentMonth = givenDate.getMonth() === newDate.getMonth() && givenDate.getFullYear() === newDate.getFullYear()
    
    let formattedDate = ""
    let options = {}

    if(currentMonth && givenDay === today) {
        options = {hour: 'numeric', minute: 'numeric'}
        formattedDate = "heute um " + new Date(timestamp).toLocaleString("de-DE", options)
    } 

    else if(currentMonth && givenDay === tomorrow) {
        options = {hour: 'numeric', minute: 'numeric'}
        formattedDate = "morgen um " + new Date(timestamp).toLocaleString("de-DE", options)
    } 

    else if(currentMonth && givenDay === yesterday) {
        options = {hour: 'numeric', minute: 'numeric'}
        formattedDate = "gestern um " + new Date(timestamp).toLocaleString("de-DE", options)
    } 

    else {
        // year: '2-digit'
        options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
        formattedDate = new Date(timestamp).toLocaleString("de-DE", options)
    }

    return formattedDate
}

export default formatDate