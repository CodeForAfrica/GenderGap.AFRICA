// Reference: https://stackoverflow.com/a/4467559/1300992
let mod = (n, m) => ((n % m) + m) % m;

// Reference: https://stackoverflow.com/a/13146828/1300992
let getDaysInMonth = (month, year) => {
  let date = new Date(year, month, 1);
  let days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

let getWorkDaysInMonth = (month, year) => {
  let daysInMonth = getDaysInMonth(month, year);
  let workDaysInMonth = daysInMonth.filter((day) => day.getDay() >= 1 && day.getDay() <= 5);
  return workDaysInMonth;
};

let getNumberOfWorkDaysInMonth = (month, year) => {
  let workDaysInMonth = getWorkDaysInMonth(month, year);
  let numberOfWorkDaysInMonth = workDaysInMonth.length;
  return numberOfWorkDaysInMonth;
};

// Reference: https://stackoverflow.com/a/15289883/1300992
// a and b are javascript Date objects
let dateDiffInHours = (a, b) => {
  const MS_PER_HOUR = 1000 * 60 * 60;

  // Discard the time and time-zone information.
  let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours());
  let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours());

  return Math.floor((utc2 - utc1) / MS_PER_HOUR);
};

// Reference: https://codepen.io/NV/pen/jcnmK
let angleToPoints = (angle) => {
  let segment = Math.floor(angle / Math.PI * 2) + 2;
  let diagonal = (1/2 * segment + 1/4) * Math.PI;
  let op = Math.cos(Math.abs(diagonal - angle)) * Math.sqrt(2);
  let x = op * Math.cos(angle);
  let y = op * Math.sin(angle);

  return {
    x1: x < 0 ? 1 : 0,
    y1: y < 0 ? 1 : 0,
    x2: x >= 0 ? x : x + 1,
    y2: y >= 0 ? y : y + 1
  };
};

let formatDate = (date) => {
    return (mod(date.getHours(), 12) === 0 ? 12 : mod(date.getHours(), 12))  + ":" + pad(date.getMinutes()) + " " + ((date.getHours() < 12) ? "AM" : "PM");
};

let pad = value => (value < 10) ? "0" + value : value;

let degreesToRadians = degrees => degrees / 180 * Math.PI;

let numberWithCommas = (x) => {
    let parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
}

let getRank = (i) => {
  let j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

let throttle = (type, name, obj = window) => {
  let running = false

  let func = () => {
    if (running) {
      return
    }

    running = true

    requestAnimationFrame(() => {
      obj.dispatchEvent(new CustomEvent(name))
      running = false
    })
  }

  obj.addEventListener(type, func)
}

let getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let currentYPosition = () => {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}


let elmYPosition = (eID) => {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop - 30;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } return y;
}


let smoothScroll = (eID) => {
    var startY = currentYPosition();
    var stopY = elmYPosition(eID);
    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
        scrollTo(0, stopY); return;
    }
    var speed = Math.round(distance / 200);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 100);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for ( var i=startY; i<stopY; i+=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
    }
    for ( var i=startY; i>stopY; i-=step ) {
        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
    }
}


// Check if in iFrame
// https://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
let inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}


export default {
  mod: mod,

  COLORS: Object.freeze({
    green: "#54b242",
    red: "#c0392b"
  }),

  MONTHS: ["January", "February", "March", "April", "May", "June", "July",
           "August", "September", "October", "November", "December"],

  getDaysInMonth: getDaysInMonth,

  getWorkDaysInMonth: getWorkDaysInMonth,

  getNumberOfWorkDaysInMonth: getNumberOfWorkDaysInMonth,

  dateDiffInHours: dateDiffInHours,

  angleToPoints: angleToPoints,

  formatDate, formatDate,

  pad: pad,

  degreesToRadians: degreesToRadians,

  numberWithCommas: numberWithCommas,

  getRank: getRank,

  throttle: throttle,

  getParameterByName: getParameterByName,

  smoothScroll: smoothScroll,

  inIframe: inIframe
};
