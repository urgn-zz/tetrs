/**
 * Block TYPE_MAP
 * @Public
 * @Static
 * @Const
 */

Block.TYPE_MAP = {
    "i": {
        image: "cyan",
        structure: [
            [1],
            [1],
            [1],
            [1]
        ]
    },

    "l": {
        image: "orange",
        structure: [
            [1, 0],
            [1, 0],
            [1, 1]
        ]
    },
    "j": {
        image: "blue",
        structure: [
            [0, 1],
            [0, 1],
            [1, 1]
        ]
    },

    "t": {
        image: "purple",
        structure: [
            [1, 1, 1],
            [0 ,1, 0]
        ]
    },

    "s": {
        image: "green",
        structure: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    },

    "z": {
        image: "red",
        structure: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    },

    "o" : {
        image: "yellow",
        structure: [
            [1, 1],
            [1, 1]
        ]
    }
};

/**
 *
 * @returns {*}
 * @Static
 * Get random type from config
 */
Block.GetRandomType = function() {
    return Object.keys(Block.TYPE_MAP)[(Math.ceil(Object.keys(Block.TYPE_MAP).length * Math.random()) - 1)];
};

/**
 *  @class Block
 *  @constructor
 *  @param type
 */
function Block(type) {
    var me = this,
    conf = Block.TYPE_MAP[type || Block.GetRandomType()],
        struct = conf.structure,
        fieldLine = -struct.length,
        fieldCol = ~~((Resources.Options.columns - struct[0].length)/2);

    me.fallen = false;
    me.parts = [];
    me.rotationCount = 0;

    struct.forEach(function(row, i){
       row.forEach(function(col, j) {
           if(col !== 1) return;
           var part = new Clip({
               x: (j + fieldCol)*Resources.Options.cellWidth,
               y: (i + fieldLine)*Resources.Options.cellHeight,
               width: Resources.Options.cellWidth,
               height: Resources.Options.cellHeight,
               line: fieldLine + i,
               col: fieldCol + j,
               image: Resources.Graphics[conf.image]
           });
           Animation.addClip(part);
           me.parts.push(part);
       });
    });
}

/**
 * @public drop
 * moves all parts of the block down
 */
Block.prototype.drop = function(garb) {
    var canDoIt = true;
    this.parts.forEach(function(part) {
       if ((part.line > -1) && ((garb.length <= part.line + 1) ||
            (garb.length >= part.line + 1) && (garb[part.line + 1][part.col] === 1))){
            canDoIt = false;
        }
    });
    if (canDoIt) {
        this.parts.forEach(function(part) {
            part.line += 1;
            part.y = part.line*Resources.Options.cellHeight;
        });
    } else {
        this.fallen = true;
    }
    return !canDoIt;
};

/**
 * Moves block horisontally
 * @param direction may be +1 or -1
 * @param garb field garbadge map
 */
Block.prototype.move = function(direction, garb) {
    if (!this._isValidateStruct(garb, direction, 0)) {
        return;
    }
    this.parts.forEach(function(part) {
        part.col += 1*direction;
        part.x += Resources.Options.cellWidth*direction;
    });
};

/**
 * Rotates block
 * @param garb field garbadge map
 */
Block.prototype.rotate = function (garb) {
    var dl = this.bottomEdge,
        dc = this.leftEdge,
        rc = this.rotationCount,
        canDoIt = true;
    this.parts.forEach(function(part) {
        var l = part.line;
        if ((garb[dl + (part.col - dc) - 1][ dc + (dl - l)] === 1) ||
            (dc + (dl - l) < 0) || (dc + (dl - l) >= Resources.Options.columns)
            || (dl + (part.col - dc) - 1) >  Resources.Options.lines) {
            canDoIt = false;
        }
    });

    if (!canDoIt) {
        return;
    }
    var me = this;
    this.parts.forEach(function(part) {
        var l = part.line;
        part.line = dl + (part.col - dc) - 1;
        part.y = Resources.Options.cellWidth*part.line;
        part.col = dc + (dl - l);
        if (rc % 2 === 0) {
            part.line -= 1;
        }
        part.x = Resources.Options.cellHeight*part.col;
    });
    this.rotationCount += 1;
};

/**
 * Checks new block position on collisions with garbage
 * @param garb
 * @param colOffset
 * @param rowOffset
 * @returns {boolean}
 * @private
 */
Block.prototype._isValidateStruct = function(garb, colOffset, rowOffset) {
    var canDoIt = true;
    if (
        (this.leftEdge + colOffset < 0 || this.rightEdge + colOffset >= Resources.Options.columns ||
        this.bottomEdge + rowOffset >= Resources.Options.lines)) {
        return false;
    }
    this.parts.forEach(function(part) {
        if ((part.line > -1) && garb[part.line + rowOffset][part.col + colOffset] === 1){
            canDoIt = false;
        }
    });
    return canDoIt;
};

/**
 * Removes the line from block
 * If needed collapse it
 * @param line the number of line
 */
Block.prototype.burnLine = function(line) {
    var me = this;
    me.parts.forEach(function(part, i) {
       if (part.line === line) {
           Animation.removeClip(part);
           delete me.parts[i];
       } else if (part.line < line) {
           part.line += 1;
           part.y += Resources.Options.cellHeight;
       }
    });
};

/**
 * Removes block from render
 */
Block.prototype.hide = function() {
    var me = this;
    me.parts.forEach(function(part) {
        Animation.removeClip(part);
    });
};

/**
 * Calculated properties of block
 */
Object.defineProperties(Block.prototype, {
    "bottomEdge" : {
        get: function(){
            var me = this;
            return Math.max.apply(null, this.parts.map(function(part) {
                return part.line;
            }));
        }
    },
    "leftEdge" : {
        get: function(){
            var me = this;
            return Math.min.apply(null, this.parts.map(function(part) {
                return part.col;
            }));
        }
    },
    "rightEdge" : {
        get: function(){
            var me = this;
            return Math.max.apply(null, this.parts.map(function(part) {
                return part.col;
            }));
        }
    }
});