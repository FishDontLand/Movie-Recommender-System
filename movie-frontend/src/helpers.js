import { Tag } from "antd";

const isoStrToDatetime = (isoStr) =>{
    const dt = new Date(isoStr); 
    const options = {day:"2-digit", month:"2-digit", year:"numeric", hour:"numeric", minute:"2-digit"}
    return dt.toLocaleString(undefined, options); 
}

const strDatetimeToISOStr = (str) => {
    const dt = new Date(str);
    return dt.toISOString(); 
}
const formatUSD = (amount) => {
    // sample input amount 12.570805423341245
    return amount.toFixed(2) + " USD"
}

const removeUSD = ( amountStr ) => {
    return parseFloat(amountStr.split(" ")[0]);
}

const formatOrderStatus = (orderStatus)=>{
    let colorType = "geekblue";
    switch (orderStatus) {
        case "DEPARTED":
            colorType = "orange"
            break;
        case "PICKED":
            colorType = "yellow"
            break;
        case "DELIVERED":
            colorType = "green"
            break;
        default:
            break;
    }
   
        return (<Tag color={colorType} >
          {orderStatus}
        </Tag>);
    
}

const Helpers = {
    isoStrToDatetime,
    formatUSD,
    strDatetimeToISOStr,
    removeUSD,
    formatOrderStatus
};

export default Helpers; 