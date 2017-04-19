document.addEventListener("DOMContentLoaded", () => {

  /************************************************************************************************
   * Identify whether the user's device is a touch device.
   * Reference: http://stackoverflow.com/a/19715406/1300992
   ************************************************************************************************/

  let isTouch = !!("ontouchstart" in window) || window.navigator.msMaxTouchPoints > 0;
  document.documentElement.classList.add((isTouch) ? "touch" : "no-touch");


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
    profession: document.querySelector("#user-profession"),
    country:    document.querySelector("#user-country"),
    salary:     document.querySelector("#user-salary")
  };

  document.querySelector("#form-button").addEventListener("click", () => {
    console.log(user.gender.options[user.gender.selectedIndex].value);
    console.log(user.profession.value);
    console.log(user.country.value);
    console.log(user.salary.value);
    //jumpToNextSection(sections.form);
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

  fetch("data/data.csv")
    .then(response => response.text())
    .then((text) => {

      // Convert CSV data to JSON.
      let data = d3.csvParse(text);

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
    })
    .catch(err => console.error(err));
});
