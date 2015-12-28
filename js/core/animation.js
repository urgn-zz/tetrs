/**
 * @static
 * @class Animation
 * The main render loop of the game,
 * provides necessary level of abstraction
 * if we want to replace canvas by something else
*/

Animation = {
    /**
     * @private clips
     * stores all playable items
     */
    clips_: [],

    /**
     * @public init
     * integrates HTML5 Canvas into the game
     * and starts rendering
     */
    init: function() {
        this.canvas = document.getElementById("scene");
        this.canvas.width = Resources.Options.columns*Resources.Options.cellWidth*2;
        this.canvas.height = Resources.Options.lines*Resources.Options.cellHeight;
        this.ctx = this.canvas.getContext("2d");
        requestAnimationFrame(this._draw.bind(this));
    },

    /**
     * @public
     * provides canvas for custom drawing by modules
     * example: look at the background of field module
     */
    getCanvas: function(width, height) {
        var canavs = document.createElement("canvas"),
            ctx;
        canavs.width = width;
        canavs.height = height;
        ctx = canavs.getContext("2d");
        return {
            canvas: canavs,
            ctx: ctx
        }
    },

    /**
     * @private _draw
     * Main render function
     */
    _draw: function(dt) {
        this.time = dt - (this.previousFrameTime || 0);
        this.previousFrameTime = dt;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clips_.forEach(this._drawClip.bind(this));
        requestAnimationFrame(this._draw.bind(this));
    },

    /**
     * @private _drawClip
     * Draws each clip according to config
     * may be extended with clip configs
     * for example add rotation or alpha
     */
    _drawClip: function(clip) {
        clip.tick(this.time);
        clip.animate();
        if (clip.visible) {
            this.ctx.drawImage(clip.image, clip.x, clip.y, clip.width, clip.height);
        }
    },

    /**
     * @public addClip
     * @param clip
     * Adds clip config to the render
     */
    addClip: function(clip) {
        this.clips_.push(clip);
    },

    /**
     * @public removeClip
     * @param clip
     * Removes clip from the render
     */
    removeClip: function(clip) {
        this.clips_.splice(this.clips_.indexOf(clip),1);
    }
};