/* Overlay for GameOver */

Hover = function() {
    var me = this,
        config = Resources.Options,
        h =  config.lines * config.cellHeight,
        w =  config.columns * config.cellWidth,
        hoverImage,
        hoverClip,
        textImage,
        textClip,
        isShowing;

    /** Overlay background item **/
    hoverImage = Animation.getCanvas(h,w);
    hoverImage.ctx.fillStyle = "rgba(0,0,0,0.5)";
    hoverImage.ctx.fillRect(0,0,h,w);

    hoverClip = new Clip({
        x: 0,
        y: 0,
        width: w,
        height: h,
        image: hoverImage.canvas
    });

    /** Text message **/
    textImage = Animation.getCanvas(0,0);
    textImage.ctx.font = "30px Arial";
    textImage.canvas.height = 30*1.5;
    textImage.canvas.width = textImage.ctx.measureText("Press SPACE").width;
    textImage.ctx.fillStyle = "white";
    textImage.ctx.fillText("Press SPACE",0,textImage.canvas.height/2);

    textClip = new Clip({
        x: Math.ceil((w - textImage.canvas.width)/2),
        y: Math.ceil((h - textImage.canvas.height)/2),
        width: textImage.canvas.width,
        height: textImage.canvas.height,
        image: textImage.canvas
    });


    /** Event management **/
    SubPub.subscribe(this, "field:gameOver", function(x,y){
        Animation.addClip(hoverClip);
        Animation.addClip(textClip);
        isShowing = true;
    });

    SubPub.subscribe(this, "input:space", function(){
        if (isShowing) {
            Animation.removeClip(hoverClip);
            Animation.removeClip(textClip);
            isShowing = false;
            SubPub.publish("field:newGame");
        }
    });
};