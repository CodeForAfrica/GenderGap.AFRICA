export default () => {
  let buttons = {
    facebook: document.querySelector("#facebook-button")
  };

  buttons.facebook.addEventListener("click", function(event) {
    event.preventDefault();

    let sharerURL = "https://facebook.com/sharer.php?u=" + encodeURIComponent("https://codeforafrica.github.io/GenderGapClock/dist/");
    let name = "facebook-share-dialog";
    let options = "menubar=no, toolbar=no, resizable=no, scrollbar=no, height=400, width=500";

    window.open(sharerURL, name, options);
  });
};
