import localGapVisualization from './local-gap-visualization';

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

  window.fbAsyncInit = () => {
      FB.init({
          appId      : '361380480996529',
          xfbml      : true,
          version    : 'v2.7'
      })
  };

  (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

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

    function dataURItoBlob(dataURI) {
      var byteString = atob(dataURI.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); }
      return new Blob([ab], { type: 'image/jpeg' });
    }

    

    FB.login(function(response) {
        if (response.authResponse) {
         console.log('Welcome!  Fetching your information.... ');
         // FB.api('/me', function(response) {
         //   console.log('Good to see you, ' + response.name + '.');
         // });
         console.log(response)
          var image = localGapVisualization.getImage();
          var blob = dataURItoBlob(dataURL)
          var formData = new FormData()
          formData.append('token', 'ad483b24082541024851ba76aa6e7ba6')
          formData.append('source', blob)
          formData.append('caption', "testing... https://gendergap.africa/")

          var xhr = new XMLHttpRequest();
          xhr.open( 'POST', 'https://graph.facebook.com/me/photos', true )
          xhr.onload = xhr.onerror = function() {
            console.log( xhr.responseText )
          };
          xhr.send( formData );
          // var wallPost = {
          //     // message : "testing... https://gendergap.africa/",
          //     // url: "https://gendergap.africa/images/test-social.jpg",
          //     source: image,
          //     caption: "testing... https://gendergap.africa/"
          //     // link: "https://gendergap.africa"
          // };
          // FB.api('/me/photos', 'post', wallPost , function(response) {
          //   if (!response || response.error) {
          //     console.log(response);
          //     // alert('Error occured');
          //   } else {
          //     alert('Post ID: ' + response);
          //   }
          // });
        } else {
         console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'user_posts,publish_actions'});


    
    // let url = "https://facebook.com/sharer.php?u=" + encodeURIComponent("https://gendergap.africa/");
    // let name = "facebook-share-dialog";
    // let options = "menubar=no, toolbar=no, resizable=no, scrollbar=no, height=400, width=500";

    // window.open(url, name, options);
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
