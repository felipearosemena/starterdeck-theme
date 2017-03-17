/**
 *
 * Load More
 *
 * Handles loading more posts at the end of a list of posts
 * 
 */

import EventBus from './EventBus'
import { inArray, extractURLParameters, serializeObject, createElement, collection } from './utils'
import { loadOnce } from './load'


/**
 *
 * Filter the items found from the XHR request,
 * removing the ones with a `data-post-id` already pushed to the
 * `loadedItems` array
 *
 * @returns {boolean} Whether the item was found in the passed array or not
 *
 */

function filterLoaded(itemId, loadedItems) {
  let alreadyLoaded = inArray(itemId, loadedItems)
  loadedItems.push(itemId)
  return !alreadyLoaded
}

/**
 *
 * Create a loader instance
 *
 * @important Your `selector` elements should have a `data-post-id` attribute, with it's corresponding 
 * post id. The script uses this to filter out any sticky posts that may have already been loaded 
 * 
 * @events 'ajax-loader:finished', 'ajax-loader:next-fetched', 'ajax-loader:loaded' 
 * @param {string} selector The selector to be used to extract the desired listing
 *                          items from the XHR response
 * @returns {object} Controller object to request the next set of posts
 *
 */


export default function createLoader(selector) {

  // Following WP structure for paged lists
  // Note: If working with a localhost:3000 server,
  // location.origin will return undefined when accessing via
  // the external IP (192.136.....)
  const { pathname, search } = window.location
  const buffer = createElement('div') // Buffer for temporarily storing returned HTML
  let loading = false
  let finished = false

  let currentPage = 1
  let loadedItems = collection(selector).map(item => item.dataset.postId)

  const params = extractURLParameters()

  const url = page => {
    params.paged = page
    return pathname + '?' + serializeObject(params)
  }

  const setUrlState = () => {

    const stateParams = Object.assign({}, params)
    delete stateParams['paged']
    const serializedParams = serializeObject(stateParams)
    const nextState = serializedParams.length ? pathname + '?' + serializedParams : pathname

    window.history.pushState({}, null, nextState)

  }

  const publishFinished = () => {
    finished = true
    EventBus.publish('ajax-loader:finished')
  }

  /**
   *
   * Check if there is a next page to be loaded.
   *
   * Doesn't update the currentpage counter
   *
   * @fires `ajax-loader:next-requested` when the next page is requested
   * @fires `ajax-loader:finished` when there's no next page to load
   * @fires 'ajax-loader:next-fetched' when the request for the next page is finished
   * 
   * This will also cause caching of the next response, making the 'Load More' button
   * load virtually instantly when clicked
   * 
  */ 
  const checkIfNext = () => {

    let nextPage = url(currentPage + 1)

    EventBus.publish('ajax-loader:next-requested')

    loadOnce(nextPage)
      .fail(publishFinished)
      .done(() => EventBus.publish('ajax-loader:next-fetched'))
      .always((res) => {

        buffer.innerHTML = res

        let results = collection(buffer.querySelectorAll(selector))
          // Remove WP 'Sticky' posts from subsequent pages
          .filter(item => filterLoaded(item.dataset.postId, [].concat(loadedItems)))

        EventBus.publish('ajax-loader:next-page-length', results.length)

        if(results.length == 0) {
          publishFinished()
        }
      })
  }

  // Do the initial check to see if there is a page #2
  checkIfNext()

  /**
   *
   * Load the next set of posts
   *
   * @fires `ajax-loader:loaded` - 'Loaded' event with the resulting posts
   * as the subscribe callback parameter
   *
   */

  const next = (query = false) => {

    if(loading || finished) {
      return
    }

    loading = true

    let nextUrl = url(++currentPage)

    setUrlState()
    
    // increment 'currentPage' and request it
    loadOnce(nextUrl)
      .then(res => {

        buffer.innerHTML = res

        let results = collection(buffer.querySelectorAll(selector))
          // Remove WP 'Sticky' posts from subsequent pages
          .filter(item => filterLoaded(item.dataset.postId, loadedItems))

        if(results.length) {
          EventBus.publish('ajax-loader:loaded', results, currentPage)
        }

        if(query && !results.length) {
          EventBus.publish('ajax-loader:no-results', query)
        }

        loading = false

      })

    checkIfNext()

  }

  const setQuery = (key, value) => {
    currentPage = 0
    loadedItems = []
    finished = false

    if(loading) {
      return
    }

    if(!value) {
      delete params[key]
    } else {
      params[key] = value
    }

    EventBus.publish('ajax-loader:query-set')

    next(params)
  }

  const getQuery = () => params

  return {
    next: next,
    setQuery: setQuery,
    getQuery: getQuery
  }
}