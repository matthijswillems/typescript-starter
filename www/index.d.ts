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
    animationEase: string;
    autoSlider: GSAPTimeline;
    currentAnimation: GSAPTimeline;
    liveDrag: number;
    forcedEnd: boolean;
    isAnimating: boolean;
    onClick: false;
    touchElement?: HTMLElement;
};
type calculatedSettings = {
    cube: HTMLElement;
    faces: HTMLElement[];
    amountOfFaces: number;
    faceAngle: number;
    nextPredictedIndex?: number;
};
type allSettings = userSettings & calculatedSettings;
declare const createCube: (container: string, userSettings: userSettings) => allSettings;
export { createCube };
