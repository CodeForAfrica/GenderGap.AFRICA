import utils from "../utilities";
import CountUp from 'countup.js';

export default {
    initialize: (data, dataCurrencies, user) => {
        let isMobile = true;
        if(window.matchMedia("(min-width: 550px)").matches) {
            isMobile = false;
        }

        let countryTexts = document.querySelectorAll('.gap__country');
        for (let i = 0; i < countryTexts.length; i++) {
            countryTexts[i].innerHTML = user.country;
        }

        let currencyTexts = document.querySelectorAll('.gap__currency, .gap__currency-other');
        for (let i = 0; i < currencyTexts.length; i++) {
            currencyTexts[i].innerHTML = user.currency;
        }

        let genderTexts = document.querySelectorAll('.gap__gender');
        for (let i = 0; i < genderTexts.length; i++) {
            genderTexts[i].innerHTML = user.gender;
        }

        let manWomanTexts = document.querySelectorAll('.gap__man-woman');
        for (let i = 0; i < manWomanTexts.length; i++) {
            manWomanTexts[i].innerHTML = user.gender === 'male' ? 'man' : 'woman';
        }

        let manWomanOtherTexts = document.querySelectorAll('.gap__man-woman-other');
        for (let i = 0; i < manWomanOtherTexts.length; i++) {
            manWomanOtherTexts[i].innerHTML = user.gender === 'male' ? 'woman' : 'man';
        }

        let otherGenderTexts = document.querySelectorAll('.gap__gender-other');
        for (let i = 0; i < otherGenderTexts.length; i++) {
            otherGenderTexts[i].innerHTML = user.otherGender;
        }

        let country = data.find(d => d.COUNTRY === user.country);
        let currency = dataCurrencies.find(d => d["CURRENCY CODE"] === user.currency);
        let exchangeRate = currency["EXCHANGE RATE (USD)"];

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
        let moreLessOther = document.querySelector('.gap__more-less-other');

        if (user.gender === 'female') {
            if (averageSalary.annual.men > averageSalary.annual.women) {
                moreLess.innerHTML = 'more';
                moreLessOther.innerHTML = 'more';
            } else {
                moreLess.innerHTML = 'less';
                moreLessOther.innerHTML = 'less';
            }
        } else {
            if (averageSalary.annual.men > averageSalary.annual.women) {
                moreLess.innerHTML = 'more';
                moreLessOther.innerHTML = 'less';
            } else {
                moreLess.innerHTML = 'less';
                moreLessOther.innerHTML = 'more';
            }
        }
        
        let genderName = user.gender === 'male' ? 'man' : 'woman';
        document.querySelector('.gap__bar--you .gap__icon--' + genderName).classList.add('show');
        document.querySelector('.gap__bar--them .gap__icon--' + genderName).classList.add('hide');

        let baseSalary = user.salary;
        let ratioSalary;
        let countUp;
        let ratio = averageSalary.annual.women / averageSalary.annual.men;
        let amountTexts = document.querySelectorAll('.gap__amount');
        for (let i = 0; i < amountTexts.length; i++) {
            amountTexts[i].innerHTML = utils.numberWithCommas(baseSalary);
        }

        if (user.gender === 'male') {
            ratioSalary = baseSalary * ratio;
        } else {
            ratioSalary = baseSalary / ratio;
        }

        let amountOtherTexts = document.querySelectorAll('.gap__amount-other');
        for (let i = 0; i < amountOtherTexts.length; i++) {
            amountOtherTexts[i].innerHTML = utils.numberWithCommas(Math.round(Math.abs(ratioSalary - baseSalary)));
        }

        document.querySelector('.gap__bar--them .gap__bar-amount').innerHTML = utils.numberWithCommas(Math.round(ratioSalary));
        
        let setWidths = () => {
            document.querySelector('.gap__bar--you').addEventListener("transitionend", function(event) {
                checkWidths('you');
                document.querySelector('.gap__bar--them').addEventListener("transitionend", function(event) {
                    checkWidths('them');
                }, {once: true});
                setTimeout(function() {
                    document.querySelector('.gap__you').addEventListener('transitionend', function(event) {
                        document.querySelector('.gap__them').style.opacity = 1;    
                    }, {once: true});
                    document.querySelector('.gap__you').style.opacity = 0
                    document.querySelector('.gap__bar--them').style.width = baseSalary > ratioSalary ? ratioSalary / baseSalary * 100 + '%' : '100%';
                }, 1000);
            }, {once: true});
            document.querySelector('.gap__bar--you').style.width = baseSalary > ratioSalary ? '100%' : baseSalary / ratioSalary * 100 + '%';
        }

        let setHeights = () => {
            document.querySelector('.gap__bar--you').style.height = '0%';
            document.querySelector('.gap__bar--you').addEventListener("transitionend", function(event) {
                checkHeights('you');
                document.querySelector('.gap__bar--them').addEventListener("transitionend", function(event) {
                    checkHeights('them');
                }, {once: true});
                setTimeout(function() {
                    document.querySelector('.gap__you').addEventListener('transitionend', function(event) {
                        document.querySelector('.gap__them').style.opacity = 1;    
                    }, {once: true});
                    document.querySelector('.gap__you').style.opacity = 0
                    document.querySelector('.gap__bar--them').style.height = baseSalary > ratioSalary ? ratioSalary / baseSalary * 100 + '%' : '100%';
                }, 1000);
            }, {once: true});
            setTimeout(function() {
                document.querySelector('.gap__bar--you').style.height = baseSalary > ratioSalary ? '100%' : baseSalary / ratioSalary * 100 + '%';
            }, 50);
        }

        if (window.matchMedia("(min-width: 550px)").matches) {
            setWidths();
        } else {
            setHeights();
        }
        // if (user.gender === 'male') {
        //     document.querySelector("#count-up-two").innerHTML = utils.numberWithCommas(Math.round(baseSalary));
        //     ratioSalary = baseSalary * ratio;
        //     countUp = new CountUp("count-up-one", Math.round(baseSalary), Math.round(ratioSalary), 0, 2, {useEasing: false});
            
        // } else {
        //     document.querySelector("#count-up-one").innerHTML = utils.numberWithCommas(Math.round(baseSalary));
        //     ratioSalary = baseSalary / ratio;
        //     countUp = new CountUp("count-up-two", Math.round(baseSalary), Math.round(ratioSalary), 0, 2, {useEasing: false});
        // }

        let checkHeights = (identity) => {
            let salaryClasses = document.querySelector('.gap__bar--' + identity + ' .gap__bar-salary').classList;
            if (document.querySelector('.gap__bar--' + identity).clientHeight < 75) {
                salaryClasses.add('move');
            } else {
                salaryClasses.remove('move');
            }
            salaryClasses.add('show');
        }

        let checkWidths = (identity) => {
            let salaryClasses = document.querySelector('.gap__bar--' + identity + ' .gap__bar-salary').classList;
            if (document.querySelector('.gap__bar--' + identity).clientWidth < 
                document.querySelector('.gap__bar--' + identity + ' .gap__icon--man').clientWidth + document.querySelector('.gap__bar--' + identity + ' .gap__icon--woman').clientWidth + document.querySelector('.gap__bar--' + identity + ' .gap__bar-text').clientWidth + document.querySelector('.gap__bar--' + identity + ' .gap__bar-salary').clientWidth) {
                salaryClasses.add('move');
            } else {
                salaryClasses.remove('move');
            }
            salaryClasses.add('show');
        }

        let resize = () => {
            if(window.matchMedia("(min-width: 550px)").matches) {
                if (isMobile) {
                    document.querySelector('.gap__bar--them').removeAttribute('style');
                    document.querySelector('.gap__bar--you').removeAttribute('style');
                    isMobile = false;
                }
            } else {
                if (!isMobile) {
                    document.querySelector('.gap__bar--them').removeAttribute('style');
                    document.querySelector('.gap__bar--you').removeAttribute('style');
                    isMobile = true;
                }
            }
            
            if (isMobile) {    
                setHeights();
            } else {
                setWidths();
            }
        };

        utils.throttle('resize', 'resize.global');
        window.addEventListener('resize.global', () => {
            resize();
        });

        let percentage = utils.numberWithCommas(Math.round((averageSalary.monthly.men - averageSalary.monthly.women) / averageSalary.monthly.women * 100));
        document.querySelector('.gap__percent').innerHTML = percentage;

        // countUp.start();
        // countUpThree.start();
    }
};
