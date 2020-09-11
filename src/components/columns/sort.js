(function () {
  var timeouts = [];
  var messageName = "zero-timeout-message";

  // Like setTimeout, but only takes a function argument.  There's
  // no time argument (always zero) and no arguments (you have to
  // use a closure).
  function setZeroTimeout(fn) {
    timeouts.push(fn);
    window.postMessage(messageName, "*");
  }

  function handleMessage(event) {
    if (event.source === window && event.data === messageName) {
      event.stopPropagation();
      if (timeouts.length > 0) {
        var fn = timeouts.shift();
        fn();
      }
    }
  }

  window.addEventListener("message", handleMessage, true);

  // Add the one thing we want added to the window object.
  window.setZeroTimeout = setZeroTimeout;
})();
class Sort {
  constructor() {
    this.array = null;
    this.speed = 1;
    this.width = window.innerWidth / 25; //25 Columns (-20%)
    this.animations = [];
    this.sorting = false;
    this.sorted = false;
    this.setSorting = null;
    this.currentSort = this.bubble;
    this.setInformation = null;
    this.setFreezed = null;
    this.currentAlgorithmName = "bubble";
    this.algorithms = [
      {
        bigO: "O(2n)",
        description:
          "The Bubble sort algorithm is one of the simplest sort Algorithms",
        name: "bubble",
        function: this.bubble,
      },
      {
        bigO: "O(4n)",
        description: "Insertion sort, great sort",
        name: "insertion",
        function: this,
      },
    ];
  }
  checkSorted() {
    for (let i = 0; i < this.array.length; i++) {
      if (this.array[i + 1] === undefined) return true;
      if (this.array[i].height <= this.array[i + 1].height) {
        continue;
      } else {
        return false;
      }
    }
  }
  switch(c1, c2) {
    const speed = this.speed;
    return new Promise((resolve, reject) => {
      // this.array includes the prototype of the Column class
      let column1 = this.array[0].getColumnByIndex(this.array, c1);
      let column2 = this.array[0].getColumnByIndex(this.array, c2);
      if (column1.width < 5) {
        window.setZeroTimeout(() => {
          this.array[0].switch(column1, column2);
          if (this.sorting === false) return;
          return resolve(true);
        });
      } else {
        var animation1 = column1._animate("left");
        var animation2 = column2._animate("right");
        animation1.playbackRate = speed;
        animation2.playbackRate = speed;
        animation1.play();
        animation2.play();
        this.animations = [animation1, animation2];
        animation2.onfinish = () => {
          this.array[0].switch(column1, column2);
          if (this.sorting === false) return;
          return resolve(true);
        };
      }
    });
  }
  changePlaybackRate(rate) {
    for (let animation of this.animations) {
      animation.playbackRate = rate;
    }
  }
  pauseAnimations() {
    for (let animation of this.animations) {
      animation.pause();
    }
  }
  continueAnimations() {
    for (let animation of this.animations) {
      animation.play();
    }
  }
  abruptStop() {
    this.sorting = false;
    this.pauseAnimations();
    this.setSorting(false);
  }
  stop() {
    return new Promise((resolve, reject) => {
      this.sorting = false;

      this.setSorting(false);
      if (this.animations.length < 1) resolve(false);
      this.animations[0].onfinish = () => {
        resolve(true);
      };
    });
  }
  // high level wrapper for a switch of columns in the Columns Class
  // animates and switches height

  switchSort(algorithm) {
    this.currentSort = algorithm;
  }
  async sort() {
    return await this.currentSort();
  }
  async bubble() {
    this.sorting = true;
    let arr = this.array;
    for (let j = 0; j < arr.length; j++) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i + 1] === undefined) continue;
        if (arr[i].height > arr[i + 1].height) {
          if (this.sorting === false) return;
          await this.switch(i, i + 1);
        }
      }
    }
    this.sorting = false;
    this.sorted = true;
    for (let v of this.array) {
      v.setBlink(true);
    }
    return arr;
  }
}
export default Sort;
