"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
  createContext,
  useContext,
  isValidElement,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "./animated-background";
import { SlideWrapper } from "./slide-wrapper";
import { SlideNavigation } from "./slide-navigation";
import { SlideOverview } from "./slide-overview";
import { useHideCursor } from "./hooks/use-hide-cursor";
import { SlideCounter } from "./slide-counter";
import React from "react";

interface SlideContextValue {
  isWorkshop: boolean;
  setIsWorkshop: (value: boolean) => void;
  transitionType:
    | "default"
    | "zoom-in"
    | "zoom-out"
    | "workshop-enter"
    | "workshop-exit";
  registerStepHandler: (handler: (() => boolean) | null) => void;
  registerPrevStepHandler: (handler: (() => boolean) | null) => void;
}

export const SlideContext = createContext<SlideContextValue>({
  isWorkshop: false,
  setIsWorkshop: () => {},
  transitionType: "default",
  registerStepHandler: () => {},
  registerPrevStepHandler: () => {},
});

export const useSlideContext = () => useContext(SlideContext);

export interface SlideConfig {
  component: ReactNode;
  subslides?: ReactNode[];
  type?: "default" | "workshop" | "gallery";
  subslidesType?: "default" | "workshop" | "gallery";
  numberingPosition?: "left" | "center" | "right";
}

interface PresentationProps {
  slides: (ReactNode | SlideConfig)[];
}

interface FlatSlide {
  id: string;
  component: ReactNode;
  type: "default" | "workshop" | "gallery";
  isSubslide: boolean;
  parentIndex?: number;
  numberingPosition: "left" | "center" | "right";
}

function getSlideId(node: ReactNode, fallbackIndex: number): string {
  if (isValidElement(node) && node.key) {
    return String(node.key).replace(/^\.\$/, "");
  }
  return `slide-${fallbackIndex}`;
}

function normalizeSlides(slides: (ReactNode | SlideConfig)[]): FlatSlide[] {
  const result: FlatSlide[] = [];
  slides.forEach((slide, parentIndex) => {
    if (slide && typeof slide === "object" && "component" in slide) {
      const config = slide as SlideConfig;
      const numberingPosition = config.numberingPosition || "right";
      const parentType = config.type || "default";
      const childrenType = config.subslidesType || parentType;
      result.push({
        id: getSlideId(config.component, result.length),
        component: config.component,
        type: parentType,
        isSubslide: false,
        numberingPosition,
      });
      if (config.subslides) {
        config.subslides.forEach((sub) => {
          result.push({
            id: getSlideId(sub, result.length),
            component: sub,
            type: childrenType,
            isSubslide: true,
            parentIndex,
            numberingPosition,
          });
        });
      }
    } else {
      const node = slide as ReactNode;
      result.push({
        id: getSlideId(node, result.length),
        component: node,
        type: "default",
        isSubslide: false,
        numberingPosition: "right",
      });
    }
  });
  return result;
}

