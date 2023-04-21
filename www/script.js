import { createCube } from './index.js';

//TODO: OnCreateFace optioneel maken, met aanwwijsbare slide ID.
//TODO: CreateCustomSlide met slideIndex, lege div.
console.log('creating settings from script.js v2');
var myCube = createCube('#cubeContainer2', {
  id: 'myFirstCube',

  animationSpeed: 0.5,
  // Uncomment for demos
  // perspectiveFactor: [2],
  // liveDrag: false,
  // animationEase: 'elastic.out(2, 1)',
  touchElement: document.querySelector('#touchElement'),
});

document.addEventListener('cubeIndexUpdate', function (event) {
  console.log('my event', event.detail);
});

document.addEventListener('nextPredictedUpdate', function (event) {
  if (event.detail.nextPredictedIndex !== event.detail.previousIndex)
    console.log('my event', event.detail);
});

// Uncomment for demo
gsap.set(myCube.container, { scale: 0.5 });
gsap.fromTo(
  myCube.container,
  2.5,
  { scale: 0.1 },
  { scale: 0.85, ease: 'expo.inOut' },
);
gsap.fromTo(
  myCube.cube,
  2.5,
  { rotationY: -360 },
  { rotationY: 0, ease: 'power2.out' },
);
gsap.fromTo(
  myCube.cube,
  2.5,
  { rotationX: -90 },
  { rotationX: 0, ease: 'power2.out' },
);

// var mySecondCube = createCube("#cubeContainer3", {
//   id: "mySecondCube",
// });

console.log('myCube', myCube);

/**
 * Template Name
 * @Owner Matthijs Willems
 * @Date 2022/01/31
 */

var content, eeziCube, autoSlideTimer;
var subscribeFired = false;

content = {
  cssOverride: {
    type: 'text',
    value: '',
  },
  verticalOrientation: {
    type: 'text',
    value: '',
  },
  imageStrip: {
    type: 'image',
    value:
      'https://assets.lemonpi.io/a/10/7ce0cf0195d208883d1079c4f4e61cbd.png',
  },
  customClickUrls: {
    type: 'collection',
    value: [
      {
        clickUrl: {
          value: 'www.google.nl/#matthijs',
        },
      },
    ],
  },
  showArrows: {
    type: 'text',
    value: '',
  },
  defaultClickUrl: {
    type: 'click',
    value: 'https://www.google.com',
  },
};

startBanner();

var globalSettings;

function startBanner() {
  createCubeCode();

  var allowClick = false;
  $('#creative_container')
    .on('mousedown', () => (allowClick = true))
    .on('mousemove', () => (allowClick = false))
    .on('mouseup', () => {
      if (allowClick)
        window.open('https://www.google.nl/#' + globalSettings.currentIndex);
    });

  // createArrows();
  // setTimeout(stylingOverride, 0);
  // setTimeout(disableDraggable, 0);
}

