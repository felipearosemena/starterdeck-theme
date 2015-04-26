/*

  Media Queries

  Get JSON object exposed by sass on the body and expose it to JS


*/

(function() {

    // Cleans JSON object to prevent browser inconsistencies 
    // in handling different quotation marks from the ::before element
    function removeQuotes(string) {

        if (typeof string === 'string' || string instanceof String) {
            string = string.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, '');
        }
        return string;

    }

    // Retrieves the JSON
    function getBreakpointObj() {

        var style = null;

        if (window.getComputedStyle && window.getComputedStyle(document.head)) {
            style = window.getComputedStyle(document.head);
            style = style.fontFamily;

            var parsed = JSON.parse(removeQuotes(style));

            // Transform MQ strings into integers (removing px)
            for (var k in parsed) {
                parsed[k] = parseInt(parsed[k]);
            }

            return parsed;
        }

    }

    if (typeof window.mediaBreakpoints === 'undefined') {
        window.mediaBreakpoints = getBreakpointObj();
    } else {
        throw new Error('window.mediaBreakpoints is already taken');
    }

})();