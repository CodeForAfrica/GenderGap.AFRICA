export default () => {
  let buttons = {
    twitter: document.querySelector("#twitter-button"),
    facebook: document.querySelector("#facebook-button")
  };

  buttons.twitter.addEventListener("click", (event) => {
    event.preventDefault();

    let url = "https://twitter.com/intent/tweet?text=...";
    let name = "twitter-share-dialog";
    let options = "menubar=no, toolbar=no, resizable=no, scrollbar=no, height=400, width=500";

    window.open(url, name, options);
  });

  buttons.facebook.addEventListener("click", (event) => {
    event.preventDefault();

    let url = "https://facebook.com/sharer.php?u=" + encodeURIComponent("https://codeforafrica.github.io/GenderGapClock/dist/");
    let name = "facebook-share-dialog";
    let options = "menubar=no, toolbar=no, resizable=no, scrollbar=no, height=400, width=500";

    window.open(url, name, options);
  });
};
