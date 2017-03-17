/**
 *
 * Global DOM Event Listeners, to be used in conjunction with the `EventBus`
 *
 */

import EventBus from './EventBus'
import { debounce } from './utils'

export const keyDownEscape = 'keydown:escape'
export const windowResized = 'window:resized'
export const windowScrolled = 'window:scrolled'
export const windowLoaded = 'window:loaded'

window.addEventListener('keydown', e => {
  switch (e.keyCode) {
    case 27:
      EventBus.publish(keyDownEscape)
    break;
    default:
    break;
  }
})


window.addEventListener('resize', debounce(() => {
  EventBus.publish(windowResized)
}, 100))

window.addEventListener('scroll', () => {
  EventBus.publish(windowScrolled)
})

window.addEventListener('load', () => {
  EventBus.publish(windowLoaded)
})