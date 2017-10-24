import utils from "../utilities";
import CountUp from 'countup.js';

export default {
    initialize: (data, dataCurrencies, user) => {
        let countryTexts = document.querySelectorAll('.gap__country');
        for (let i = 0; i < countryTexts.length; i++) {
            countryTexts[i].innerHTML = user.country;
        }

        let currencyTexts = document.querySelectorAll('.gap__currency');
        for (let i = 0; i < currencyTexts.length; i++) {
            currencyTexts[i].innerHTML = user.currency;
        }

        let country = data.find(d => d.COUNTRY === user.country)
        let currency = dataCurrencies.find(d => d["CURRENCY CODE"] === user.currency)
        let exchangeRate = currency["EXCHANGE RATE (USD)"]

        let averageSalary = {
          annual: {
            men: country["AVERAGE ANNUAL SALARY (MEN)"] * exchangeRate,
            women: country["AVERAGE ANNUAL SALARY (WOMEN)"] * exchangeRate
          },
          monthly: {}
        };

        averageSalary.monthly.men = averageSalary.annual.men / 12;
        averageSalary.monthly.women = averageSalary.annual.women / 12;
        
        let moreLess = document.querySelector('.gap__more-less');
        if (averageSalary.annual.men > averageSalary.annual.women) {
            moreLess.innerHTML = 'more';
        } else {
            moreLess.innerHTML = 'less';
        }

        let baseSalary = user.salary;
        let ratioSalary;
        let countUp;
        let ratio = averageSalary.annual.women / averageSalary.annual.men;
        if (user.gender === 'male') {
            document.querySelector("#count-up-two").innerHTML = utils.numberWithCommas(Math.round(baseSalary));
            ratioSalary = baseSalary * ratio;
            countUp = new CountUp("count-up-one", Math.round(baseSalary), Math.round(ratioSalary), 0, 2, {useEasing: false});
            
        } else {
            document.querySelector("#count-up-one").innerHTML = utils.numberWithCommas(Math.round(baseSalary));
            ratioSalary = baseSalary / ratio;
            countUp = new CountUp("count-up-two", Math.round(baseSalary), Math.round(ratioSalary), 0, 2, {useEasing: false});
        }

        let percentage = utils.numberWithCommas(Math.round((averageSalary.monthly.men - averageSalary.monthly.women) / averageSalary.monthly.women * 100));
        let countUpThree = new CountUp("count-up-three", 0, percentage, 0, 2, {useEasing: false});

        countUp.start();
        countUpThree.start();

        let difference = document.querySelector('.gap__difference');
        difference.innerHTML = utils.numberWithCommas(Math.round(averageSalary.monthly.men - averageSalary.monthly.women));        
    }
};
