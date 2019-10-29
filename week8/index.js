/**
 * Student: Andrew likes trifle -> drewfle
 *
 */

/**
 * Custom classes -------------------------------------------------------------
 */

/**
 * The Util class. Since we're instructed to explore ES6 class syntax, we can group utility
 * functions inside a Util class as static methods.
 */
class Util {
  /**
   * ES6 static keyword: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
   * ES6 getter syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
   */
  static get maxViewportSize() {
    return Math.max(windowWidth, windowHeight);
  }
}

/**
 * The base particle class.
 */
class Particle {
  // About ES6 default parameters: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
  constructor(x, y, acceleration = 1) {
    // Member variables
    this.baseSpeed = 2;
    this.acceleration = acceleration;

    // The required class member variables needed for this assignment.
    this.size = random(1, Util.maxViewportSize / 77);
    this.color = color(random(["yellow", "cyan"])); // random also takes an array
    this.position = createVector(x, y);
    this.speed = this.initSpeed();
  }

  /**
   * Initializes or resets speed.
   */
  initSpeed() {
    return createVector(
      random(-this.baseSpeed, this.baseSpeed),
      random(-this.baseSpeed, this.baseSpeed)
    );
  }

  /**
   * Renders a particle.
   */
  render() {
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.size);
  }

  /**
   * Accelerates a particle.
   */
  accelerate() {
    this.position.add(this.speed);
  }
}

/**
 * A particle class that knows how to run away.
 * More about inheritance and the extends keyword: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends
 */
class RunawayParticle extends Particle {
  // Omitted constructor. Derived class constructor calls super by default: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor

  /**
   * Creates runaway effects.
   */
  runaway() {
    this.pleaseDontGo();
    this.feelsTired();
    this.accelerate();
  }

  /**
   * Don't really want them to go away.
   */
  pleaseDontGo() {
    if (
      this.position.x > windowWidth - translateOffset.x ||
      this.position.x < -translateOffset.x ||
      this.position.y > windowHeight - translateOffset.y ||
      this.position.y < -translateOffset.y
    ) {
      this.color = color(random(["yellow", "cyan"]));
      this.position = createVector(0, 0);
      this.speed.mult(this.acceleration);
    }
  }

  /**
   * If a runaway particle runs too fast, it gets too tired so it slows down.
   */
  feelsTired() {
    const threshold = 500;
    if (this.speed.x > threshold || this.speed.y > threshold) {
      this.color = color(random(["red", "blue"]));
      this.speed = this.initSpeed();
    }
  }
}

/**
 * A class maintains a pool of particles.
 */
class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  /**
   * Encapsulates ParticleSystem-specific configuration to be called in the
   * global setup hook.
   * @param {number} particleNumber
   */
  setup(particleNumber) {
    for (let i = 0; i < particleNumber; i++) {
      this.particles.push(new RunawayParticle(0, 0, random(1, 100)));
    }
  }

  /**
   * Encapsulates ParticleSystem-specific routine to be called in the global
   * draw hook.
   */
  draw() {
    translate(translateOffset.x, translateOffset.y);
    background("darkblue");
    noStroke();
    this.particles.forEach(particle => {
      particle.render();
      particle.runaway();
    });
  }
}

/**
 * Global constants and variables --------------------------------------------
 */
const translateOffset = {
  x: undefined,
  y: undefined
};
let particleSystem;

/**
 * P5.js global hooks ---------------------------------------------------------
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  translateOffset.x = windowWidth / 2;
  translateOffset.y = windowHeight / 2;

  const particleNumbers = Util.maxViewportSize / 3;
  particleSystem = new ParticleSystem();
  particleSystem.setup(particleNumbers);
}

function draw() {
  particleSystem.draw();
}
