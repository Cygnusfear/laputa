// Tutorial.tsx
import {
  TutorialStep,
  // completeTutorial,
  tutorialSteps,
} from "@/game/data/tutorial";
import { getState } from "@/game/store";
import { useState, useEffect } from "react";
import { useSpring, animated, config } from "@react-spring/web";

import { vaultSponsorPlayer } from "@/game/data/player";

function TutorialModal({
  step,
  screenIndex,
  onNext,
}: {
  step: TutorialStep;
  screenIndex: number;
  onNext: () => void;
}) {
  const currentScreen = step.screens[screenIndex];
  const props = useSpring({
    opacity: 1,
    transform: "scale(1)",
    config: config.gentle, // Adjust for desired animation feel
    from: {
      opacity: 0.5,
      transform: "scale(0.8)",
    },
    to: {
      opacity: 1,
      transform: "scale(1)",
    },
  });
  return (
    <div className="fixed left-0 top-0 flex h-full w-full select-none items-center justify-center bg-black/50">
      <animated.div
        className="flex max-h-full max-w-full flex-col md:max-w-[50rem]"
        style={props}
      >
        <div className="flex-1 overflow-scroll border-b border-[#FDBF7F33] bg-[#2B3840] p-6 pb-10 text-white shadow-lg sm:rounded-lg">
          <h2 className="mb-4 text-2xl text-[#ffddbb]">
            {step.screens[screenIndex].name}
          </h2>
          <div className="sm:text-md flex flex-col items-start justify-start gap-8 sm:flex-row">
            {step.screens[screenIndex].text && (
              <div
                className="flex-1 grow place-content-start items-start justify-self-start"
                dangerouslySetInnerHTML={{
                  __html: step.screens[screenIndex].text || "",
                }}
              ></div>
            )}
            <div className="flex-2 w-80">
              {currentScreen?.image && (
                <img
                  src={`/art/${currentScreen.image}`}
                  alt="Tutorial image"
                  className="h-auto w-full"
                  draggable="false"
                />
              )}
              {!currentScreen?.image && currentScreen?.entity && (
                <img
                  src={`/icons/${currentScreen.entity.image}`}
                  alt="Entity image"
                  className="h-auto w-full"
                  draggable="false"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end sm:mt-4">
          {!step.screens[screenIndex].hideNext && (
            <button
              onClick={() => onNext()}
              className="w-full cursor-pointer rounded border border-t-0 border-[#FDBF7F] bg-[#FDBF7Faa] px-4 py-2 text-white hover:bg-[#FDBF7Fee] sm:w-auto"
            >
              Next
            </button>
          )}
        </div>
      </animated.div>
    </div>
  );
}

const Tutorial = () => {
  const [currentTutorial, setCurrentTutorial] = useState<
    TutorialStep | undefined
  >(undefined);
  const [screenIndex, setScreenIndex] = useState<number>(0);

  useEffect(() => {
    const setTutorial = async () => {
      const playerData = getState().player.playerData;
      if (playerData.activeTutorials.length > 0) {
        if (playerData.activeTutorials[0]) {
          const tutorialStep = tutorialSteps.find(
            (step) => step.name === playerData.activeTutorials[0]
          );
          if (currentTutorial !== tutorialStep) {
            setCurrentTutorial(() => {
              setScreenIndex(0);
              return tutorialStep;
            });
          }
        }
      }
    };
    document.addEventListener("activeTutorial", setTutorial);
    return () => {
      document.removeEventListener("activeTutorial", setTutorial);
    };
  }, [currentTutorial]);

  return (
    <>
      {currentTutorial && screenIndex < currentTutorial.screens?.length && (
        <TutorialModal
          step={currentTutorial}
          screenIndex={screenIndex}
          onNext={() => {
            if (currentTutorial.screens[screenIndex].onExitScreen) {
              currentTutorial.screens[screenIndex]!.onExitScreen!();
            }
            setScreenIndex(screenIndex + 1);
            if (currentTutorial.screens[screenIndex].funds)
              console.log(
                "dofunds",
                currentTutorial.screens[screenIndex].funds
              );
            currentTutorial?.screens[screenIndex]?.funds !== undefined &&
              vaultSponsorPlayer(currentTutorial.screens[screenIndex].funds!);
          }}
        />
      )}
    </>
  );
};

export { Tutorial };
