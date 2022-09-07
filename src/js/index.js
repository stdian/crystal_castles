import "../index.html"
import "../en/index.html"
import "../scss/index.scss"

let ticking = false
const isFirefox = /Firefox/i.test(navigator.userAgent)
// eslint-disable-next-line no-useless-escape
const isIe = /MSIE/i.test(navigator.userAgent) || /Trident.*rv\:11\./i.test(navigator.userAgent)
const scrollSensitivitySetting = 30
const slideDurationSetting = 600
const mousewheelEvent = isFirefox ? "DOMMouseScroll" : "wheel"
let currentSlideNumber = 0
// eslint-disable-next-line no-undef
const totalSlideNumber = $(".background").length

const nextItem = () => {
	// eslint-disable-next-line no-undef
	const $previousSlide = $(".background").eq(currentSlideNumber - 1)
	$previousSlide.removeClass("up-scroll").addClass("down-scroll")
}

const previousItem = () => {
	// eslint-disable-next-line no-undef
	const $currentSlide = $(".background").eq(currentSlideNumber)
	$currentSlide.removeClass("down-scroll").addClass("up-scroll")
}

function slideDurationTimeout(slideDuration) {
	setTimeout(() => {
		ticking = false
	}, slideDuration)
}

function parallaxScroll(evt) {
	let delta
	if (isFirefox) {
		delta = evt.detail * -120
	} else if (isIe) {
		delta = -evt.deltaY
	} else {
		delta = evt.wheelDelta
	}

	if (ticking !== true) {
		if (delta <= -scrollSensitivitySetting) {
			ticking = true
			if (currentSlideNumber !== totalSlideNumber - 1) {
				currentSlideNumber += 1
				nextItem()
			}
			slideDurationTimeout(slideDurationSetting)
		}
		if (delta >= scrollSensitivitySetting) {
			ticking = true
			if (currentSlideNumber !== 0) {
				currentSlideNumber -= 1
			}
			previousItem()
			slideDurationTimeout(slideDurationSetting)
		}
	}
}

// eslint-disable-next-line no-undef
window.addEventListener(mousewheelEvent, _.throttle(parallaxScroll, 60), false)

window.scrollToSlide = (slide) => {
	if (currentSlideNumber < slide) {
		// eslint-disable-next-line no-undef
		const slides = $(".background").slice(currentSlideNumber, slide)
		for (let i = 0; i < slides.length; i += 1) {
			slides[i].classList.remove("up-scroll")
			slides[i].classList.add("down-scroll")
		}
		currentSlideNumber = slide
		slideDurationTimeout(slideDurationSetting)
	} else if (currentSlideNumber > slide) {
		// eslint-disable-next-line no-undef
		const slides = $(".background").slice(slide, currentSlideNumber)
		for (let i = 0; i < slides.length; i += 1) {
			slides[i].classList.add("up-scroll")
			slides[i].classList.remove("down-scroll")
		}
		currentSlideNumber = slide
		slideDurationTimeout(slideDurationSetting)
	}
}

// eslint-disable-next-line no-undef, no-unused-vars
const swiper = new Swiper(".block-4-mobile", {})

window.showMobileMenu = () => {
	const content = document.querySelector(".mobile")
	const menu = document.querySelector("#mobile-menu")
	const header = document.querySelector(".header-mobile")

	content.style.display = "none"
	menu.style.display = "block"
	header.style.display = "none"
}

window.hideMobileMenu = () => {
	const content = document.querySelector(".mobile")
	const menu = document.querySelector("#mobile-menu")
	const header = document.querySelector(".header-mobile")

	content.style.display = "block"
	menu.style.display = "none"
	header.style.display = "flex"
}
