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
var enemy;
var bread;
var text;
var breadGroup;
var quack;
var emitter;
var x;
var y;

var game = new Phaser.Game(config);

function preload() {
  this.load.image("background", "girls.png");
  this.load.image("player", "duck.png");
  //   this.load.image("red", "assets/particles/red.png")
  this.load.image("bread", "bread.png");
  this.load.audio("quack", ["duck-quack.mp3"]);
  this.load.image("enemy", "pink_duck.png");
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

  player = this.physics.add.image(100, 100, "player");
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

  enemy = this.physics.add.image(700, 100, "enemy");
  enemy.setCollideWorldBounds(true);

  var addBreadHandler = () => {
    var x = Phaser.Math.Between(50, 750);
    var y = Phaser.Math.Between(50, 550);
    bread = this.physics.add.image(x, y, "bread");
    bread.setCollideWorldBounds(true);

    this.physics.add.overlap(player, bread, removeBread);
    console.log(x, y);

    let removeBread2 = (enemy, food) => {
      console.log("duc");
      food.destroy();
      emitter.emit("addBread");
      console.log("restar bread");
    };
    this.physics.add.overlap(enemy, bread, removeBread2);
    this.physics.moveToObject(enemy, bread, 100);
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
