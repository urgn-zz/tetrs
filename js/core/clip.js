/**
 * @class Clip
 * @param config
 * @constructor
 *
 * Reffers to the configuration of the drawable item
 * Simpler analogue of PIXI.Sprite
 */

function Clip(config) {
    var me = this;
    Object.keys(config).forEach(function(key) {
            me[key] = config[key];
        }
    )
}

Clip.prototype = {
    x: 0,
    y: 0,
    z: 0,
    height: 0,
    width: 0,
    image: "",
    localTime: 0,
    visible: true,
    tick: function(dt) {
        this.localTime += dt;
    },
    animate: function() {

    }
};