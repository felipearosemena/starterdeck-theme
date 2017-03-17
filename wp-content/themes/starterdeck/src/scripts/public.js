import './modules/polyfills'
import './modules/modernizrTests'

import Flickity from 'flickity'
import smoothScroll from 'smooth-scroll'

import router from './modules/router'
import EventBus from './modules/EventBus'
import { initModal, initVideoModal } from './modules/modal'
import toggleTarget from './modules/toggleTarget'
import { keyDownEscape, windowResized } from './modules/globalEvents'
import { collection, getBpObj } from './modules/utils'

// Stub the console, if it doesn't exist
window.console = window.console || { log() {} } 

/*----------  Common Function Definitions  ----------*/


/*----------  Scripts to Fire on Every Page  ----------*/

const breakpoints = getBpObj()

/**
 * 
 * Listen for card elements click, and trigger click on the links inside,
 * making the whole card clickable
 * 
 */

collection('[data-card-click]').map(card => {
  card.addEventListener('click', e => {
    const link = card.querySelector('[data-card-link]')
    if(link) { link.click() }
  })
})


/**
 *
 * Smooth scroll for links within the same page
 * 
 */

EventBus.subscribe(windowResized, e => {
  smoothScroll.init({
    offset: document.querySelector('#site-header').offsetHeight
  })
})

/**
 *
 * Search Bar Toggle
 * 
 */

const siteSearch = document.querySelector('#site-search')

// Focuses automatically when opening
const toggleSearchController = toggleTarget('.js-toggle-search', {
  onToggleOpen: (els) => siteSearch.querySelector('input').focus()
})

// Close the search bar on `esc` press
EventBus.subscribe(keyDownEscape, () => {
  toggleSearchController.closeAll()
})

/**
 *
 *  Generic Toggle
 * 
 */

toggleTarget('.js-toggle')

toggleTarget('.js-toggle-tab', {
  onToggleOpen({ target, group }) {
    if (group) {
      setTimeout(() => {
        smoothScroll.animateScroll(group)
      }, 0)
    }
  }
})

/**
 *
 * Mobile Navigation
 * 
 */

initModal(document.querySelector('#mobile-nav'))
initVideoModal(document.querySelector('#video-modal'), '[data-video-player]')
initModal(document.querySelector('#modal'))

/**
 *
 *  Sliders
 * 
 */

collection('.js-slider')
  .filter(el => el.children.length > 1)
  .map(el => new Flickity(el, {
    pageDots: el.dataset.pageDots == 'false' ? false : true
  }))

EventBus.subscribe(windowResized, () => {

  const sliders = collection('.js-mobile-slider')

  if(window.innerWidth <= breakpoints.lg) {
    sliders
      .filter(el => !Flickity.data(el))
      .map(el => new Flickity(el, {
        pageDots: true,
        prevNextButtons: false
      }))
  } else {
    sliders
      .map(el => Flickity.data(el))
      .filter(flickity => flickity)
      .map(flickity => flickity.destroy())
  }

})


/*----------  Route Specific  ----------*/

router({
  home() {
    
  }
})

// Fire initial custom events

EventBus.publish(windowResized)
