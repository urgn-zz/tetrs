Resources.loadConfig("config.json", function () {
    Animation.init();
    Game = {
        input: Input.getInstance(),
        field: new Field(),
        hover: new Hover(),
        info: new Info()
    };
    Game.field.newGame();
});
