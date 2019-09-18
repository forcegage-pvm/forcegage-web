import _ from 'lodash';

export function getTableStyle() {
  return {
    style: {
      textAlign: 'center',
      border: 'none',
      borderRadius: '0px',
      fontWeight: '400',
      padding: '0px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  };
}

export function getHeaderStyle() {
  return {
    style: {
      // backgroundColor: '#F5F5F5',
      color: '#004C72',
      fontWeight: '500',
      textAlign: 'center',
      verticalAlign: 'middle',
      boxShadow: 'inset 0 0 0 0 transparent',
      fontSize: '0.98em',
      fontWeight: '400',
      padding: '0px',
      paddingBottom: '0px',
      border: 'none',
      height: '30px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  };
}

export function getHeaderFilterStyle() {
  return {
    style: {
      backgroundColor: 'white',
      color: '#004C72',
      fontWeight: '500',
      textAlign: 'center',
      verticalAlign: 'middle',
      border: 'none',
      fontSize: '0.98em',
      fontWeight: '400',
      padding: '3px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  };
}

export function getHeaderGroupStyle() {
  return {
    style: {
      backgroundColor: '#E6F4FE',
      color: '#1A4463',
      fontWeight: '600',
      textAlign: 'center',
      verticalAlign: 'middle',
      border: 'none',
      fontSize: '0.98em',
      padding: '0px',
      paddingBottom: '0px',
      height: '30px',
      width: '60px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  };
}

export function getRowStyle(state, rowInfo, column, instance) {
  return {
    style: {
      backgroundColor: 'white',
      borderBottom: '0',
      padding: '0px',
      color: '#8E92A0',
      fontWeight: '500'
    }
  };
}

export function getGroupRowStyle() {
  return {
    style: {
      backgroundColor: 'red',
      borderBottom: '0',
      border: 'none',
      padding: '0px',
      fontWeight: '600',
      color: 'green'
    }
  };
}

export function getRowDataStyle(state, rowInfo, column, instance) {
  if (rowInfo !== undefined) {
    if (rowInfo.level === 1) {
      return {
        style: {
          backgroundColor: '#EEF8F9',
          // backgroundColor: '#86230B',
          // color: "#86230B",
          borderTop: 'solid 0.1em #C6E2E5',
          alignContent: 'center',
          verticalAlign: 'middle',
          padding: '1px',
          paddingTop: '5px',
          height: '31px',
          fontWeight: '400'
        }
      };
    }
    if (rowInfo.level === 2) {
      return {
        style: {
          backgroundColor: 'white',
          borderBottom: 'solid 0.0em #E0ECFA',
          padding: '0px',
          margin: '0px',
          height: '23px',
          fontWeight: '300'
        }
      };
    }
  } else {
    return {
      style: {
        backgroundColor: 'white',
        // color: "#003871",
        borderBottom: 'solid 0.0em #EEF1F8',
        // fontSize: "0.97em",
        padding: '1px',
        margin: '0px',
        height: '23px'
        // fontWeight: "300"
      }
    };
  }
  return {
    style: {
      backgroundColor: 'white',
      color: '#405399',
      borderBottom: 'solid 0.0em #EEF1F8',
      alignContent: 'center',
      verticalAlign: 'middle',
      padding: '1px',
      paddingTop: '10px',
      height: '40px',
      fontWeight: '500'
    }
  };
}

export function getUniqArrayStr(array, rows) {
  var result = '';
  var splitArray = [];
  _.uniq(array).forEach(a => {
    if (typeof a === 'string' || a instanceof String) {
      var arr = a.split(',');
      arr = arr.map(a => (a = a.trim()));
      if (arr.length > 1) {
        arr.forEach(a => splitArray.push(String(a)));
      } else {
        splitArray.push(String(a));
      }
    } else {
      splitArray.push(String(a));
    }
  });
  _.uniq(splitArray).forEach((v, index) => {
    if (index === 0) {
      result = v;
    } else {
      result = result + ', ' + v;
    }
  });
  return result;
}
