//TODO: NEXT AND PREVIOUS CALL FUNCTIE MAKEN

type indexDirection = 1 | -1;

type userSettings = {
  creativeContainerId: string;
  container: HTMLElement;
  cubeClass: string;
  height: number;
  width: number;
  currentIndex: number;
  previousIndex?: number;
  currentRotation: number;
  direction: "x" | "y";
  perspectiveFactor: number[];
  threshold: number;
  animationSpeed: number;
  //TODO: DEZE CHECKEN EASE FUNCTIONS
  animationEase: string;
  autoSlider: GSAPTimeline;
  currentAnimation: GSAPTimeline;
  liveDrag: number;
  forcedEnd: boolean;
  isAnimating: boolean;
  //TODO: ONCLICK DOE IK NU NOG NIKS MEE DENK IK TOCH
  onClick: false;
  //TODO: DEZE OOK EVEN CHECKEN
  touchElement?: HTMLElement,
}

type calculatedSettings = {
  cube: HTMLElement;
  faces: HTMLElement[];
  amountOfFaces: number;
  faceAngle: number;
  nextPredictedIndex?: number;
};

type allSettings = userSettings & calculatedSettings;

type events = "cubeIndexUpdate" | "nextPredictedUpdate";

const createSettings = (userSettings: userSettings, container: string): allSettings | false => {
  console.log('creatingSettings from typescript plugin v2');
  const cubeContainer: HTMLElement | null = document.querySelector(container);

  if (!cubeContainer) return false;

  const defaultSettings: userSettings = {
    creativeContainerId: "#creative_container",
    container: cubeContainer,
    cubeClass: ".cube",
    height: cubeContainer.clientHeight,
    width: cubeContainer.clientWidth,
    currentIndex: 0,
    previousIndex: undefined,
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
    touchElement: undefined,
  };

  const combinedSettings = { ...defaultSettings, ...userSettings }

  const cubeElement = combinedSettings.container.querySelector(combinedSettings.cubeClass) as calculatedSettings["cube"]

  if (!cubeElement) return false;

  return {
    ...combinedSettings, ...{
      cube: cubeElement,
      faces: cubeElement.children as unknown as HTMLElement[],
      amountOfFaces: cubeElement.children.length,
      faceAngle: 360 / cubeElement.children.length,
    }
  }
}

const checkForErrors = (settings: allSettings): boolean => {
  // Check if all needed properties are available, else, throw error
  if (!settings.container) {
    console.warn('The specified container can not be found, cube is not created');
    return false;
  }
  if (!settings.currentAnimation || !settings.autoSlider) {
    console.warn('GSAP dependency wasn\'t found, please add it to your project before using the Cube Plugin ');
    return false;
  }
  return true;
}

const createCube = (container: string, userSettings: userSettings): allSettings => {
  const cubeSettings = createSettings(userSettings, container);

  if (!cubeSettings) {
    throw '[CUBE PLUGIN] There\'s an error in your settings';
  } else {
    createCubeFaces(cubeSettings);
    createTouchEvents(cubeSettings);
    return cubeSettings;
  }
};

const calculateAdjacent = ({ faceAngle, width }: allSettings): number =>
  width / 2 / Math.tan((faceAngle / 2) * (Math.PI / 180));

const createCubeFaces = (cubeSettings: allSettings) => {
  // Calculate translation
  const translate = calculateAdjacent(cubeSettings);

  // Set cube styling
  cubeSettings.cube.style.transformStyle = "preserve-3d";
  gsap.set(cubeSettings.cube, { z: translate * -1 });
  cubeSettings.cube.style.touchAction =
    cubeSettings.direction === "x" ? "pan-x" : "pan-y";
  cubeSettings.cube.style.height = `${cubeSettings.height}px`;
  cubeSettings.cube.style.width = `${cubeSettings.width}px`;
  cubeSettings.container.style.perspective = `${cubeSettings.width *
    (cubeSettings.perspectiveFactor[cubeSettings.amountOfFaces] ||
      cubeSettings.perspectiveFactor[
      cubeSettings.perspectiveFactor.length - 1
      ])}px`;

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
    "pink",
  ];

  // Set face styling
  Array.from(cubeSettings.faces).forEach((element, index, array) => {
    const rotationAngle = cubeSettings.faceAngle * index;
    //TODO: Direction inbouwen
    element.style.transform = `rotateY(${rotationAngle}deg) translate3d(0, 0, ${translate}px)`;
    element.style.backgroundColor = colors[index % (array.length - 1)];

    // Disable interaction with childNodes
    if (element.nodeType !== 1) return;
    element.style.touchAction = "none";
    element.style.pointerEvents = "none";
  });
}