function createCubeCode() {
  var containers = document.querySelectorAll('#cubeContainer1');
  globalSettings = {
    direction: 'x',
    width: 320,
    height: 240,
    amountOfFaces: 4,
    currentIndex: 0,
    currentRotation: 0,
    isAnimating: false,
    ANIMATION_SPEED: 0.75,
    THRESHOLD: 0.15,
    autoSlider: gsap.timeline({ repeat: -1, repeatDelay: 3 }),
    onClick: false,
  };

  $('#cubeContainer1 .front').css({
    'background-color': '#ffaaaa',
    transform: `translate3d(0, 0, ${globalSettings.width / 2}px)`,
  });

  $('#cubeContainer1 .back').css({
    'background-color': 'red',
    transform: `rotateY(180deg) translate3d(0, 0, ${
      globalSettings.width / 2
    }px)`,
  });

  $('#cubeContainer1 .left').css({
    'background-color': '#aaffaa',
    transform: `rotateY(-90deg) translate3d(0, 0, ${
      globalSettings.width / 2
    }px)`,
  });

  $('#cubeContainer1 .right').css({
    'background-color': '#aaffff',
    transform: `rotateY(90deg) translate3d(0, 0, ${
      globalSettings.width / 2
    }px)`,
  });

  $('#cubeContainer1 > .cube').css({
    width: globalSettings.width,
    height: globalSettings.height,
    'transform-style': 'preserve-3d',
    transform: `translate3d(0, 0, ${globalSettings.width / -2}px)`,
    touchAction: 'pan-x',
  });

  $('.cube > *').css({
    touchAction: 'none',
    pointerEvents: 'none',
  });

  $('#creative_container')
    .css({
      'touch-action': 'none',
    })
    .on('mousemove touchmove', function () {
      $('#creative_container .version').html('touched');
    })
    .append(
      "<div class='version' style='position: absolute; top: 5px; left: 5px'>1</div>",
    );

  //TODO: Autoslider loopstop
  gsap.delayedCall(15, function () {
    globalSettings.autoSlider.pause();
  });

  // Create cube transformations
  containers.forEach(function (value, index, nodeList) {
    var cubeSettings = {
      container: value,
      cube: value.querySelector('.cube'),
      width: value.querySelector('.cube').clientWidth,
      forcedEnd: false,
    };

    // Create click event if wanted, default is off
    if (globalSettings.onClick && typeof globalSettings.onClick === 'function')
      cube.addEventListener('click', () =>
        globalSettings.onClick(globalSettings.currentIndex),
      );

    // Create touch events
    var hammer = new Hammer(cubeSettings.container);

    hammer.on('panmove panstart panend tap', function (event) {
      if (globalSettings.isAnimating && !cubeSettings.forcedEnd) return;
      var localX = Math.max(
        Math.min(event.deltaX / cubeSettings.width, 0.5),
        -0.5,
      );

      switch (event.type) {
        case 'panstart':
          break;

        case 'panmove':
          globalSettings.nextPredictedIndex = getIndex(localX > 0 ? '<' : '>');

          if (
            !document.querySelector('#creative_container').matches(':hover')
          ) {
            hammer.stop();
            cubeSettings.forcedEnd = true;

            // Spelen met Threshold waarde
            cubeAnimation('edgeRelease', cubeSettings, localX, event);
          } else {
            cubeAnimation('move', cubeSettings, localX, event);
          }
          break;

        case 'panend':
          cubeAnimation('release', cubeSettings, localX, event);
          break;
      }
    });

    globalSettings.autoSlider.add(() => autoAnimation(cubeSettings, hammer), 2);
  });

  // eeziCube = pluginApis.cube.create({
  //   onClick: clickOut,
  //   imageUrl: getImageUrl(),
  //   swipeIntervalTime: (content.swipeIntervalTime && content.swipeIntervalTime.value) || undefined,
  //   orientation: content.verticalOrientation && content.verticalOrientation.value && content.verticalOrientation.value.isNotFalse() ? "vertical" : undefined,
  // });
  // autoSlideTimer = setTimeout(function () {
  //   eeziCube.autoSwiper._paused = content.swipeIntervalTime && content.swipeIntervalTime.value && content.swipeIntervalTime.value.isNotFalse() ? true : false;
  // }, (content.swipeIntervalTime && content.swipeIntervalTime.value) || 3);

  function cubeAnimation(type, { cube }, localX, event) {
    if (type === 'move') {
      gsap.to(cube, {
        onStart: setAnimationState(true),
        onComplete: setAnimationState(false),
        rotationY: globalSettings.currentRotation + 90 * localX,
      });
    } else {
      if (localX >= globalSettings.THRESHOLD) {
        globalSettings.currentRotation = globalSettings.currentRotation + 90;
        updateIndex('<');
      } else if (localX <= -globalSettings.THRESHOLD) {
        globalSettings.currentRotation = globalSettings.currentRotation - 90;
        updateIndex('>');
      }
      // Release animation TODO: Kijken of dit samengevoegd kan worden
      gsap.to(cube, {
        onStart: setAnimationState(true),
        onComplete: setAnimationState(false),
        duration: globalSettings.ANIMATION_SPEED,
        rotationY: globalSettings.currentRotation,
        ease: 'expo.out',
      });
    }
  }

  function autoAnimation({ cube }, hammer) {
    if (
      globalSettings.isAnimating ||
      cube.matches(':hover') ||
      document.querySelector('#creative_container').matches(':hover')
    )
      return {};

    return gsap.to(cube, {
      duration: globalSettings.ANIMATION_SPEED,
      rotationY: function () {
        updateIndex('>');
        return gsap.getProperty(cube, 'rotationY') - 90;
      },
      ease: 'expo.out',
      onStart: setAnimationState(true),
      onComplete: function () {
        setAnimationState(false);
        globalSettings.currentRotation = gsap.getProperty(cube, 'rotationY');
      },
    });
  }

  function setAnimationState(boolean) {
    globalSettings.isAnimating = boolean;
  }

  function getIndex(direction) {
    if (direction === '<')
      return globalSettings.currentIndex < 1
        ? globalSettings.amountOfFaces +
            ((globalSettings.currentIndex - 1) % globalSettings.amountOfFaces)
        : (globalSettings.currentIndex - 1) % globalSettings.amountOfFaces;
    return (globalSettings.currentIndex + 1) % globalSettings.amountOfFaces;
  }

  function updateIndex(direction) {
    globalSettings.currentIndex = getIndex(direction);
  }
}

