import * as d3 from "d3";
import MobileDetect from "mobile-detect";
import 'url-search-params-polyfill';

import utils from "./utilities";
import socialMedia from "./modules/social-media";
import calendarGapVisualization from "./modules/calendar-gap-visualization";
import yourGapVisualization from "./modules/your-gap-visualization";
import clockGapVisualization from "./modules/clock-gap-visualization";


// From https://github.com/jonathantneal/closest/blob/master/element-closest.js
(function (ElementProto) {
  if (typeof ElementProto.matches !== 'function') {
    ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
      var element = this;
      var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
      var index = 0;

      while (elements[index] && elements[index] !== element) {
        ++index;
      }

      return Boolean(elements[index]);
    };
  }

  if (typeof ElementProto.closest !== 'function') {
    ElementProto.closest = function closest(selector) {
      var element = this;

      while (element && element.nodeType === 1) {
        if (element.matches(selector)) {
          return element;
        }

        element = element.parentNode;
      }

      return null;
    };
  }
})(window.Element.prototype);

document.addEventListener("DOMContentLoaded", () => {

  /************************************************************************************************
   * Identify whether the user's device is a touch device.
   * Reference: http://stackoverflow.com/a/19715406/1300992
   ************************************************************************************************/

  let isTouch = !!("ontouchstart" in window) || window.navigator.msMaxTouchPoints > 0;
  document.documentElement.classList.add((isTouch) ? "touch" : "no-touch");

  /************************************************************************************************
   * Identify whether the user's device is a mobile device.
   ************************************************************************************************/

  let md = new MobileDetect(window.navigator.userAgent);
  if (md.mobile()) {
    document.documentElement.classList.add("is-mobile");
  }

  /************************************************************************************************
   * All sections
   ************************************************************************************************/

  let sections = {
    homepage:       document.querySelector(".section--homepage"),
    form:           document.querySelector(".section--form"),
    visualizations: document.querySelector(".section--visualizations")
  };

  let goToNextSection = (nextSection) => {
    document.querySelector(".section--active").classList.remove("section--active");
    nextSection.classList.add("section--active");
  };

  fetch("data/data.csv")
    .then(response => response.text())
    .then((text) => {

      // Convert CSV data to JSON.
      let data = d3.csvParse(text);

      data.forEach((d) => {
        d["AVERAGE ANNUAL SALARY (MEN)"]   = +d["AVERAGE ANNUAL SALARY (MEN)"];
        d["AVERAGE ANNUAL SALARY (WOMEN)"] = +d["AVERAGE ANNUAL SALARY (WOMEN)"];
        d["EXCHANGE RATE (USD)"]           = +d["EXCHANGE RATE (USD)"];
      });

      createFormPage(data);

      document.querySelector("#homepage-button").addEventListener("click", () => {
        goToNextSection(sections.form);
      });

      document.querySelector("#form-button").addEventListener("click", () => {
        let user = {};

        user.gender = fields.gender.options[fields.gender.selectedIndex].value;
        if (user.gender === "my gender") {
          alert("Please enter gender");
          return;
        }

        user.country = fields.country.value;
        if (user.country === "my country") {
          alert("Please enter country");
          return;
        }

        user.salary = +fields.salary.value;
        if (user.salary === "") {
          alert("Please enter salary");
          return;
        }

        user.currency = fields.currency.value;
        if (user.currency === "currency") {
          alert("Please enter currency");
          return;
        }

        goToNextSection(sections.visualizations);

        calendarGapVisualization.initialize(data, user);
        clockGapVisualization.initialize(data, user);
        yourGapVisualization.initialize(data, user);
      });
    })
    .catch(err => console.error(err));

  /************************************************************************************************
   * Homepage
   ************************************************************************************************/

  /************************************************************************************************
   * Form page
   ************************************************************************************************/

  let fields = {
    gender:     document.querySelector("#field-gender"),
    country:    document.querySelector("#field-country"),
    salary:     document.querySelector("#field-salary"),
    currency:   document.querySelector("#field-currency")
  };

  let overlay = document.querySelector(".overlay"),
      showOverlay = () => { overlay.classList.add("overlay--open"); },
      hideOverlay = () => { overlay.classList.remove("overlay--open"); };

  let openFieldModal = (field) => {
    field.classList.add("field--open");
    showOverlay();
  };

  let closeFieldModal = () => {
    let openField = document.querySelector(".field--open");
    openField.classList.remove("field--open");
    hideOverlay();
  };

  overlay.addEventListener("click", closeFieldModal);

  let createCustomDropdown = (selectElement) => {
    let field = {};

    field.field = document.createElement("div");
    field.field.className = "field field--dropdown";

    field.toggle = document.createElement("a");
    field.toggle.className = "field__toggle";
    field.toggle.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;

    field.modal = document.createElement("ul");
    field.modal.className = "field__modal field--dropdown__list";

    let html = "";
    selectElement.querySelectorAll("option").forEach((option, i) => {
      html += selectElement.selectedIndex === i ? "<li class='field--dropdown__list-item field--dropdown__list-item--checked'>" +
               option.innerHTML + "</li>" : "<li class='field--dropdown__list-item'>" +
               option.innerHTML + "</li>";
    });

    field.modal.innerHTML = html;

    field.field.appendChild(field.toggle);
    field.field.appendChild(field.modal);

    selectElement.parentNode.insertBefore(field.field, selectElement);
    selectElement.style.display = "none";

    let toggleField = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      openFieldModal(field.field);
    };
    field.toggle.addEventListener("click", toggleField);
    field.toggle.addEventListener("touchstart", toggleField);

    let selectListItem = (e, selectedListItem) => {
        e.preventDefault();

        let index = 0, node = null;

        // Deselect previously selected list item.
        let deselectedListItem = field.modal.querySelector(".field--dropdown__list-item--checked");
        index = 0;
        node = deselectedListItem;
        for (index = 0; (node = node.previousSibling); index++);
        deselectedListItem.classList.remove("field--dropdown__list-item--checked");
        selectElement.options[index].removeAttribute("selected");

        // Select new list item.
        index = 0;
        node = selectedListItem;
        for (index = 0; (node = node.previousSibling); index++);
        selectedListItem.classList.add("field--dropdown__list-item--checked");
        selectElement.options[index].setAttribute("selected", "selected");
        field.toggle.innerHTML = selectedListItem.innerHTML;

        if (document.querySelector(".field--open") !== null) {
          closeFieldModal();
        }
    };

    let listItems = field.modal.querySelectorAll(".field--dropdown__list-item");
    [...listItems].forEach((listItem) => {
      listItem.addEventListener("click",      (e) => { selectListItem(e, listItem); });
      listItem.addEventListener("touchstart", (e) => { selectListItem(e, listItem); });
    });
  };

  let createCustomInput = (inputElement) => {
    let field = {};

    field.field = document.createElement("div");
    field.field.className = "field field--text";

    field.toggle = document.createElement("a");
    field.toggle.innerHTML = inputElement.placeholder;
    field.toggle.className = "field__toggle";

    field.modal = document.createElement("ul");
    field.modal.className = "field__modal";

    field.input = document.createElement("input");
    field.input.setAttribute("type", inputElement.getAttribute("type"));
    field.input.placeholder = inputElement.placeholder;
    field.input.className = "field--text__input";

    field.inputWrapper = document.createElement("li");
    field.inputWrapper.className = "field--text__input-wrapper";

    field.go = document.createElement("button");
    field.go.className = "field--text__go";
    field.go.innerHTML = "<img alt='' src='images/icons/arrow.svg'>";

    field.inputWrapper.appendChild(field.input);
    field.inputWrapper.appendChild(field.go);

    field.example = document.createElement("li");
    field.example.className = "field--text__example";
    field.example.innerHTML = inputElement.getAttribute("data-subline");

    field.modal.appendChild(field.inputWrapper);
    field.modal.appendChild(field.example);

    field.field.appendChild(field.toggle);
    field.field.appendChild(field.modal);

    inputElement.parentNode.insertBefore(field.field, inputElement);
    inputElement.style.display = "none";

    let toggleField = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      openFieldModal(field.field);
      field.input.focus();
    };
    field.toggle.addEventListener("click", toggleField);
    field.toggle.addEventListener("touchstart", toggleField);

    let submit = (ev) => {
      ev.preventDefault();

      field.input.blur();
      field.toggle.innerHTML = field.input.value.trim() !== "" ? field.input.value : field.input.placeholder;
      inputElement.value = field.toggle.innerHTML;

      closeFieldModal();
    };
    field.inputWrapper.addEventListener("keydown", (ev) => {
      if (ev.keyCode === 13) {
        submit(ev);
      }
    });
    field.go.addEventListener("click", submit);
    field.go.addEventListener("touchstart", submit);
  };

  let createFormPage = (data) => {
    // Populate dropdown with countries listed in the data file.
    let countries = data.map(d => d.COUNTRY);
    for (let i = 0; i < countries.length; i++) {
      fields.country.insertAdjacentHTML("beforeend", "<option>" + countries[i] + "</option>");
    }

    // Populate dropdown with currencies listed in the data file.
    let currencies = data.map(d => d["CURRENCY CODE"]);
    for (let i = 0; i < currencies.length; i++) {
      fields.currency.insertAdjacentHTML("beforeend", "<option>" + currencies[i] + "</option>");
    }

    let allSelectElements  = document.querySelectorAll("select"),
        allInputElements   = document.querySelectorAll("input");

    // Replace default <select> and <input> elements with custom elements.
    [...allSelectElements].forEach(selectElement => createCustomDropdown(selectElement));
    [...allInputElements].forEach(inputElement => createCustomInput(inputElement));

    // Automatically set the currency based on the country the user picks.
    let allCurrencyListItems = fields.currency.previousElementSibling.querySelectorAll(".field--dropdown__list-item");
    [...fields.country.previousElementSibling.querySelectorAll(".field--dropdown__list-item")].forEach((listItem) => {
      let selectCurrency = () => {
        let currencyToSelect = null;
        if (listItem.textContent !== "my country") {
          currencyToSelect = data.find(d => d.COUNTRY === listItem.textContent)["CURRENCY CODE"];
        } else {
          currencyToSelect = "currency";
        }

        let listItemCurrency = [...allCurrencyListItems].find(d => d.textContent === currencyToSelect);
        listItemCurrency.click();
      };

      listItem.addEventListener("click", selectCurrency);
      listItem.addEventListener("touchstart", selectCurrency);
    });

    let formParagraph = sections.form.querySelector(".form__paragraph");
    let allFields = formParagraph.querySelectorAll(".field");

    let setFieldLeftPosition = () => {
      [...allFields].forEach((field) => {
        let fieldModal = field.querySelector(".field__modal");
        fieldModal.style.left = -(field.offsetLeft - formParagraph.offsetLeft) + "px";
      });
    };

    setFieldLeftPosition();
    window.addEventListener("resize", setFieldLeftPosition);

    // Parse query strings such as "country=South+Africa".
    const URL_PARAMETERS = new URLSearchParams(document.location.search.substring(1));
    const DEFAULT_COUNTRY = URL_PARAMETERS.get("country");
    if (DEFAULT_COUNTRY) {
      let listItem = [...fields.country.previousElementSibling.querySelectorAll(".field--dropdown__list-item")]
        .find(listItem => listItem.textContent.toLowerCase() === DEFAULT_COUNTRY.toLowerCase());

      if (listItem !== undefined) {
        listItem.click();
      } else {
        console.error("Country not found");
      }
    }
  };

  /************************************************************************************************
   * Visualizations page
   ************************************************************************************************/

  socialMedia();

  let buttons = {
    calendarView: document.querySelector("#calendar-view-button"),
    clockView: document.querySelector("#clock-view-button"),
    yourGap: document.querySelector("#your-gap-button")
  };

  let goToVisualization = (i) => {
    let active = document.querySelector(".slider__item--active");
    active.classList.remove("slider__item--active");

    let allSliderItems = document.querySelectorAll(".slider__item");
    allSliderItems[i].classList.add("slider__item--active");
  };

  let allSidebarNavigationButtons = document.querySelectorAll(".sidebar__navigation-button");
  let allSliderNavigationDots = document.querySelectorAll(".slider__navigation-dot");

  let selectSidebarNavigationButton = (i) => {
      let active = document.querySelector(".sidebar__navigation-button--active");
      active.classList.remove("sidebar__navigation-button--active");
      allSidebarNavigationButtons[i].classList.add("sidebar__navigation-button--active");
      if (layout.sidebar.classList.contains("layout__sidebar--active")) {
        layout.sidebar.classList.remove("layout__sidebar--active");
      }
  };

  let selectSliderNaviagationDot = (i) => {
      let active = document.querySelector(".slider__navigation-dot--active");
      active.classList.remove("slider__navigation-dot--active");
      allSliderNavigationDots[i].classList.add("slider__navigation-dot--active");
  };

  let selectVisualization = (i) => {
    selectSidebarNavigationButton(i);
    selectSliderNaviagationDot(i);
    goToVisualization(i);
  };

  [...allSidebarNavigationButtons].forEach((sidebarNavigationButton, i) => {
    sidebarNavigationButton.addEventListener("click", () => { selectVisualization(i); });
  });

  [...allSliderNavigationDots].forEach((sliderNavigationDot, i) => {
    sliderNavigationDot.addEventListener("click", () => { selectVisualization(i); });
  });

  let menuButton = document.querySelector("#menu-button");

  let layout = {
    sidebar: document.querySelector(".layout__sidebar")
  };

  let sidebar = {
    closeButton: document.querySelector(".sidebar__close-button")
  };

  menuButton.addEventListener("click", () => {
    layout.sidebar.classList.add("layout__sidebar--active");
  });

  sidebar.closeButton.addEventListener("click", () => {
    layout.sidebar.classList.remove("layout__sidebar--active");
  });
});
