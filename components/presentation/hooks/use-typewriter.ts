"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSlideContext } from "../presentation";

export interface TypewriterStep {
  action:
    | "type"
    | "delete"
    | "replace"
    | "pause"
    | "clear"
    | "wait"
    | "put"
    | "prefix"
    | "switch"
    | "speed";
  text?: string;
  closing?: string;
  position?: number;
  length?: number;
  delay?: number;
  fileName?: string;
  speed?: number;
  deleteSpeed?: number;
}

export interface TypewriterConfig {
  initialText?: string | Record<string, string>;
  initialPrefix?: string;
  steps: TypewriterStep[] | Record<string, TypewriterStep[]>;
  pages?: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  humanize?: boolean;
  humanizeRange?: number;
  loop?: boolean;
  autoStart?: boolean;
  onStepComplete?: () => void;
  onComplete?: () => void;
}

export function useTypewriter(config: TypewriterConfig) {
  const {
    initialText = "",
    initialPrefix = "",
    steps: inputSteps,
    pages = ["main.typ"],
    typeSpeed = 50,
    deleteSpeed = 30,
    humanize = true,
    humanizeRange = 30,
    loop = false,
    autoStart = false,
    onStepComplete,
    onComplete,
  } = config;

  const { registerStepHandler, registerPrevStepHandler } = useSlideContext();

  const initialFiles = useMemo(() => {
    if (typeof initialText === "string") {
      return { [pages[0]]: initialText };
    }
    return pages.reduce(
      (acc, page) => ({
        ...acc,
        [page]: initialText[page] || "",
      }),
      {} as Record<string, string>,
    );
  }, [initialText, pages]);

  const steps = useMemo(() => {
    const rawSteps: TypewriterStep[] = [];

    rawSteps.push({ action: "wait" });

    if (Array.isArray(inputSteps)) {
      rawSteps.push(...inputSteps);
    } else {
      pages.forEach((page) => {
        if (inputSteps[page] && inputSteps[page].length > 0) {
          rawSteps.push({ action: "switch", fileName: page });
          rawSteps.push(...inputSteps[page]);
        }
      });
    }
    return rawSteps;
  }, [inputSteps, pages]);

  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState(pages[0]);
  const [currentPrefix, setCurrentPrefix] = useState(initialPrefix);
  const [currentClosing, setCurrentClosing] = useState("");

  const [isWaiting, setIsWaiting] = useState(!autoStart);
  const [isTyping, setIsTyping] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const charIndexRef = useRef(0);
  const filesRef = useRef(initialFiles);
  const activeFileRef = useRef(pages[0]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(false);
  const stepsRef = useRef(steps);
  const baseConfigRef = useRef({ humanize, humanizeRange });
  const runtimeSpeedsRef = useRef({ typeSpeed, deleteSpeed });
  const callbacksRef = useRef({ onStepComplete, onComplete });

  const currentPrefixRef = useRef(initialPrefix);

  stepsRef.current = steps;
  baseConfigRef.current = { humanize, humanizeRange };
  callbacksRef.current = { onStepComplete, onComplete };

  useEffect(() => {
    if (!isTyping) {
      runtimeSpeedsRef.current = { typeSpeed, deleteSpeed };
    }
  }, [typeSpeed, deleteSpeed, isTyping]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const getDelay = useCallback((baseDelay: number) => {
    const { humanize, humanizeRange } = baseConfigRef.current;
    if (!humanize) return baseDelay;
    const variation = (Math.random() - 0.5) * 2 * humanizeRange;
    const extraPause = Math.random() < 0.1 ? Math.random() * 150 : 0;
    return Math.max(10, baseDelay + variation + extraPause);
  }, []);

  const updateFileContent = useCallback((fileName: string, content: string) => {
    filesRef.current = { ...filesRef.current, [fileName]: content };
    setFiles({ ...filesRef.current });
  }, []);

  const resetSpeeds = useCallback(() => {
    runtimeSpeedsRef.current = { typeSpeed, deleteSpeed };
  }, [typeSpeed, deleteSpeed]);

  const runToStep = useCallback(
    (targetIndex: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      let simFiles = { ...initialFiles };
      let simActive = pages[0];
      let simPrefix = initialPrefix;

      for (let i = 0; i < targetIndex; i++) {
        const step = stepsRef.current[i];
        if (!step) break;

        const currentText = simFiles[simActive] || "";

        switch (step.action) {
          case "switch":
            if (step.fileName) simActive = step.fileName;
            break;
          case "type":
          case "put":
            simFiles[simActive] = currentText + (step.text || "");
            break;
          case "delete":
            simFiles[simActive] = currentText.slice(0, -(step.length ?? 1));
            break;
          case "replace":
            const pos = step.position ?? 0;
            const len = step.length ?? 0;
            const replacement = step.text ?? "";
            simFiles[simActive] =
              currentText.slice(0, pos) +
              replacement +
              currentText.slice(pos + len);
            break;
          case "clear":
            simFiles[simActive] = "";
            break;
          case "prefix":
            simPrefix = step.text ?? "";
            break;
        }
      }

      filesRef.current = simFiles;
      activeFileRef.current = simActive;
      currentPrefixRef.current = simPrefix;

      setFiles(simFiles);
      setActiveFile(simActive);
      setCurrentPrefix(simPrefix);
      setStepIndex(targetIndex);
      charIndexRef.current = 0;
      setIsTyping(false);

      const currentStep = stepsRef.current[targetIndex];
      if (currentStep && currentStep.action === "wait") {
        setIsWaiting(true);
        setCurrentClosing(currentStep.closing || "");
      } else {
        setIsWaiting(false);
        setCurrentClosing(currentStep?.closing || "");
      }
    },
    [initialFiles, initialPrefix, pages],
  );

  const prev = useCallback(() => {
    let target = stepIndex - 1;

    while (target > 0) {
      if (stepsRef.current[target].action === "wait") {
        break;
      }
      target--;
    }

    runToStep(target);
    return true;
  }, [stepIndex, runToStep]);

  const finishCurrentStep = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const step = stepsRef.current[stepIndex];
    if (!step) return;

    const currentFileName = activeFileRef.current;
    const currentText = filesRef.current[currentFileName] || "";

    switch (step.action) {
      case "type":
        updateFileContent(
          currentFileName,
          currentText + (step.text || "").slice(charIndexRef.current),
        );
        break;
      case "delete":
        const remainingToDelete = (step.length ?? 1) - charIndexRef.current;
        if (remainingToDelete > 0) {
          updateFileContent(
            currentFileName,
            currentText.slice(0, -remainingToDelete),
          );
        }
        break;

      case "replace":
        const pos = step.position ?? 0;
        const len = step.length ?? 0;
        const replacement = step.text ?? "";

        const preText = filesRef.current[currentFileName] || "";

        updateFileContent(
          currentFileName,
          preText.slice(0, pos) + replacement + preText.slice(pos + len),
        );
        break;
    }

    charIndexRef.current = 0;
    setStepIndex((prev) => prev + 1);
  }, [stepIndex, updateFileContent]);

  const next = useCallback(() => {
    const currentStep = stepsRef.current[stepIndex];

    if (isTyping) {
      finishCurrentStep();
      return true;
    }

    if (isWaiting) {
      setIsWaiting(false);
      setIsTyping(true);
      charIndexRef.current = 0;
      setStepIndex((prev) => prev + 1);
      return true;
    }

    if (stepIndex >= stepsRef.current.length) {
      return false;
    }

    return true;
  }, [isTyping, isWaiting, stepIndex, finishCurrentStep]);

  const jumpToFile = useCallback(
    (fileName: string) => {
      let target = stepIndex + 1;
      while (target < stepsRef.current.length) {
        const s = stepsRef.current[target];
        if (
          s.fileName === fileName ||
          (s.action === "switch" && s.fileName === fileName)
        ) {
          let waitTarget = target;
          while (waitTarget > stepIndex) {
            if (stepsRef.current[waitTarget].action === "wait") {
              break;
            }
            waitTarget--;
          }

          if (waitTarget > stepIndex) {
            runToStep(waitTarget);
          } else {
            setActiveFile(fileName);
            activeFileRef.current = fileName;
          }
          return;
        }
        target++;
      }

      setActiveFile(fileName);
      activeFileRef.current = fileName;
    },
    [stepIndex, runToStep],
  );

  useEffect(() => {
    if (isWaiting || isTyping || stepIndex < stepsRef.current.length - 1) {
      registerStepHandler(() => {
        return next();
      });
    } else {
      registerStepHandler(null);
    }
    return () => registerStepHandler(null);
  }, [isWaiting, isTyping, stepIndex, next, registerStepHandler]);

  useEffect(() => {
    if (stepIndex > 0) {
      registerPrevStepHandler(() => {
        return prev();
      });
    } else {
      registerPrevStepHandler(null);
    }
    return () => registerPrevStepHandler(null);
  }, [stepIndex, prev, registerPrevStepHandler]);

  useEffect(() => {
    if (!isTyping || isWaiting) return;

    const currentSteps = stepsRef.current;
    if (stepIndex >= currentSteps.length) {
      if (loop && currentSteps.length > 0) {
        runToStep(0);
      } else {
        setIsTyping(false);
        setCurrentClosing("");
        callbacksRef.current.onComplete?.();
      }
      return;
    }

    const step = currentSteps[stepIndex];

    if (charIndexRef.current === 0 && step.closing !== undefined) {
      setCurrentClosing(step.closing);
    }

    const completeCurrentStep = () => {
      if (!mountedRef.current) return;
      callbacksRef.current.onStepComplete?.();
      charIndexRef.current = 0;
      setStepIndex((prev) => prev + 1);
    };

    const tick = () => {
      if (!mountedRef.current) return;
      const { typeSpeed: currentTypeSpeed, deleteSpeed: currentDeleteSpeed } =
        runtimeSpeedsRef.current;
      const currentFileName = activeFileRef.current;
      const currentText = filesRef.current[currentFileName] || "";

      switch (step.action) {
        case "wait":
          setIsWaiting(true);
          setIsTyping(false);
          break;
        case "switch":
          if (step.fileName) {
            activeFileRef.current = step.fileName;
            setActiveFile(step.fileName);
          }
          timeoutRef.current = setTimeout(completeCurrentStep, 300);
          break;
        case "speed":
          if (step.speed !== undefined)
            runtimeSpeedsRef.current.typeSpeed = step.speed;
          if (step.deleteSpeed !== undefined)
            runtimeSpeedsRef.current.deleteSpeed = step.deleteSpeed;
          completeCurrentStep();
          break;
        case "type":
          const textToType = step.text || "";
          if (charIndexRef.current < textToType.length) {
            const char = textToType[charIndexRef.current];
            updateFileContent(currentFileName, currentText + char);
            charIndexRef.current++;
            timeoutRef.current = setTimeout(
              tick,
              getDelay(step.delay ?? currentTypeSpeed),
            );
          } else {
            timeoutRef.current = setTimeout(completeCurrentStep, 100);
          }
          break;
        case "delete":
          const countToDelete = step.length ?? 1;
          if (charIndexRef.current < countToDelete) {
            updateFileContent(currentFileName, currentText.slice(0, -1));
            charIndexRef.current++;
            timeoutRef.current = setTimeout(
              tick,
              getDelay(step.delay ?? currentDeleteSpeed),
            );
          } else {
            timeoutRef.current = setTimeout(completeCurrentStep, 100);
          }
          break;
        case "replace":
          timeoutRef.current = setTimeout(
            () => {
              const pos = step.position ?? 0;
              const len = step.length ?? 0;
              const replacement = step.text ?? "";
              updateFileContent(
                currentFileName,
                currentText.slice(0, pos) +
                  replacement +
                  currentText.slice(pos + len),
              );
              completeCurrentStep();
            },
            getDelay(step.delay ?? currentTypeSpeed),
          );
          break;
        case "pause":
          timeoutRef.current = setTimeout(
            completeCurrentStep,
            step.delay ?? 1000,
          );
          break;
        case "clear":
          timeoutRef.current = setTimeout(() => {
            updateFileContent(currentFileName, "");
            completeCurrentStep();
          }, 100);
          break;
        case "put":
          timeoutRef.current = setTimeout(() => {
            updateFileContent(currentFileName, step.text ?? "");
            completeCurrentStep();
          }, 100);
          break;
        case "prefix":
          setCurrentPrefix(step.text ?? "");
          completeCurrentStep();
          break;
      }
    };

    tick();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    stepIndex,
    isTyping,
    isWaiting,
    loop,
    initialFiles,
    initialPrefix,
    pages,
    getDelay,
    updateFileContent,
    resetSpeeds,
    runToStep,
  ]);

  const start = useCallback(() => {
    runToStep(0);
  }, [runToStep]);

  const reset = useCallback(() => {
    runToStep(0);
  }, [runToStep]);

  return {
    files,
    activeFile,
    currentPrefix,
    currentClosing,
    isTyping,
    isWaiting,
    stepIndex,
    start,
    reset,
    next,
    prev,
    jumpToFile,
    setFiles,
    setActiveFile,
  };
}