function createArrows() {
  if (
    content.showArrows &&
    content.showArrows.value &&
    content.showArrows.value.isNotFalse()
  )
    $('#cube_controls').css('display', 'flex');

  // Vertical orientation arrows
  if (
    content.verticalOrientation &&
    content.verticalOrientation.value &&
    content.verticalOrientation.value.isNotFalse()
  ) {
    $('#cube_controls').addClass('vertical');
  }
}

function getImageUrl() {
  if (content.imageStrip && content.imageStrip.value) {
    return content.imageStrip.value;
  } else {
    return 'https://assets.lemonpi.io/a/10/1f4a15c006c27193329ed220e16ce91f.png';
  }
}

function disableDraggable() {
  if (content.disableDraggable && content.disableDraggable.value) {
    var device = content.disableDraggable.value.toLowerCase();

    if (
      (device === 'iphone' && pluginApis.check.ios()) ||
      (device === 'android' && pluginApis.check.android()) ||
      (device === 'mobile' && pluginApis.check.mobile()) ||
      (device === 'desktop' && pluginApis.check.desktop()) ||
      (device === 'in-app' && pluginApis.check.inApp()) ||
      device === 'all'
    ) {
      eeziCube.draggable.disable();
      $('#gesture').remove();
    }
  }
}

function clickOut(currentSlideIndex) {
  window.open('https://www.google.nl/matthijs');
  // if (content.customClickUrls && content.customClickUrls.value && content.customClickUrls.value[currentSlideIndex]) {
  //   window.dispatchEvent(
  //     new CustomEvent("lemonpi.interaction/click", {
  //       detail: {
  //         placeholder: ["customClickUrls", currentSlideIndex, "clickUrl"],
  //       },
  //     })
  //   );
  // } else {
  //   window.dispatchEvent(
  //     new CustomEvent("lemonpi.interaction/click", {
  //       detail: {
  //         placeholder: "defaultClickUrl",
  //       },
  //     })
  //   );
  // }
}

function stylingOverride() {
  var styling =
    content.cssOverride &&
    content.cssOverride.value &&
    JSON.parse(content.cssOverride.value);
  if (!styling) return;
  for (var prop in styling) {
    if (Object.prototype.hasOwnProperty.call(styling, prop)) {
      $(prop).css(styling[prop]);
    }
  }
}

String.prototype.isNotFalse = function (a) {
  checkString = this.toString();

  if (
    checkString === 'FALSE' ||
    checkString === 'false' ||
    checkString === 'off' ||
    checkString === 'OFF'
  )
    return false;
  return true;
};
