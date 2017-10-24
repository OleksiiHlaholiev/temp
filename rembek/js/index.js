/**
 * Created by Glalex on 01.06.2017.
 */

"use strict";

var html = document.documentElement,
    body = document.body;

var tempScrollTop, currentScrollTop = 0, referTopPoint = 300, distanceTop;


$(window).scroll(function(){
    currentScrollTop = window.pageYOffset;
    distanceTop = html.scrollTop || body && body.scrollTop || 0;
    distanceTop -= html.clientTop; // в IE7- <html> смещён относительно (0,0)

    if (tempScrollTop < currentScrollTop ){//scroll down
        hideMenu();
    }
    else if (tempScrollTop > currentScrollTop ){//scroll top
        showMenu();
        // default_style();
    }
    // console.log("currentScrollTop", currentScrollTop);

    tempScrollTop = currentScrollTop;

});

function hideMenu (){
    if (distanceTop > referTopPoint){
        if ($("header").hasClass("menu-hidden")){
            $("header").removeClass("menu-visible");
        }
        else {
            $("header").addClass("menu-hidden");
        }
    }
}
function showMenu(){
    if (distanceTop > referTopPoint){
        if( !($("header").hasClass("menu-visible")) ){
            $("header").addClass("menu-visible");
            // $("header").addClass("change_color");
        }
    }
}

//кнопка скролла вверх
function backToTop() {
    $(window).scroll(function () {
        var bo = $(document).scrollTop();
        var time_to_show = 600;	//$("#indeficator_toshow").offset().top;

        if (bo >= time_to_show) {
            $(".back-to-top").addClass("back-to-top-visible");
        }
        else {
            $(".back-to-top").removeClass("back-to-top-visible");
        }
    });
    $(".back-to-top").click(function (e) {
        e.preventDefault();
        $("html, body").animate({scrollTop: 0}, 1100);
    });
}

backToTop();


//------------   START OF GLOBAL VARIABLES AND FUNCTIONS   -------------
var successFormTimer,
    rembekForms = $(".rembek-form");

function rembekFormShow(rembekForm) {
    $(rembekForm).addClass("active").fadeIn(400);
    $("html, body").addClass("scroll-lock");
}

function rembekFormHide(rembekForm) {
    $(rembekForm).removeClass("active").fadeOut(400);

    if(!$("header").hasClass("active")) {
        // check if the header is not active - avoid dual deactivation of body scroll
        $("html, body").removeClass("scroll-lock");
    }
}

function successFormShow() {
    var timeToShow = 7000;
    rembekFormShow(".success-form");

    successFormTimer = setTimeout(function () {
        rembekFormHide(".success-form");
        clearTimeout(successFormTimer);
    }, timeToShow);
}
//------------   end OF GLOBAL VARIABLES AND FUNCTIONS   -------------

// start of order-form logic
$(function () {
    var orderForm = document.querySelector(".order-form");

    $(".order-form-btn").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation(); // to avoid inherit click events
        rembekFormShow(orderForm);
    });

    $(".order-form .close-btn").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation(); // to avoid inherit click events
        rembekFormHide(orderForm);
    });

    // form-handler
    $(orderForm).submit(function(event) { //устанавливаем событие отправки для формы
        event.preventDefault();
        var form_data = $(this).serialize(); //собераем все данные из формы
        $.ajax({
            type: "POST", //Метод отправки
            url: "php/send.php", //путь до php фаила отправителя
            data: form_data,
            success: function () {
                //код в этом блоке выполняется при успешной отправке сообщения
                // alert("Ваше сообщение отправлено!");
                orderForm.reset();
                rembekFormHide(orderForm);
                successFormShow();
            },
            error: function () {
                // alert("Произошла ошибка при отправке...( Попробуйте еще раз!");
            //    test DEL

                orderForm.reset();
                rembekFormHide(orderForm);
                successFormShow();
            }
        });
    });

    function modalClose (e) {
        if ( e.keyCode === 27 ) {
            // close forms on ESC
            if($(orderForm).hasClass("active")) {
                rembekFormHide(orderForm);
            }
        }
    }

    document.addEventListener('keydown', modalClose);
    
    $("body").click(function(event) {
        // if($(rembekForms).hasClass("active")) {
        //     alert("YES!");
        // }
        if(!$(event.target).closest($(".container")).length &&
            $(rembekForms).hasClass("active")) {
            event.preventDefault();
            rembekFormHide(rembekForms);
        }
    });
    
});
// end of order-form logic





