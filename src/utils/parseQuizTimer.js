export default function parseTime(time) {
    let strTime = time.toString();       
    
    if (strTime.includes('.5')) {
        return `${strTime[0]}:30`;
    } else {
        return strTime;
    }
}