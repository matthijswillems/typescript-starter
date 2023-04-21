var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/index.ts
var createSettings = (userSettings, container) => {
  console.log("creatingSettings from typescript plugin v2");
  const cubeContainer = document.querySelector(container);
  if (!cubeContainer)
    return false;
  const defaultSettings = {
    creativeContainerId: "#creative_container",
    container: cubeContainer,
    cubeClass: ".cube",
    height: cubeContainer.clientHeight,
    width: cubeContainer.clientWidth,
    currentIndex: 0,
    previousIndex: void 0,
    currentRotation: 0,
    direction: "x",
    perspectiveFactor: [0, 0, 3, 3, 1, 0.6, 0.45, 0.35, 0.3, 0.25, 0.2],
    threshold: 0.15,
    animationSpeed: 0.75,
    animationEase: "expo.out",
    // eslint-disable-next-line no-constant-condition
    autoSlider: gsap.timeline(),
    // eslint-disable-next-line no-constant-condition
    currentAnimation: gsap.timeline(),
    liveDrag: 1,
    forcedEnd: false,
    isAnimating: false,
    onClick: false,
    touchElement: void 0
  };
  const combinedSettings = __spreadValues(__spreadValues({}, defaultSettings), userSettings);
  const cubeElement = combinedSettings.container.querySelector(combinedSettings.cubeClass);
  if (!cubeElement)
    return false;
  return __spreadValues(__spreadValues({}, combinedSettings), {
    cube: cubeElement,
    faces: cubeElement.children,
    amountOfFaces: cubeElement.children.length,
    faceAngle: 360 / cubeElement.children.length
  });
};
var createCube = (container, userSettings) => {
  const cubeSettings = createSettings(userSettings, container);
  if (!cubeSettings) {
    throw "[CUBE PLUGIN] There's an error in your settings";
  } else {
    createCubeFaces(cubeSettings);
    createTouchEvents(cubeSettings);
    return cubeSettings;
  }
};
var calculateAdjacent = ({ faceAngle, width }) => width / 2 / Math.tan(faceAngle / 2 * (Math.PI / 180));
var createCubeFaces = (cubeSettings) => {
  const translate = calculateAdjacent(cubeSettings);
  cubeSettings.cube.style.transformStyle = "preserve-3d";
  gsap.set(cubeSettings.cube, { z: translate * -1 });
  cubeSettings.cube.style.touchAction = cubeSettings.direction === "x" ? "pan-x" : "pan-y";
  cubeSettings.cube.style.height = `${cubeSettings.height}px`;
  cubeSettings.cube.style.width = `${cubeSettings.width}px`;
  cubeSettings.container.style.perspective = `${cubeSettings.width * (cubeSettings.perspectiveFactor[cubeSettings.amountOfFaces] || cubeSettings.perspectiveFactor[cubeSettings.perspectiveFactor.length - 1])}px`;
  const colors = [
    "blue",
    "orange",
    "crimson",
    "purple",
    "pink",
    "blue",
    "orange",
    "crimson",
    "purple",
    "pink",
    "blue",
    "orange",
    "crimson",
    "purple",
    "pink"
  ];
  Array.from(cubeSettings.faces).forEach((element, index, array) => {
    const rotationAngle = cubeSettings.faceAngle * index;
    element.style.transform = `rotateY(${rotationAngle}deg) translate3d(0, 0, ${translate}px)`;
    element.style.backgroundColor = colors[index % (array.length - 1)];
    if (element.nodeType !== 1)
      return;
    element.style.touchAction = "none";
    element.style.pointerEvents = "none";
  });
};
var createTouchEvents = (cubeSettings) => {
  const hammer = new Hammer(cubeSettings.touchElement || cubeSettings.container);
  hammer.on("panmove panstart panend tap", function(event) {
    if (cubeSettings.isAnimating && !cubeSettings.forcedEnd)
      return;
    cubeSettings.currentAnimation.clear();
    const localX = Math.max(
      Math.min(event.deltaX / cubeSettings.width, 0.5),
      -0.5
    );
    switch (event.type) {
      case "panstart":
        break;
      case "panmove":
        cubeSettings.nextPredictedIndex = getIndex(
          localX > 0 ? -1 : 1,
          cubeSettings
        );
        fireEvent("nextPredictedUpdate", cubeSettings);
        const creativeContainer = document.querySelector(cubeSettings.creativeContainerId);
        if (creativeContainer && !creativeContainer.matches(":hover")) {
          hammer.stop(true);
          cubeSettings.forcedEnd = true;
          cubeAnimation("edgeRelease", cubeSettings, localX);
        } else {
          cubeAnimation("move", cubeSettings, localX);
        }
        break;
      case "panend":
        cubeAnimation("release", cubeSettings, localX);
        break;
    }
  });
};
var cubeAnimation = (type, cubeSettings, localX) => {
  if (type === "move") {
    cubeSettings.currentAnimation.add(
      gsap.to(cubeSettings.cube, {
        onStart: setAnimationState,
        onComplete: setAnimationState,
        onStartParams: [true, cubeSettings],
        onCompleteParams: [false, cubeSettings],
        duration: 0.01,
        rotationY: cubeSettings.currentRotation + cubeSettings.faceAngle * localX * cubeSettings.liveDrag
      })
    );
  } else {
    if (localX > cubeSettings.threshold) {
      cubeSettings.currentRotation = cubeSettings.currentRotation + cubeSettings.faceAngle;
      updateIndex(-1, cubeSettings);
    } else if (localX < cubeSettings.threshold * -1) {
      cubeSettings.currentRotation = cubeSettings.currentRotation - cubeSettings.faceAngle;
      updateIndex(1, cubeSettings);
    }
    cubeSettings.currentAnimation.add(
      gsap.to(cubeSettings.cube, {
        onStart: setAnimationState,
        onComplete: setAnimationState,
        onStartParams: [true, cubeSettings],
        onCompleteParams: [false, cubeSettings],
        duration: cubeSettings.animationSpeed,
        rotationY: cubeSettings.currentRotation,
        ease: cubeSettings.animationEase
      })
    );
  }
};
function setAnimationState(boolean, cubeSettings) {
  cubeSettings.isAnimating = boolean;
}
console.log("TODO: DIRECTION AANPASSEN");
var getIndex = (direction, cubeSettings) => {
  return cubeSettings.currentIndex + direction < 0 ? cubeSettings.amountOfFaces + cubeSettings.currentIndex + direction : (cubeSettings.currentIndex + direction) % cubeSettings.amountOfFaces;
};
var updateIndex = (direction, cubeSettings) => {
  cubeSettings.previousIndex = cubeSettings.currentIndex;
  cubeSettings.currentIndex = getIndex(direction, cubeSettings);
  fireEvent("cubeIndexUpdate", cubeSettings);
};
var fireEvent = (eventName, cubeSettings) => {
  let event;
  switch (eventName) {
    case "cubeIndexUpdate":
      event = new CustomEvent(eventName, {
        detail: {
          currentIndex: cubeSettings.currentIndex,
          previousIndex: cubeSettings.previousIndex,
          cubeSettings
        }
      });
      document.dispatchEvent(event);
      break;
    case "nextPredictedUpdate":
      event = new CustomEvent(eventName, {
        detail: {
          nextPredictedIndex: cubeSettings.nextPredictedIndex,
          cubeSettings
        }
      });
      document.dispatchEvent(event);
      break;
    default:
      break;
  }
};
export {
  createCube
};
