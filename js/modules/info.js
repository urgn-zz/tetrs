/* Score and next block preview */

Info = function() {
    var me = this,
        config = Resources.Options,
        h =  config.lines * config.cellHeight,
        w =  config.columns * config.cellWidth,
        nextLabelCanvas = Animation.getCanvas(w, 50),
        nextLabel = new Clip({
                x: w,
                y: 0,
                width: w,
                height: 50,
                image: nextLabelCanvas.canvas
            }),
        nextCanvas = Animation.getCanvas((w - 3*Resources.Options.cellWidth)/2, h/2 - 50),
        next = new Clip({
            x: w + ((w - nextCanvas.canvas.width)/2),
            y: 70,
            width: nextCanvas.canvas.width,
            height: h/2 - 50,
            image: nextCanvas.canvas
        }),
        scoreLabelCanvas = Animation.getCanvas(w, 50),
        scoreLabel = new Clip({
            x: w,
            y: Math.ceil(h/2),
            width: w,
            height: 50,
            image: scoreLabelCanvas.canvas
        }),
        scoreCanvas = Animation.getCanvas(w, 50),
        score = new Clip({
            x: w,
            y: Math.ceil(h/2) + 70,
            width: w,
            height: 50,
            image: scoreCanvas.canvas
        }),
        ctx;

    /** Init labels **/
    ctx = nextLabelCanvas.ctx;
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("NEXT", 25, 25);
    Animation.addClip(nextLabel);

    ctx = scoreLabelCanvas.ctx;
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("SCORE", 25, 25);
    Animation.addClip(scoreLabel);

    /** Add values **/
    Animation.addClip(next);
    Animation.addClip(score);


    /** Event management for update of values **/
    SubPub.subscribe(this, "info:updateScore", function(newScore){
        var ctx = scoreCanvas.ctx;
        ctx.clearRect(0, 0, scoreCanvas.canvas.width, scoreCanvas.canvas.height);
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.fillText(newScore, 25, 25);
    });

    SubPub.subscribe(this, "info:updateNext", function(next){
        var conf = Block.TYPE_MAP[next],
            ctx = nextCanvas.ctx;

        ctx.clearRect(0, 0, nextCanvas.canvas.width, nextCanvas.canvas.height);
        conf.structure.forEach(function(row, i){
            row.forEach(function(col, j) {
                if(col !== 1) return;
                ctx.drawImage(Resources.Graphics[conf.image],
                    j*Resources.Options.cellWidth,
                    i*Resources.Options.cellHeight,
                    Resources.Options.cellWidth,
                    Resources.Options.cellHeight);
            });
        });
    });
};