import * as d3 from "d3";
import MobileDetect from "mobile-detect";
import socialMedia from "./modules/social-media";

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

  var md = new MobileDetect(window.navigator.userAgent);
  if (md.mobile()) {
    document.documentElement.classList.add("is-mobile");
  }

  /************************************************************************************************
   * All pages
   ************************************************************************************************/

  let sections = {
    homepage:       document.querySelector(".section--homepage"),
    form:           document.querySelector(".section--form"),
    visualizations: document.querySelector(".section--visualizations")
  };

  let jumpToNextSection = (activeSection) => {
    activeSection.classList.remove("section--active");
    activeSection.nextElementSibling.classList.add("section--active");
  };


  /************************************************************************************************
   * Homepage
   ************************************************************************************************/

  document.querySelector("#homepage-button").addEventListener("click", () => {
    jumpToNextSection(sections.homepage);
  });


  /************************************************************************************************
   * Form page
   ************************************************************************************************/

  let user = {
    gender:     document.querySelector("#user-gender"),
    country:    document.querySelector("#user-country"),
    salary:     document.querySelector("#user-salary")
  };

  document.querySelector("#form-button").addEventListener("click", () => {
    let gender = user.gender.options[user.gender.selectedIndex].value;
    if (gender === "my gender") {
      alert("Please enter gender");
      return;
    }

    let country = user.country.value;
    if (country === "my country") {
      alert("Please enter country");
      return;
    }

    let salary = user.salary.value;
    if (salary === "") {
      alert("Please enter salary");
      return;
    }

    jumpToNextSection(sections.form);
  });

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

        closeFieldModal();
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
    field.input.setAttribute("type", "text");
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
      field.toggle.innerHTML = field.input.value.trim() !== '' ? field.input.value : field.input.placeholder;
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
    let countries = data.map(d => d.country);
    for (let i = 0; i < countries.length / 2; i++) {
      user.country.insertAdjacentHTML("beforeend", "<option>" + countries[i] + "</option>");
    }

    let allSelectElements  = document.querySelectorAll("select"),
        allInputElements   = document.querySelectorAll("input");

    // Replace default <select> and <input> elements with custom elements.
    [...allSelectElements].forEach(selectElement => createCustomDropdown(selectElement));
    [...allInputElements].forEach(inputElement => createCustomInput(inputElement));

    let formParagraph = sections.form.querySelector(".form__paragraph");
    let fields = formParagraph.querySelectorAll(".field");

    let setFieldLeftPosition = () => {
      [...fields].forEach((field) => {
        let fieldModal = field.querySelector(".field__modal");
        fieldModal.style.left = -(field.offsetLeft - formParagraph.offsetLeft) + "px";
      });
    };

    setFieldLeftPosition();
    window.addEventListener("resize", setFieldLeftPosition);
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
  [...allSidebarNavigationButtons].forEach((sidebarNavigationButton, i) => {
    sidebarNavigationButton.addEventListener("click", () => {
      let active = document.querySelector(".sidebar__navigation-button--active");
      active.classList.remove("sidebar__navigation-button--active");

      allSidebarNavigationButtons[i].classList.add("sidebar__navigation-button--active");

      document.querySelectorAll(".slider__navigation-dot")[i].click();

      goToVisualization(i);
    });
  });

  let allSliderNavigationDots = document.querySelectorAll(".slider__navigation-dot");
  allSliderNavigationDots.forEach((sliderNavigationDot, i) => {
    sliderNavigationDot.addEventListener("click", () => {
      let active = document.querySelector(".slider__navigation-dot--active");
      active.classList.remove("slider__navigation-dot--active");

      allSliderNavigationDots[i].classList.add("slider__navigation-dot--active");

      document.querySelectorAll(".sidebar__navigation-button")[i].click();

      goToVisualization(i);
    });
  });

  let menuButton = document.querySelector("#menu-button");

  var layout = {
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

  /**
   * @param {int} The month number, 0 based
   * @param {int} The year, not zero based, required to account for leap years
   * @return {Date[]} List with date objects for each day of the month
   * Reference: http://stackoverflow.com/a/13146828/1300992
   */
  let getDaysInMonth = (month, year) => {
    let date = new Date(year, month, 1);
    let days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  let createCalendarGapVisualization = (data) => {
    let now = new Date();
    let days = getDaysInMonth(now.getMonth(), now.getFullYear());
    days = days.filter((day) => day.getDay() >= 1 && day.getDay() <= 5);

    let TEST = 9;

    let grid = document.querySelector(".grid");
    days.forEach((day, i) => {
      let gridItem = document.createElement("div");
      gridItem.className = "grid__item";

      if (i < TEST) {
        gridItem.classList.add("grid__item--red-square");
      } else {
        gridItem.classList.add("grid__item--gray-square");
      }

      if (day.toDateString() === now.toDateString()) {
        gridItem.classList.add("grid__item--black-frame");
      }

      grid.appendChild(gridItem);
    });
  };

  let createClockGapVisualization = (data) => {
    let svg = d3.select("#clock-gap-visualization")
      .append("svg")
      .style("width", "100%");

    let width = parseInt(window.getComputedStyle(svg.node()).width, 10);
    let height = parseInt(window.getComputedStyle(svg.node()).height, 10);
    let radius = Math.min(width, height) / 2;

    let g = svg.append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    window.addEventListener("resize", () => {
      width = parseInt(window.getComputedStyle(svg.node()).width, 10);
      height = parseInt(window.getComputedStyle(svg.node()).height, 10);

      g.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    });

    let pie = d3.pie()
      .sort(null)
      .value((d) => d)
      .startAngle(-90 * (Math.PI/180))
      .endAngle(90 * (Math.PI/180))
      .padAngle(0.005);

    let path = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 25);

    let arc = g.selectAll(".arc")
      .data(pie([1, 1, 1, 1, 1, 1, 1, 1]))
      .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
      .attr("d", path)
      .attr("fill", (d, i) => i < 5 ? "#e74c3c" : "#969696");

    let pad = value => (value < 10) ? "0" + value : value;

    let now = new Date();
    let currentTime = now.getHours() % 13 + ":" + pad(now.getMinutes()) + " " + ((now.getHours() < 12) ? "AM" : "PM");

    let text = g.append("text")
      .attr("text-anchor", "middle")
      .attr("class", "text");

    text.append("tspan")
      .attr("fill", "#e74c3c")
      .attr("font-weight", "600")
      .text(currentTime);

    text.append("tspan")
      .attr("fill", "#282828")
      .attr("font-weight", "300")
      .text(" / one hour ago");

    g.append("text")
      .attr("x", "-180")
      .attr("fill", "#282828")
      .attr("text-anchor", "start")
      .text("9 AM");

    g.append("text")
      .attr("x", "180")
      .attr("fill", "#282828")
      .attr("text-anchor", "end")
      .text("6 AM");
  };

  fetch("data/data.csv")
    .then(response => response.text())
    .then((text) => {

      // Convert CSV data to JSON.
      let data = d3.csvParse(text);

      createFormPage(data);

      createCalendarGapVisualization(data);
      createClockGapVisualization(data);
    })
    .catch(err => console.error(err));
});