export function Presentation({ slides }: PresentationProps) {
  const flatSlides = useMemo(() => normalizeSlides(slides), [slides]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">(
    "right",
  );
  const [transitionType, setTransitionType] = useState<
    "default" | "zoom-in" | "zoom-out" | "workshop-enter" | "workshop-exit"
  >("default");
  const [showOverview, setShowOverview] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isWorkshop, setIsWorkshop] = useState(false);
  const isCursorHidden = useHideCursor(2000);

  const stepHandlerRef = useRef<(() => boolean) | null>(null);
  const prevStepHandlerRef = useRef<(() => boolean) | null>(null);

  const registerStepHandler = useCallback((handler: (() => boolean) | null) => {
    stepHandlerRef.current = handler;
  }, []);

  const registerPrevStepHandler = useCallback(
    (handler: (() => boolean) | null) => {
      prevStepHandlerRef.current = handler;
    },
    [],
  );

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const slideIndex = flatSlides.findIndex((slide) => slide.id === hash);
      if (slideIndex !== -1) {
        setCurrentSlide(slideIndex);
        setIsWorkshop(flatSlides[slideIndex].type === "workshop");
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [flatSlides]);

  useEffect(() => {
    const currentId = flatSlides[currentSlide]?.id;
    if (currentId) {
      const newHash = `#${currentId}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, "", newHash);
      }
    }
  }, [currentSlide, flatSlides]);

  const getTransitionType = useCallback(
    (fromIndex: number, toIndex: number) => {
      const fromSlide = flatSlides[fromIndex];
      const toSlide = flatSlides[toIndex];
      if (!fromSlide?.isSubslide && toSlide?.isSubslide) return "zoom-in";
      if (fromSlide?.isSubslide && !toSlide?.isSubslide) return "zoom-out";
      if (toSlide?.type === "workshop" && fromSlide?.type !== "workshop")
        return "workshop-enter";
      if (fromSlide?.type === "workshop" && toSlide?.type !== "workshop")
        return "workshop-exit";
      return "default";
    },
    [flatSlides],
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= flatSlides.length) return;
      const transition = getTransitionType(currentSlide, index);
      setTransitionType(transition);
      setDirection(index > currentSlide ? "right" : "left");
      setCurrentSlide(index);
      setIsWorkshop(flatSlides[index].type === "workshop");

      stepHandlerRef.current = null;
      prevStepHandlerRef.current = null;
    },
    [currentSlide, flatSlides, getTransitionType],
  );

  const nextSlide = useCallback(() => {
    if (stepHandlerRef.current) {
      const handled = stepHandlerRef.current();
      if (handled) return;
    }
    if (currentSlide < flatSlides.length - 1) {
      goToSlide(currentSlide + 1);
    }
  }, [currentSlide, flatSlides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    if (prevStepHandlerRef.current) {
      const handled = prevStepHandlerRef.current();
      if (handled) return;
    }
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showOverview) {
        if (e.key === "Escape") setShowOverview(false);
        return;
      }
      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "Enter":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          prevSlide();
          break;
        case "Escape":
          setShowOverview((prev) => !prev);
          break;
        case "Home":
          goToSlide(0);
          break;
        case "End":
          goToSlide(flatSlides.length - 1);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, showOverview, flatSlides.length]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-no-advance]")
      )
        return;
      nextSlide();
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [nextSlide]);

  return (
    <SlideContext.Provider
      value={{
        isWorkshop,
        setIsWorkshop,
        transitionType,
        registerStepHandler,
        registerPrevStepHandler,
      }}
    >
      {isCursorHidden && (
        <style>{`body, body * { cursor: none !important; }`}</style>
      )}
      <div className="fixed inset-0 bg-background overflow-hidden">
        <AnimatedBackground isWorkshop={isWorkshop} />
        <AnimatePresence>
          {currentSlide > 0 && (
            <SlideCounter
              key="slide-counter"
              current={currentSlide + 1}
              total={flatSlides.length}
              position={flatSlides[currentSlide].numberingPosition}
            />
          )}
        </AnimatePresence>
        <div className="relative w-full h-full flex items-center justify-center">
          <SlideWrapper
            slideKey={currentSlide}
            direction={direction}
            transitionType={transitionType}
          >
            {flatSlides[currentSlide].component}
          </SlideWrapper>
        </div>
        <div
          className="fixed bottom-0 left-0 right-0 h-32 flex items-end justify-center pb-6 z-50"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <div className="pointer-events-none flex items-end justify-center w-full">
            <div className="pointer-events-auto">
              <SlideNavigation
                currentSlide={currentSlide}
                totalSlides={flatSlides.length}
                onPrev={prevSlide}
                onNext={nextSlide}
                onGoTo={goToSlide}
                showOverview={showOverview}
                onToggleOverview={() => setShowOverview((prev) => !prev)}
                visible={showControls}
              />
            </div>
          </div>
        </div>
        <SlideOverview
          slides={flatSlides.map((s) => s.component)}
          currentSlide={currentSlide}
          onSelect={goToSlide}
          onClose={() => setShowOverview(false)}
          isOpen={showOverview}
        />
      </div>
    </SlideContext.Provider>
  );
}