$(function () {

    // ******************** GLOBAL VARIABLES ****************************
    var scrollPreviousPosition = 0,
        isMobileViewFlag = true,
        mobileViewWidth = 768,

        busyFlag = false;

    var header = document.querySelector("header"),
        siteNav = document.querySelector(".menu-cont .site-nav"),
        siteNavItems = siteNav.querySelectorAll(".nav-list li a"),

        ourProductSection = document.querySelector("#our-product-section"),
        cyclesSection = document.querySelector("#cycles-section"),
        advantagesSection = document.querySelector("#advantages-section"),
        applicationSection = document.querySelector("#application-section"),
        reviewsSection = document.querySelector("#reviews-section");


    // ***************************************************
    resizeWindowHandler();
    scrollWindowHandler(); // initial call!!!
    // ***************************************************

    $(".menu-mob-btn").on("click", function () {
        $(".menu-cont .site-nav").toggleClass("active").slideToggle(500);
    });
    

    // **************************************************************

    function activeSectionHandler(event){
        event.preventDefault();
        if (window.innerWidth < 1350) {
            $(siteNav).slideUp("fast");
        }
    }

    function resizeWindowHandler(event) {
        if (window.innerWidth < mobileViewWidth) {
            isMobileViewFlag = true;
        } else {
            isMobileViewFlag = false;
        }

        if (window.innerWidth < 1350) {
            $(siteNav).css("display", "none");
        } else {
            $(siteNav).css("display", "block");
        }
    }

    function scrollWindowHandler(event) {
        var prevActiveItem = document.querySelector(".site-nav .active"),
            tempOffset;


        if (window.innerWidth < mobileViewWidth) {
            tempOffset = window.innerHeight / 3;
        } else {
            tempOffset = window.innerHeight / 1.4;
        }

        var	currentPosition = document.body.scrollTop ?
            (document.body.scrollTop + tempOffset) :
            (document.documentElement.scrollTop + tempOffset);


        if ( (currentPosition > ourProductSection.offsetTop) &&
            (currentPosition < ourProductSection.offsetTop + ourProductSection.offsetHeight) ) {
            prevActiveItem.classList.remove("active");
            siteNavItems[0].classList.add("active");
        } else if ( (currentPosition > cyclesSection.offsetTop) &&
            (currentPosition < cyclesSection.offsetTop + cyclesSection.offsetHeight) ) {
            prevActiveItem.classList.remove("active");
            siteNavItems[1].classList.add("active");
        } else if ( (currentPosition > advantagesSection.offsetTop) &&
            (currentPosition < advantagesSection.offsetTop + advantagesSection.offsetHeight) ) {
            prevActiveItem.classList.remove("active");
            siteNavItems[2].classList.add("active");
        }
        else if ( (currentPosition > applicationSection.offsetTop) &&
            (currentPosition < applicationSection.offsetTop + applicationSection.offsetHeight) ) {
            prevActiveItem.classList.remove("active");
            siteNavItems[3].classList.add("active");
        }
        else if ( (currentPosition > reviewsSection.offsetTop) &&
            (currentPosition < reviewsSection.offsetTop + reviewsSection.offsetHeight) ) {
            prevActiveItem.classList.remove("active");
            siteNavItems[4].classList.add("active");
        }

        // if (!isMobileViewFlag) {
        //     if ( (currentPosition > achievmentsSection.offsetTop) &&
        //         (currentPosition < (achievmentsSection.offsetTop + achievmentsSection.clientHeight)) ) {
        //
        //         if (achievmentsSectionFirstScroll) {
        //             achievmentsSectionFirstScroll = false;
        //
        //         }
        //     }
        // }

        scrollPreviousPosition = currentPosition;

    }

    // ***************** REGISTER EVENT HANDLERS *******************

    window.addEventListener('scroll', scrollWindowHandler);
    window.addEventListener('resize', resizeWindowHandler);

    $(siteNavItems).on("click", activeSectionHandler);

    // animate-scroll to all anchors on page
    $('a[href^="#"]').click(function(){
        var el = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(el).offset().top}, 1000);
        return false;
    });

    // ************************************************************************************
    
});

