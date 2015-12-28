/**
 * @static SubPub
 * Realisation of subscribe/publish pattern
 * The custom Event system of the game
 */

SubPub = (function() {
    /**
     * @private map
     * The event-callback map
     */
    var map = {};

    return {

        /**
         * @public subscribe
         * @param context
         * @param event
         * @param callback
         * Used by modules to subsribe on custom events
         */
        subscribe: function(context, event, callback) {
            if (!map[event]) {
                map[event] = [];
            }
            map[event].push({
                callback: callback,
                context: context
            });
        },

        /**
         * @public publish
         * @param event
         * Used by modules to fire custom events
         */
        publish : function(event) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (map[event]) {
                map[event].forEach(function(cb) {
                    cb.callback.apply(cb.context, args);
                });
            }
        }
    };
})();