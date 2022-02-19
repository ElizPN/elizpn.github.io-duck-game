var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      //   debug: true,
      gravity: { y: 200 },
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
var cursors;
var player;
var bread;
var text;
var breadGroup;
var quack;
var emitter;

var game = new Phaser.Game(config);

function preload() {
  //   this.load.setBaseURL("http://labs.phaser.io");
  this.load.image("background", "girls.png");
  //   this.load.image("logo", "assets/sprites/phaser3-logo.png");
  this.load.image("logo", "duck.png");
  //   this.load.image("red", "assets/particles/red.png")
  this.load.image("bread", "bread.png");
  this.load.audio("quack", ["duck-quack.mp3"]);
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();
  this.add.image(400, 300, "background");

  var particles = this.add.particles("red");

  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: "ADD",
  });

  player = this.physics.add.image(100, 100, "logo");
  player.setVelocity(100, 100);
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);

  emitter.startFollow(player);

  quack = this.sound.add("quack", { loop: false });

  let removeBread = (duck, food) => {
    console.log("transparent");
    food.destroy();
    quack.play();
    emitter.emit("addBread");
  };

  emitter = new Phaser.Events.EventEmitter();

  var addBreadHandler = () => {
    var x = Phaser.Math.Between(50, 750);
    var y = Phaser.Math.Between(50, 550);
    bread = this.physics.add.image(x, y, "bread");
    bread.setCollideWorldBounds(true);

    this.physics.add.overlap(player, bread, removeBread);
  };
  addBreadHandler();
  emitter.on("addBread", addBreadHandler, this);
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else if (cursors.up.isDown) {
    player.setVelocityY(-160);
  } else if (cursors.down.isDown) {
    player.setVelocityY(160);
  } else {
    player.setVelocityX(0);
  }
  if (player.body.velocity.x < 0) {
    player.flipX = false;
  }
  if (player.body.velocity.x > 0) {
    player.flipX = true;
  }
}
