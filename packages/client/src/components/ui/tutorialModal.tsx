// Tutorial.tsx
import {
  TutorialStep,
  hasRequiredFacilities,
  tutorialSteps,
} from "@/game/data/tutorial";
import { getState } from "@/game/store";
import { useState, useEffect } from "react";

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

  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/50">
      <div className="flex max-w-[50rem] flex-col rounded-lg border border-[#76EAE4] bg-[#76eae495] p-6 text-white shadow-lg">
        <div className="flex-1">
          <h2 className="mb-4 text-2xl">{step.screens[screenIndex].name}</h2>
          <div className="flex flex-row items-center justify-between gap-4">
            <p
              className="flex-1"
              dangerouslySetInnerHTML={{
                __html: step.screens[screenIndex].text,
              }}
            ></p>
            <div className="flex-2">
              {currentScreen?.image && (
                <img
                  src={currentScreen.image}
                  alt="Tutorial image"
                  className="h-auto w-80"
                />
              )}
              {currentScreen?.entity && (
                <img
                  src={`/icons/${currentScreen.entity.image}`}
                  alt="Entity image"
                  className="mb-4 h-auto w-80"
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onNext()}
            className="rounded bg-[#76EAE4] px-4 py-2 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState<number>(
    getState().player.playerData.tutorialIndex || 0
  );
  const [screenIndex, setScreenIndex] = useState<number>(0);

  useEffect(() => {
    const playerData = getState().player.playerData;
    const checkTutorialCompletion = () => {
      const idx = getState().player.playerData.tutorialIndex;
      const currentTutorialStep = tutorialSteps[idx];
      if (currentTutorialStep) {
        const requiredValid = hasRequiredFacilities(
          currentTutorialStep,
          playerData
        );
        if (requiredValid && idx < tutorialSteps.length - 1) {
          setScreenIndex(0);
          getState().player.setPlayerData({
            ...playerData,
            tutorialIndex: currentStep + 1,
          });
          setCurrentStep(currentStep + 1);
        }
      }
    };
    checkTutorialCompletion();
    document.addEventListener("buildFacility", checkTutorialCompletion);

    return () => {
      document.removeEventListener("buildFacility", checkTutorialCompletion);
    };
  }, [currentStep]);

  return (
    <>
      {screenIndex < tutorialSteps[currentStep]?.screens?.length && (
        <TutorialModal
          step={tutorialSteps[currentStep]}
          screenIndex={screenIndex}
          onNext={() => {
            setScreenIndex(screenIndex + 1);
          }}
        />
      )}
    </>
  );
};

export { Tutorial };
