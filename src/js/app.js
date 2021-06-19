window.onload = function () {
    const navButton = document.querySelector('[data-js="nav-button"]'),
          BODY = document.body;

    navButton.onclick = function() {
        BODY.classList.toggle('open');
    }

    const videoContainer = document.querySelector('[data-video-cont]'),
          playButton = videoContainer.querySelector('[data-btn-play]'),
          pauseButton = videoContainer.querySelector('[data-btn-pause]'),
          myVideo = videoContainer.querySelector('video'),
          progressBar = videoContainer.querySelector('[data-progess-bar]');
    
    playButton.onclick = function() {
        myVideo.play();
        videoContainer.classList.add('is--playing');
    };

    pauseButton.onclick = function() {
        myVideo.pause();
        videoContainer.classList.remove('is--playing');
    };
    myVideo.ontimeupdate = function() {
        progressBar.style.width = Math.ceil(myVideo.currentTime / myVideo.duration * 100) + '%';
    }


    const form_mod = document.querySelector(".form"),
	    form_el = form_mod.querySelector("form"),
	    form_req = form_mod.querySelectorAll("[required]");
    
    form_el.onsubmit = function(e) {
        e.preventDefault();

        form_el.classList.add("is--submitted");
        var isError = false;

        for (var i = 0; i < form_req.length; i++) {
            if (form_req[i].checkValidity() != true) {
                isError = true;
            }
        }

        if (!isError) {
            // base js send post
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert("form send");

                    form_el.classList.remove("is-submitted");
                    form_el.reset();
                }
            };
            xhttp.open("POST", "https://httpstat.us/200", true);
            xhttp.send(new FormData(form_el));
        } else {
            console.log("there are some not property validated fields");
        }
    };

    const loader = setTimeout(() => {
        BODY.classList.add('loaded')
    }, 2000);

    const mySwiper = new Swiper(".swiper-container", {
        // Optional parameters
        loop: true,

        // Navigation arrows
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },

        slidesPerView: 5,
        spaceBetween: 30,
        freeMode: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },

    });

};
