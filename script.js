"use strict";

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const header = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");
const allButtons = document.getElementsByTagName("button");
const message = document.createElement("div");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const nav = document.querySelector(".nav");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const mobileNavBtn = document.getElementById("openMobileNav");
const checkboxIcon = document.getElementById("checkboxIcon");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Mobile Nav
if (window.innerWidth < 600) {
	mobileNavBtn.checked = true;
	nav.classList.add("hidden");

	mobileNavBtn.addEventListener("change", function () {
		if (mobileNavBtn.checked) {
			nav.classList.add("hidden");
			checkboxIcon.innerHTML = `<i class="fas fa-bars"></i>`;
			checkboxIcon.style.fontSize = "2.5rem";
		} else {
			nav.classList.remove("hidden");
			checkboxIcon.innerHTML = `<i class="fas fa-times"></i>`;
			checkboxIcon.style.fontSize = "3rem";
		}
	});
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Modal Window and login btn

const openModal = function () {
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");

	const btnDetails = document.getElementById("btnDetails");
	console.log(btnDetails);
	btnDetails.addEventListener("click", function (e) {
		e.preventDefault();
		storeLoginData();
	});
};

const showDetails = function (fName, lName, pin) {
	const name = `${fName} ${lName}`;

	let username = name
		.toLowerCase()
		.split(" ")
		.map((name) => name[0])
		.join("");

	localStorage.setItem("bankistFullName", `${name}`);
	localStorage.setItem("bankistPin", `${pin}`);

	console.log(username);
	document.querySelector(".login-page").classList.add("hide");
	document.querySelector(".login-details").classList.remove("hide");

	document.getElementById("username").textContent = username;
	document.getElementById("pin").textContent = pin;
};

const btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener("click", () => {
	window.location = "app/index.html";
});

const storeLoginData = function () {
	let fName = document.getElementById("fName").value;
	let lName = document.getElementById("lName").value;

	function randomIntFromInterval(min, max) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	let pin = randomIntFromInterval(1000, 9999);

	showDetails(fName, lName, pin);
};

const closeModal = function () {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape" && !modal.classList.contains("hidden")) {
		closeModal();
	}
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Smooth scrolling

btnScrollTo.addEventListener("click", (e) => {
	e.preventDefault();

	const s1coords = section1.getBoundingClientRect();
	console.log(s1coords);
	console.log(e.target.getBoundingClientRect());

	console.log("Current scroll(X/Y)", window.pageXOffset, window.pageYOffset);

	console.log(
		"height/width viewport",
		document.documentElement.clientHeight,
		document.documentElement.clientWidth
	);
	// scrolling
	section1.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
	e.preventDefault();

	// Matching stratagey
	if (e.target.classList.contains("nav__link")) {
		e.preventDefault();
		const id = e.target.getAttribute("href");
		document.querySelector(id).scrollIntoView({ behavior: "smooth" });
	}
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Cookies section
const showCookiesMessage = function () {
	let cookiesAccepted = localStorage.getItem("bankistCookiesAccepted");

	if (cookiesAccepted) {
		return;
	} else {
		message.classList.add("cookie-message");
		message.textContent =
			"We use cookies for improved functionality and analytics.";
		message.innerHTML =
			'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
		header.append(message);
		message.style.backgroundColor = "#37383d";
		message.style.width = "120%";
	}
};
showCookiesMessage();

document.querySelector(".btn--close-cookie")?.addEventListener("click", () => {
	message.remove();
	localStorage.setItem("bankistCookiesAccepted", true);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener("click", function (e) {
	const clicked = e.target.closest(".operations__tab");
	e.preventDefault();

	// Guard clause
	if (!clicked) return;

	// active tabs
	tabs.forEach((t) => t.classList.remove("operations__tab--active"));
	clicked.classList.add("operations__tab--active");

	// Activate content area
	tabsContent.forEach((t) =>
		t.classList.remove("operations__content--active")
	);

	document
		.querySelector(`.operations__content--${clicked.dataset.tab}`)
		.classList.add("operations__content--active");
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
	if (e.target.classList.contains("nav__link")) {
		const link = e.target;
		const siblings = link.closest(".nav").querySelectorAll(".nav__link");
		const logo = link.closest(".nav").querySelector("img");

		siblings.forEach((el) => {
			if (el !== link) el.style.opacity = this;
		});
		logo.style.opacity = this;
	}
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Sticky Navigation

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
	const [entry] = entries;

	if (!entry.isIntersecting == true) {
		nav.classList.add("sticky");
	} else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Reveal Sections

const revealSection = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;
	entry.target.classList.remove("section--hidden");
	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

allSections.forEach(function (section) {
	sectionObserver.observe(section);
	section.classList.add("section--hidden");
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Lazy loading images

const imgTargets = document.querySelectorAll("img[data-src]");

const loadImg = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	// Replace src attribute with data-src
	entry.target.src = entry.target.dataset.src;
	entry.target.addEventListener("load", function () {
		entry.target.classList.remove("lazy-img");
	});

	observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0.1,
	rootMargin: "100px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Content slider
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

let curSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
	slides.forEach(function (_, i) {
		dotContainer.insertAdjacentHTML(
			"beforeend",
			`
    <button class="dots__dot dots__dot--active" data-slide="${i}"></button>
    `
		);
	});
};
createDots();

const activateDots = function (slide) {
	document
		.querySelectorAll(".dots__dot")
		.forEach((dot) => dot.classList.remove("dots__dot--active"));

	const value = function (slide) {
		return document.querySelector(`.dots__dot[data-slide="${slide}"]`);
	};
	let i = value(slide);
	i.classList.add("dots__dot--active");
};
activateDots(0);

const goToSlide = function (slide) {
	slides.forEach(
		(s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
	);
};
goToSlide(0);

// next slide
const nextSlide = function () {
	if (curSlide === maxSlide - 1) {
		curSlide = 0;
	} else {
		curSlide++;
	}
	goToSlide(curSlide);
	activateDots(curSlide);
};

const prevSlide = function () {
	if (curSlide === 0) {
		curSlide = maxSlide - 1;
	} else curSlide--;
	goToSlide(curSlide);
	activateDots(curSlide);
};

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
	if (e.key === "ArrowLeft") prevSlide();
	if (e.key === "ArrowRight") nextSlide();
});

dotContainer.addEventListener("click", function (e) {
	if (e.target.classList.contains("dots__dot")) {
		curSlide = +e.target.dataset.slide;
		goToSlide(curSlide);
		activateDots(e.target.dataset.slide);
	}
});

// document.addEventListener("DOMContentLoaded", function (e) {
// 	console.log("HTML Parsed and DOM tree built", e);
// });

// window.addEventListener("load", function (e) {
// 	console.log("Page fully loaded", e);
// });

// window.addEventListener("beforeunload", function (e) {
// 	e.preventDefault();
// 	console.log(e);
// 	e.returnValue = "";
// });