const createTouchEvents = (cubeSettings: allSettings) => {
  // Create touch events
  const hammer = new Hammer(cubeSettings.touchElement || cubeSettings.container);

  hammer.on("panmove panstart panend tap", function (event) {
    if (cubeSettings.isAnimating && !cubeSettings.forcedEnd) return;

    cubeSettings.currentAnimation.clear();

    const localX = Math.max(
      Math.min(event.deltaX / cubeSettings.width, 0.5),
      -0.5
    );

    switch (event.type) {
      case "panstart":
        // Use later for dispatching events?
        break;

      case "panmove":
        cubeSettings.nextPredictedIndex = getIndex(
          localX > 0 ? -1 : 1,
          cubeSettings
        );
        fireEvent("nextPredictedUpdate", cubeSettings);

        // eslint-disable-next-line no-case-declarations
        const creativeContainer = document.querySelector(cubeSettings.creativeContainerId);

        if (creativeContainer && !creativeContainer.matches(":hover")) {
          hammer.stop(true);
          cubeSettings.forcedEnd = true;

          // Spelen met threshold waarde
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
}

const cubeAnimation = (type: string, cubeSettings: allSettings, localX: number) => {
  if (type === "move") {
    // Move animation
    cubeSettings.currentAnimation.add(
      gsap.to(cubeSettings.cube, {
        onStart: setAnimationState,
        onComplete: setAnimationState,
        onStartParams: [true, cubeSettings],
        onCompleteParams: [false, cubeSettings],
        duration: 0.01,
        rotationY:
          cubeSettings.currentRotation +
          cubeSettings.faceAngle * localX * cubeSettings.liveDrag,
      })
    );
  } else {
    if (localX > cubeSettings.threshold) {
      cubeSettings.currentRotation =
        cubeSettings.currentRotation + cubeSettings.faceAngle;
      updateIndex(-1, cubeSettings);
    } else if (localX < cubeSettings.threshold * -1) {
      cubeSettings.currentRotation =
        cubeSettings.currentRotation - cubeSettings.faceAngle;
      updateIndex(1, cubeSettings);
    }
    // Release animation TODO: Kijken of dit samengevoegd kan worden
    cubeSettings.currentAnimation.add(
      gsap.to(cubeSettings.cube, {
        onStart: setAnimationState,
        onComplete: setAnimationState,
        onStartParams: [true, cubeSettings],
        onCompleteParams: [false, cubeSettings],
        duration: cubeSettings.animationSpeed,
        rotationY: cubeSettings.currentRotation,
        ease: cubeSettings.animationEase,
      })
    );
  }
}

function setAnimationState(boolean: boolean, cubeSettings: allSettings) {
  cubeSettings.isAnimating = boolean;
}

console.log("TODO: DIRECTION AANPASSEN");
const getIndex = (direction: indexDirection, cubeSettings: allSettings): number => {
  return (cubeSettings.currentIndex + direction < 0) ?
    (cubeSettings.amountOfFaces + cubeSettings.currentIndex + direction) :
    ((cubeSettings.currentIndex + direction) % cubeSettings.amountOfFaces);
}

const updateIndex = (direction: indexDirection, cubeSettings: allSettings) => {
  cubeSettings.previousIndex = cubeSettings.currentIndex;
  cubeSettings.currentIndex = getIndex(direction, cubeSettings);

  fireEvent('cubeIndexUpdate', cubeSettings);
}

const fireEvent = (eventName: events, cubeSettings: allSettings) => {
  let event: CustomEvent;

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
}

export { createCube };
