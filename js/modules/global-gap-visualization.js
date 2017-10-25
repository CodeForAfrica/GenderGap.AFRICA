import utils from "../utilities";
import CountUp from 'countup.js';
import Velocity from 'velocity-animate';

export default {
    initialize: (data, user) => {
        let orderedData = [];

        let countryTexts = document.querySelectorAll('.global__user-country');
        for (let i = 0; i < countryTexts.length; i++) {
            countryTexts[i].innerHTML = user.country;
        }

        let difference = document.querySelector('.global__user-difference');

        for (let i = 0; i < data.length; i++) {
            let female = data[i]['AVERAGE ANNUAL SALARY (WOMEN)'] / 12;
            let male = data[i]['AVERAGE ANNUAL SALARY (MEN)'] / 12;
            let gap = Math.round(male - female);
            orderedData[i] = {
                country: data[i]['COUNTRY'],
                female: Math.round(female),
                male: Math.round(male),
                gap: gap
            }

            if (data[i]['COUNTRY'] === user.country) {
                difference.innerHTML = gap;
            }
        }

        orderedData.sort((a, b) => a.gap >= b.gap ? 1 : -1)
        let list = document.createElement('ol');
        list.className = 'global__list';
        for (let j = 0; j < orderedData.length; j++) {
            if (orderedData[j].country === user.country && orderedData.length !== j + 1) {
                if (j === 0) {
                    document.querySelector('.global__superlative').innerHTML = 'smallest'
                } else {
                    document.querySelector('.global__rank').innerHTML = utils.getRank(orderedData.length - j);    
                }
                
            }
            const listItem = document.createElement('li');
            listItem.className = user.country === orderedData[j].country ? 'global__country--active' : 'global__country';
            listItem.setAttribute('id', 'global-country-' + j);
            const country = document.createElement('span');
            country.className = 'global__country-name';
            const countryText = document.createTextNode(orderedData[j].country);
            const female = document.createElement('span');
            female.className = 'global__female';
            const femaleText = document.createTextNode(utils.numberWithCommas(orderedData[j].female));
            const gap = document.createElement('span');
            gap.className = 'global__gap';
            gap.setAttribute('id', 'gap-' + j);
            // gap.setAttribute('style', 'width:' + orderedData[j].gap * 2 / 3 + 'px');
            const male = document.createElement('span');
            male.className = 'global__male';
            male.setAttribute('id', 'count-up-' + j);
            const maleText = document.createTextNode(utils.numberWithCommas(orderedData[j].female));
            country.append(countryText);
            female.append(femaleText);
            male.append(maleText);
            listItem.append(country);
            listItem.append(female);
            listItem.append(gap);
            listItem.append(male);
            list.append(listItem);
        }

        document.querySelector('.global__countries').append(list);

        let gapRatio = 1 / 4;
        let windowWidth = window.innerWidth;
        let maxWidthOuter = Math.min(windowWidth * 0.9, 960) - 109;
        let maxWidthInner = Math.min(windowWidth * 0.9, 960) - 154;

        if (window.matchMedia("(min-width: 680px)").matches) {
            gapRatio = 3 / 5;
            maxWidthOuter = Math.min(windowWidth * 0.9, 960) - 160;
            maxWidthInner = Math.min(windowWidth * 0.9, 960) - 217;
        }

        for (let k = 0; k < orderedData.length; k++ ){ 
            let timeRatio = orderedData[k].gap / orderedData[orderedData.length - 1].gap;
            let count = new CountUp("count-up-" + k, Math.round(orderedData[k].female), Math.round(orderedData[k].male), 0.5, 5 * timeRatio, {useEasing: false});
            let width = orderedData[k].gap * gapRatio;
            if (width > maxWidthInner) {
                if (width > maxWidthOuter) {
                    let newWidth = maxWidthInner + 50 + windowWidth * 0.05;
                    timeRatio = newWidth / width;
                    width = newWidth;
                    document.querySelector('#global-country-' + k).classList.add('global__country--truncated');
                }
                document.querySelector('#global-country-' + k).classList.add('global__country--long');
            } 
            Velocity(document.getElementById("gap-" + k), { width: width + 'px'}, { duration: 5000 * timeRatio, delay: 500, complete: (element) => element[0].classList.add('global__gap--complete') });
            count.start();
        }

        let resize = () => {
            let gapRatio = 1 / 4;
            let windowWidth = window.innerWidth;
            let maxWidthOuter = Math.min(windowWidth * 0.9, 960) - 109;
            let maxWidthInner = Math.min(windowWidth * 0.9, 960) - 154;

            if (window.matchMedia("(min-width: 680px)").matches) {
                gapRatio = 3 / 5;
                maxWidthOuter = Math.min(windowWidth * 0.9, 960) - 160;
                maxWidthInner = Math.min(windowWidth * 0.9, 960) - 217;
            }

            for (let k = 0; k < orderedData.length; k++ ){ 
                let country = document.querySelector('#global-country-' + k);
                country.classList.remove('global__country--long')
                country.classList.remove('global__country--truncated');
                let width = orderedData[k].gap * gapRatio;
                if (width > maxWidthInner) {
                    if (width > maxWidthOuter) {
                        let newWidth = maxWidthInner + 50 + windowWidth * 0.05;
                        width = newWidth;
                        country.classList.add('global__country--truncated');
                    }
                    country.classList.add('global__country--long');
                } 
                let gap = document.getElementById("gap-" + k);
                gap.setAttribute('style', 'width: ' + width + 'px');
                gap.classList.add('global__gap--complete');
            }
        }

        utils.throttle('resize', 'resize.global');
        window.addEventListener('resize.global', () => {
            resize();
        });
    }
};
