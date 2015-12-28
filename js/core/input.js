/**
 * @class Input
 * @singleton
 * Logical layer beetween HTML listeners
 * and custom game events
 */

Input = (function() {
    var instance = null;
    /**
     * @private inputModule
     * @constructor
     * The body of the Input class
     */
    function inputModule() {

        var onKeyDown = function(e) {
                switch (e.keyCode) {
                    case 37 :
                        SubPub.publish("input:left");
                        break;
                    case 39 :
                        SubPub.publish("input:right");
                        break;
                    case 40 :
                        SubPub.publish("input:downDown");
                        break;
                }
            },
            onKeyUp = function(e) {
                switch (e.keyCode) {
                    case 32 :
                        SubPub.publish("input:space");
                        break;
                    case 38 :
                        SubPub.publish("input:up");
                        break;
                    case 40 :
                        SubPub.publish("input:downUp");
                        break;
                }
            };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    }

    /**
     * @public getInstance
     * @returns Input instance
     * Provides singleton functionality
     */
    function getInstance() {
        if( ! instance ) {
            instance = new inputModule();
        }
        return instance;
    }

    return {
        getInstance : getInstance
    };

}) ();