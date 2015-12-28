/* Game field module */

function Field() {
    var me = this,
        config = Resources.Options,
        blocks_ = [],
        garbage_ = [],
        nitro = false,
        isGameOver = false,
        state,
        score = 0,
        nextBlock = Block.GetRandomType();

    /*** Main game flow ***/

    /**
     * @public
     * Starts new game
     */
    this.newGame = function() {
        state = "starting";
        score = 0;
        garbage_ = [];

        for (var i = 0; i < config.lines; i++) {
            garbage_[i] = [];
            for (var j = 0; j < config.columns; j++) {
                garbage_[i][j] = 0;
            }
        }

        blocks_.forEach(function(block, i){
            block.hide();
            delete blocks_[i];
        });

        isGameOver = false;
        SubPub.publish("info:updateScore", score);
        me.currentBlock = me.addBlock();
    };

    /**
     * @public
     * @returns {Block}
     * Adds new block to game field
     */
    me.addBlock = function() {
        var block = new Block(nextBlock);
        state = "falling";
        blocks_.push(block);
        nextBlock = Block.GetRandomType();
        SubPub.publish("info:updateNext", nextBlock);
        return block;
    };

    /**
     * @private
     * In game step realisation
     */
    function _dropAll(){
        blocks_.forEach(function(block) {
            if (!block.fallen && block.drop(garbage_)) {
                _markAsGarbage.call(me,block);
            }
        })
    }

    /**
     *
     * @param block
     * @private
     * Indexes block as garbage
     */
    function _markAsGarbage (block) {
        state = "calculating";
        block.parts.forEach(function(part){
            if (!isGameOver) {
                if (part.line < 0) {
                    me.gameOver();
                } else {
                    garbage_[part.line][part.col] = 1;
                }
            }
        });
        _evalResults();
        me.currentBlock = me.addBlock();
    }

    /**
     * @private
     * Calculates the result of the game step
     */
    function _evalResults() {
        garbage_.forEach(function(line, n){
            if (line.reduce(function(prev, current) {
                    return prev + current;
                }) === Resources.Options.columns) {
                score += 10;
                garbage_.splice(n,1);
                garbage_.unshift([]);
                for (var i = 0; i < Resources.Options.columns; i++) {
                    garbage_[0].push(0);
                }
                blocks_.forEach(function(block) {
                    block.burnLine(n);
                });
            }
        });
        SubPub.publish("info:updateScore", score);
    }

    /**
     * @public
     * Ends game
     */
    me.gameOver = function() {
        isGameOver = true;
        SubPub.publish("field:gameOver");
    };


    /** Event management **/

    SubPub.subscribe(this, "input:up", function() {
       this.currentBlock.rotate(garbage_);
    });

    SubPub.subscribe(this, "input:left", function() {
        this.currentBlock.move(-1, garbage_, Resources.Options.columns);
    });

    SubPub.subscribe(this, "input:right", function() {
        this.currentBlock.move(1, garbage_, Resources.Options.columns);
    });

    SubPub.subscribe(this, "input:downDown", function() {
        nitro = true;
    });

    SubPub.subscribe(this, "input:downUp", function() {
        nitro = false;
    });

    SubPub.subscribe(this, "field:newGame", this.newGame);

    /** MISC **/

    function _createBackground() {
        var bgHeight =  config.lines * config.cellHeight,
            bgWidth =  config.columns * config.cellWidth,
            backImage = Animation.getCanvas(bgWidth,bgHeight);

        backImage.ctx.fillStyle = "black";
        backImage.ctx.fillRect(0,0,bgWidth,bgHeight);

        return new Clip({
            x: 0,
            y: 0,
            height: bgHeight,
            width: bgWidth,
            image: backImage.canvas
        });
    }
    Animation.addClip(_createBackground());

    //The main control element of the game
    me.ticker = new Clip({
        visible: false,
        animate: function() {
            if (!isGameOver && (this.localTime >  config.fallDelay || nitro) && state === "falling") {
                this.localTime = 0;
                _dropAll();
            }
        }
    });
    Animation.addClip(me.ticker);
}