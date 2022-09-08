import "../index.html"
import "../en/index.html"
import "../scss/index.scss"

// let xDown = null
// let yDown = null

// const vh = (v) => {
// const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
// return (v * h) / 100
// }

// const vw = (v) => {
// const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
// return (v * w) / 100
// }

// const turnOffScroll = () => {
// document.body.classList.add("no-scroll")
// }

// const turnOnScroll = () => {
// document.body.classList.remove("no-scroll")
// }

// const handleScroll = (e) => {
// if (document.body.scrollTop > vh(238)) {
//     // turnOffScroll()
// }
// }

// function getTouches(evt) {
//     return evt.touches || evt.originalEvent.touches
// }

// function handleTouchStart(evt) {
//     const firstTouch = getTouches(evt)[0]
//     xDown = firstTouch.clientX
//     yDown = firstTouch.clientY
// }

// function handleTouchMove(evt) {
// if (!xDown || !yDown) {
//     return
// }

// const xUp = evt.touches[0].clientX
// const yUp = evt.touches[0].clientY

// const xDiff = xDown - xUp
// const yDiff = yDown - yUp

// if (Math.abs(xDiff) > Math.abs(yDiff)) {
//     if (xDiff > 0) {
//         /* right swipe */
//     } else {
//      /* left swipe */
//     }
// } else {
//     // eslint-disable-next-line no-lonely-if
//     if (yDiff > 0) {
//         console.log("down")
//     } else {
//         turnOnScroll()
//     }
// }

// xDown = null
// yDown = null
// }

window.onload = () => {
	document.getElementsByClassName("container")[0].classList.remove("notready")
	document.getElementById("mobile-menu").classList.remove("notready")
	document.getElementsByClassName("header-mobile")[0].classList.remove("notready")
	document.getElementsByClassName("mobile")[0].classList.remove("notready")
	document.getElementsByTagName("header")[0].classList.remove("notready")
	const fadeTarget = document.getElementsByClassName("preloader")[0]
	const fadeEffect = setInterval(() => {
		if (fadeTarget.style.opacity > 0) {
			fadeTarget.style.opacity -= 0.05
		} else {
			clearInterval(fadeEffect)
			fadeTarget.style.display = "none"
		}
	}, 50)

	// eslint-disable-next-line no-undef, no-unused-vars
	const swiper = new Swiper(".block-4-mobile", {
		effect: "fade",
		fadeEffect: {
			crossFade: true,
		},
		centeredSlides: true,
		shortSwipes: true,
		speed: 600,
		virtualTranslate: true,
		followFinger: false,
		autoHeight: false,
		spaceBetween: 30,
	})
	// document.body.onscroll = (e) => {
	// console.log(e);
	// }
	// const scroller = scrollama()

	// document.body.addEventListener("scroll", handleScroll)
	// document.addEventListener("touchstart", handleTouchStart, false)
	// document.addEventListener("touchmove", handleTouchMove, false)
}

const isFirefox = /Firefox/i.test(navigator.userAgent)
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
let ticking = false
const scrollSensitivitySetting = isSafari ? 30 : 30
const slideDurationSetting = 600
// eslint-disable-next-line no-nested-ternary
const mousewheelEvent = isFirefox ? "DOMMouseScroll" : (isSafari ? "mousewheel" : "wheel")
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
	slideDurationTimeout(slideDurationSetting)
}

const block4change = (direction, e) => {
	if (block4state === 0 && direction === 0) {
		return false
	}
	if (block4state === 5 && direction === 1) {
		return false
	}

	if (!ticking) {
		ticking = true
		if (direction === 0) block4state -= 1
		if (direction === 1) block4state += 1

		let bg

		if (isSafari) {
			if (e.target.id === "block-4-1") {
				bg = e.target.offsetParent
			} else if (e.target.offsetParent.id === "block-4-1") {
				bg = e.target.offsetParent.offsetParent
			}
		} else {
			for (let i = 0; i < e.path.length; i += 1) {
				if (e.path[i].classList.contains("background")) {
					bg = e.path[i]
					break
				}
			}
		}

		const dots = bg.getElementsByClassName("dots")[0].getElementsByClassName("dot")
		for (let i = 0; i < dots.length; i += 1) {
			dots[i].classList.remove("active")
		}

		dots[block4state].classList.add("active")

		bg.style.backgroundImage = `url(${document.getElementById(`loader${block4state + 1}`).src})`
		slideDurationTimeout(slideDurationSetting)
		return true
	}

	return false
}

function parallaxScroll(evt) {
	let delta
	if (isFirefox) {
		delta = evt.detail * -120
	} else {
		delta = evt.wheelDelta
	}

	if (Math.abs(delta) < scrollSensitivitySetting) {
		return
	}

	let isBlock3 = false
	let isBlock4 = false

	if (isSafari) {
		if (evt.target.offsetParent !== null) {
			if (evt.target.id === "block-3-1" || evt.target.offsetParent.id === "block-3-1") {
				isBlock3 = true
			}

			if (evt.target.id === "block-4-1" || evt.target.offsetParent.id === "block-4-1") {
				isBlock4 = true
			}
		}
	} else {
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
	}

	if (isBlock4) {
		const direction = evt.wheelDeltaY < 0 ? 1 : 0
		if (block4change(direction, evt)) return
	}

	if (isBlock3 && evt.wheelDeltaY < 0 && block3state === 0) {
		if (!ticking) {
			ticking = true
			dogChange(1)
		}
		return
	}

	if (isBlock3 && evt.wheelDeltaY > 0 && block3state === 1) {
		if (!ticking) {
			ticking = true
			dogChange(0)
		}
		return
	}

	if (!ticking) {
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
