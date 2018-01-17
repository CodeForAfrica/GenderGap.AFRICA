import utils from "../utilities";
import CountUp from 'countup.js';

var canvas = document.getElementById('localCanvas');

export default {
    initialize: (data, dataCurrencies, user) => {
        let isMobile = true;

        if(window.matchMedia("(min-width: 550px)").matches) {
            isMobile = false;
        }

        var context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, 1200, 630);

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
        let canvasMoreLess = 'more';
        let canvasMoreLessOther = 'more';
        if (user.gender === 'female') {
            if (averageSalary.annual.men > averageSalary.annual.women) {
                moreLess.innerHTML = 'more';
                moreLessOther.innerHTML = 'more';
            } else {
                moreLess.innerHTML = 'less';
                moreLessOther.innerHTML = 'less';
                canvasMoreLessOther = 'less';
                canvasMoreLess = 'less';
            }
        } else {
            if (averageSalary.annual.men > averageSalary.annual.women) {
                moreLess.innerHTML = 'more';
                moreLessOther.innerHTML = 'less';
                canvasMoreLessOther = 'less';
            } else {
                moreLess.innerHTML = 'less';
                moreLessOther.innerHTML = 'more';
                canvasMoreLess = 'less';
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

        context.font = "30px proxima-nova";
        context.textAlign = 'center';
        context.fillStyle = '#282828';
        var headerText = user.gender === 'male' ? 'If you were a woman' : 'If you were a man' + ' you\'d earn ';

        let amountOtherTexts = document.querySelectorAll('.gap__amount-other');
        let differenceAmount = utils.numberWithCommas(Math.round(Math.abs(ratioSalary - baseSalary)));
        for (let i = 0; i < amountOtherTexts.length; i++) {
            amountOtherTexts[i].innerHTML = differenceAmount;
        }
        headerText += differenceAmount + ' ' + user.currency + ' ' + canvasMoreLessOther + ' per month';
        context.fillText(headerText, 600, 80);

        context.fillStyle = '#c0392b';
        var youRectWidth = baseSalary > ratioSalary ? '1000' : baseSalary / ratioSalary * 1000;
        context.fillRect(100, 200, youRectWidth, 100);

        context.fillStyle = '#282828';
        var themRectWidth = baseSalary > ratioSalary ? ratioSalary / baseSalary * 1000 : 1000;
        context.fillRect(100, 340, themRectWidth, 100);

        let percentage = utils.numberWithCommas(Math.round((averageSalary.monthly.men - averageSalary.monthly.women) / averageSalary.monthly.women * 100));
        document.querySelector('.gap__percent').innerHTML = percentage;

        context.font = "30px proxima-nova";
        context.textAlign = 'center';
        context.fillStyle = '#282828';
        var footerText = 'In ' + user.country + ' a man earns on average ' + percentage + '% ' + canvasMoreLess + ' than a woman.' 
        context.fillText(footerText, 600, 570);

        var woman = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88.5 127.35"><defs><style>.cls-1{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-miterlimit:10;stroke-width:5px;}</style></defs><title>Asset 1</title><g id="Layer_2" data-name="Layer 2"><g id="Design"><circle class="cls-1" cx="44.25" cy="44.25" r="41.75"/><line class="cls-1" x1="44.25" y1="86" x2="44.25" y2="124.85"/><line class="cls-1" x1="32.61" y1="112.34" x2="56.01" y2="112.34"/></g></g></svg>';
        var man = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.79 101.79"><defs><style>.cls-1{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-miterlimit:10;stroke-width:5px;}</style></defs><title>Asset 2</title><g id="Layer_2" data-name="Layer 2"><g id="Design"><circle class="cls-1" cx="44.25" cy="57.54" r="41.75" transform="translate(-27.73 48.14) rotate(-45)"/><line class="cls-1" x1="98.83" y1="2.96" x2="73.77" y2="28.02"/><path class="cls-1" d="M95.68,16.9"/><polyline class="cls-1" points="97.68 14.51 98.96 2.83 87.28 4.11"/></g></g></svg>';
        var DOMURL = window.URL || window.webkitURL || window;

        var imgWoman = new Image();
        var imgMan = new Image();
        var svgWoman = new Blob([woman], {type: 'image/svg+xml'});
        var svgMan = new Blob([man], {type: 'image/svg+xml'});
        var urlWoman = DOMURL.createObjectURL(svgWoman);
        var urlMan = DOMURL.createObjectURL(svgMan);

        imgWoman.onload = function() {
          let y = user.gender === 'female' ? 230 : 370;
          context.drawImage(imgWoman, 130, y, 28, 40);
          DOMURL.revokeObjectURL(urlWoman);
        }

        imgMan.onload = function() {
          let y = user.gender === 'male' ? 234 : 374;
          context.drawImage(imgMan, 130, y, 32, 32);
          DOMURL.revokeObjectURL(urlMan);
        }

        imgWoman.src = urlWoman;
        imgMan.src = urlMan;

        context.font = "20px proxima-nova";
        context.textAlign = 'start';
        context.fillStyle = 'white';
        var yourBarText = 'YOUR SALARY';
        var youAmountText = utils.numberWithCommas(Math.round(baseSalary)) + ' ' + user.currency;
        var yourBarTextEnd = context.measureText(yourBarText).width + 85
        if (yourBarTextEnd < youRectWidth - 20) {
            context.fillText(yourBarText, 185, 260);
            context.font = "60px proxima-nova";
            if (yourBarTextEnd + 40 + context.measureText(youAmountText).width < youRectWidth - 20) {
                context.textAlign = 'end';
                context.fillText(youAmountText, youRectWidth + 70, 270);
            } else {
                context.fillStyle = "#282828";
                context.fillText(youAmountText, youRectWidth + 140, 270);
            }
        } else {
            context.fillStyle = '#282828';
            context.fillText(yourBarText, youRectWidth + 130, 260);
            context.font = "60px proxima-nova";
            context.fillText(youAmountText, youRectWidth + yourBarTextEnd + 80, 270);
        }

        context.font = "20px proxima-nova";
        context.textAlign = 'start';
        context.fillStyle = 'white';        
        var otherBarText = user.gender === 'male' ? 'FEMALE SALARY ESTIMATE' : 'MALE SALARY ESTIMATE';
        var themAmountText = utils.numberWithCommas(Math.round(ratioSalary)) + ' ' + user.currency;
        var themBarTextEnd = context.measureText(otherBarText).width + 85
        if (themBarTextEnd < themRectWidth - 20) {
            context.fillText(otherBarText, 185, 400); 
            context.font = "60px proxima-nova";
            if (themBarTextEnd + 40 + context.measureText(themAmountText).width < themRectWidth - 20) {
                context.textAlign = 'end';
                context.fillText(themAmountText, themRectWidth + 70, 410);
            } else {
                context.fillStyle = "#282828";
                context.fillText(themAmountText, themRectWidth + 140, 410);
            }  
        } else {
            context.fillStyle = '#282828';
            context.fillText(otherBarText, themRectWidth + 130, 400);  
            context.font = "60px proxima-nova";
            context.fillText(themAmountText, themRectWidth + themBarTextEnd + 80, 410); 
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
                }, 2000);
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
                }, 2000);
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

        // countUp.start();
        // countUpThree.start();
    },

    getImage: (data, dataCurrencies, user) => {

        var dataURL = canvas.toDataURL('image/jpeg', 1.0);

        return dataURL;
    }
};
