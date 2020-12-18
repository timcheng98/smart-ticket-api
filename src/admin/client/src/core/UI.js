import _ from 'lodash';
import moment from 'moment';

export const momentFormat = (unixTime, outputFormat = 'YYYY/MM/DD') => {
  if (unixTime === 0) {
    return '-'
  } 
  return moment.unix(unixTime).format(outputFormat);
}


export const displayStatus = (value) => {
  let displayStr = '';
  let statusValue = _.toInteger(value);
  switch (statusValue) {
    case 1:
      displayStr = "Activate";
      break;
    case 0:
      displayStr = "Disable";
      break;
    default:
      displayStr = "Error"
      break;
  }
  return displayStr;
}