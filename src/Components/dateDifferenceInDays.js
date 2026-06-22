import moment from "moment";
import I18n from 'react-native-i18n'
const dateDifferenceInDays = (date) => {
    const today = new Date().getTime();
    const old = new Date(date).getTime();
    return getTimes(today,old,date)
    // const diffTime = Math.abs(today - old);
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
    // return diffDays > 1 ? '' + diffDays + ' days ago' : '' + diffDays + ' day ago'
}


const getTimes = (news, created, createdDate) => {
    let time = Math.floor(new Date(news - created).getTime() / (1000))
    let seconds=Number(time)
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    
    var dDisplay = d > 0 ? d + (d == 1 ? " d" : " d") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " h" : " h") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " m" : " m") : I18n.t("Just now");
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "just now";
    if(dDisplay){
        if(d>365){
            // if(moment(createdDate).format('MMM')!==moment(new Date()).format('MMM')){
                return   moment(createdDate).format('DD MMM YYYY')
            // }
            // else{
            //     return   moment(createdDate).format('DD MMM')
            // }

        }
        else{
            if(d>6){
                return   moment(createdDate).format('DD MMM')
            }
            else{

                return dDisplay
            }
        }
    }
    else if(hDisplay){
        return hDisplay 
    }
    else if(mDisplay){
        return mDisplay
    }
    // else if(sDisplay){
    //     if(sDisplay=='just now'){
    //         return sDisplay
    //     }
    //     else{
    //         return sDisplay+' ago'
    //     }
        
    // }
}


export default dateDifferenceInDays;