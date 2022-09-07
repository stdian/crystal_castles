import "../index.html"
import "../en/index.html"
import "../scss/index.scss"

let ticking = false
const isFirefox = /Firefox/i.test(navigator.userAgent)
const scrollSensitivitySetting = 30
const slideDurationSetting = 600
const mousewheelEvent = "wheel"
let currentSlideNumber = 0
// eslint-disable-next-line no-undef
const totalSlideNumber = $(".background").length

let block3state = 0
let block4state = 0

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

const dogChange = (state) => {
	const block = document.getElementById("block-3-1")
	block3state = state
	if (block3state === 0) {
		block.getElementsByClassName("top")[0].classList.remove("changed")
		block.getElementsByClassName("bottom")[0].classList.remove("changed")
		block.getElementsByClassName("img")[0].classList.remove("changed")
	}
	if (block3state === 1) {
		block.getElementsByClassName("top")[0].classList.add("changed")
		block.getElementsByClassName("bottom")[0].classList.add("changed")
		block.getElementsByClassName("img")[0].classList.add("changed")
	}
}

const block4change = (direction, e) => {
	if (block4state === 0 && direction === 0) {
		return false
	}
	if (block4state === 5 && direction === 1) {
		return false
	}

	if (direction === 0) block4state -= 1
	if (direction === 1) block4state += 1

	let bgIndex = 0
	for (let i = 0; i < e.path.length; i += 1) {
		if (e.path[i].classList.contains("background")) {
			bgIndex = i
			break
		}
	}

	const bg = e.path[bgIndex]
	const dots = e.path[bgIndex].getElementsByClassName("dots")[0].getElementsByClassName("dot")
	for (let i = 0; i < dots.length; i += 1) {
		dots[i].classList.remove("active")
	}

	dots[block4state].classList.add("active")

	bg.style.backgroundImage = `url(/img/block-4/${block4state + 1}..png)`

	return true
}

function parallaxScroll(evt) {
	const delta = evt.wheelDelta

	let isBlock3 = false
	let isBlock4 = false

	for (let i = 0; i < evt.path.length; i += 1) {
		if (evt.path[i].id === "block-3-1") {
			isBlock3 = true
			break
		}

		if (evt.path[i].id === "block-4-1") {
			isBlock4 = true
			break
		}
	}

	if (isBlock4) {
		const direction = evt.wheelDeltaY < 0 ? 1 : 0
		if (block4change(direction, evt)) return
	}

	if (isBlock3 && evt.wheelDeltaY < 0 && block3state === 0) {
		dogChange(1)
		return
	}

	if (isBlock3 && evt.wheelDeltaY > 0 && block3state === 1) {
		dogChange(0)
		return
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
