export default () => {
  let buttons = {
    twitter: document.querySelector("#twitter-button"),
    twitterInline: document.querySelector("#twitter-button-inline"),
    twitterInlineAlt: document.querySelector("#twitter-button-inline-alt"),
    facebook: document.querySelector("#facebook-button"),
    facebookInline: document.querySelector("#facebook-button-inline"),
    facebookInlineAlt: document.querySelector("#facebook-button-inline-alt"),
    whatsapp: document.querySelector("#whatsapp-button"),
    whatsappInline: document.querySelector("#whatsapp-button-inline"),
    whatsappInlineAlt: document.querySelector("#whatsapp-button-inline-alt"),
    email: document.querySelector("#email-button"),
    share: document.querySelector('#share-button'),
    close: document.querySelector('#share-close-button')
  };

  buttons.whatsapp.href = buttons.whatsapp.href + ' ' + window.location.href;
  buttons.email.href = buttons.email.href + ' ' + encodeURI(window.location.href);

  buttons.twitter.addEventListener("click", (event) => {
    event.preventDefault();

    let url = "https://twitter.com/intent/tweet?text=Explore inequality of income across African countries&url=" + window.location.href + '&hashtags=GenderGap,Africa';
    let name = "twitter-share-dialog";
    let options = "menubar=no, toolbar=no, resizable=no, scrollbar=no, height=400, width=500";

    window.open(url, name, options);
  });

  buttons.twitterInline.addEventListener("click", (event) => {
    event.preventDefault();
    let text = document.querySelector('.global__shareable').innerText + ' How does your country compare? ';
    let url = "https://twitter.com/intent/tweet?text=" + encodeURI(text) + '&url=' + encodeURI(window.location.href) + '&hashtags=GenderGap,Africa';
    let name = "twitter-share-dialog";
    let options = "menubar=no, toolbar=no, resizable=no, scrollbar=no, height=400, width=500";

    window.open(url, name, options);
  });

  buttons.twitterInlineAlt.addEventListener("click", (event) => {
    event.preventDefault();
    let text = document.querySelector('.gap__gender-split').innerText + ' Calculate your African data gap: ';
    let url = "https://twitter.com/intent/tweet?text=" + encodeURI(text) + '&url=' + encodeURI(window.location.href) + '&hashtags=GenderGap,Africa';
    let name = "twitter-share-dialog";
    let options = "menubar=no, toolbar=no, resizable=no, scrollbar=no, height=400, width=500";

    window.open(url, name, options);
  });

  buttons.facebook.addEventListener("click", (event) => {
    event.preventDefault();

    let url = "https://facebook.com/sharer.php?u=" + encodeURIComponent("https://gendergap.africa/");
    let name = "facebook-share-dialog";
    let options = "menubar=no, toolbar=no, resizable=no, scrollbar=no, height=400, width=500";

    window.open(url, name, options);
  });

  buttons.facebookInline.addEventListener("click", (event) => {
    event.preventDefault();

    let url = "https://facebook.com/sharer.php?u=" + encodeURIComponent(window.location.href);
    let name = "facebook-share-dialog";
    let options = "menubar=no, toolbar=no, resizable=no, scrollbar=no, height=400, width=500";

    window.open(url, name, options);
  });

  buttons.facebookInlineAlt.addEventListener("click", (event) => {
    event.preventDefault();

    let url = "https://facebook.com/sharer.php?u=" + encodeURIComponent(window.location.href);
    let name = "facebook-share-dialog";
    let options = "menubar=no, toolbar=no, resizable=no, scrollbar=no, height=400, width=500";

    window.open(url, name, options);
  });

  if (!document.documentElement.classList.contains("is-mobile")) {
    buttons.whatsapp.parentNode.style.display = "none";
    buttons.whatsappInline.parentNode.style.display = "none";
    buttons.whatsappInlineAlt.parentNode.style.display = "none";
  }

  buttons.share.addEventListener("click", (event) => {
    event.preventDefault();

    if (window.matchMedia("(min-width: 550px)").matches) {
      return;
    } else {
      document.querySelector('.social-media__buttons').classList.add('active');
    }
  });

  buttons.close.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.social-media__buttons').classList.remove('active');
  });
};
