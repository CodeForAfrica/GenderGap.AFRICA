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
            let female = data[i]['AVERAGE ANNUAL SALARY (WOMEN)'] / (data[i]['EXCHANGE RATE (USD)'] * 12);
            let male = data[i]['AVERAGE ANNUAL SALARY (MEN)'] / (data[i]['EXCHANGE RATE (USD)'] * 12);
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
            if (orderedData[j].country === user.country) {
                document.querySelector('.global__rank').innerHTML = utils.getRank(j + 1);
            }
            const listItem = document.createElement('li');
            listItem.className = user.country === orderedData[j].country ? 'global__country--active' : 'global__country';
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

        for (let k = 0; k < orderedData.length; k++ ){ 
            let timeRatio = orderedData[k].gap / orderedData[orderedData.length - 1].gap;
            Velocity(document.getElementById("gap-" + k), { width: orderedData[k].gap * 2 / 3 + 'px'}, { duration: 8000 * timeRatio, delay: 500 });
            let count = new CountUp("count-up-" + k, Math.round(orderedData[k].female), Math.round(orderedData[k].male), 0.5, 8 * timeRatio, {useEasing: false});
            count.start();
        }
    }
};
