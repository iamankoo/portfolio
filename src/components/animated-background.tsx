"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate } from "motion";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/data/constants";
import { sleep } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePreloader } from "./preloader";
import { useTheme } from "@teispace/next-themes";
import { Section, getKeyboardState } from "./animated-background-config";
import { useSounds } from "./realtime/hooks/use-sounds";
import { usePerfProfile } from "@/hooks/use-perf-profile";

gsap.registerPlugin(ScrollTrigger);

const KEYBOARD_POP_MODE = true;
const DROP_KEYS_ANIMATION = false;

type KeyTransform = {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
};

const KeyboardScene = ({ maxDpr }: { maxDpr: number }) => {
  const { isLoading, bypassLoading } = usePreloader();
  const { theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");

  // Animation controllers refs
  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void }>(null);
  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void }>(null);
  const dropKeysAnimationRef = useRef<{ start: () => void; stop: () => void }>(null);
  const popOutKeyAnimationRef = useRef<{ start: () => void; stop: () => void }>(null);

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);

  // --- Event Handlers ---

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      if (splineApp.getVariable("heading") && splineApp.getVariable("desc")) {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }
    } else {
      if (!selectedSkillRef.current || selectedSkillRef.current.name !== e.target.name) {
        const skill = SKILLS[e.target.name as SkillNames];
        if (skill) {
          if (selectedSkillRef.current) playReleaseSound();
          playPressSound();
          setSelectedSkill(skill);
          selectedSkillRef.current = skill;
        }
      }
    }
  };

  const handleSplineInteractions = () => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    splineApp.addEventListener("keyUp", () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
    });
    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    });
    splineApp.addEventListener("mouseHover", handleMouseHover);
  };

  // --- Animation Setup Helpers ---

  const createSectionTimeline = (
    triggerId: string,
    targetSection: Section,
    prevSection: Section,
    start: string = "top 50%",
    end: string = "bottom bottom"
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    return gsap.timeline({
      scrollTrigger: {
        trigger: triggerId,
        start,
        end,
        scrub: true,
        onEnter: () => {
          setActiveSection(targetSection);
          const state = getKeyboardState({ section: targetSection, isMobile });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
        onLeaveBack: () => {
          setActiveSection(prevSection);
          const state = getKeyboardState({ section: prevSection, isMobile, });
          gsap.to(kbd.scale, { ...state.scale, duration: 1 });
          gsap.to(kbd.position, { ...state.position, duration: 1 });
          gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
        },
      },
    });
  };

  const setupScrollAnimations = (): gsap.core.Timeline[] => {
    if (!splineApp || !splineContainer.current) return [];
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return [];

    // Initial state
    const heroState = getKeyboardState({ section: "hero", isMobile });
    gsap.set(kbd.scale, heroState.scale);
    gsap.set(kbd.position, heroState.position);

    // Section transitions
    return [
      createSectionTimeline("#skills", "skills", "hero"),
      createSectionTimeline("#projects", "projects", "skills", "top 70%"),
      createSectionTimeline("#contact", "contact", "projects", "top 30%"),
    ].filter(Boolean) as gsap.core.Timeline[];
  };

  const getBongoAnimation = () => {
    const framesParent = splineApp?.findObjectByName("bongo-cat");
    const frame1 = splineApp?.findObjectByName("frame-1");
    const frame2 = splineApp?.findObjectByName("frame-2");

    if (!frame1 || !frame2 || !framesParent) {
      return { start: () => { }, stop: () => { } };
    }

    let interval: NodeJS.Timeout;
    const start = () => {
      let i = 0;
      framesParent.visible = true;
      interval = setInterval(() => {
        if (i % 2) {
          frame1.visible = false;
          frame2.visible = true;
        } else {
          frame1.visible = true;
          frame2.visible = false;
        }
        i++;
      }, 100);
    };
    const stop = () => {
      clearInterval(interval);
      framesParent.visible = false;
      frame1.visible = false;
      frame2.visible = false;
    };
    return { start, stop };
  };

  const getKeycapsAnimation = () => {
    if (!splineApp) return { start: () => { }, stop: () => { } };

    // Track the infinite "float" tweens separately from the finite "settle"
    // tweens so start()/stop() each kill exactly what the other created — and
    // never a tween a newer call has since started (a stale kill landing late is
    // how the yoyo got stuck running on fast scrub).
    let floatTweens: gsap.core.Tween[] = [];
    let settleTweens: gsap.core.Tween[] = [];
    const killFloat = () => { floatTweens.forEach((t) => t.kill()); floatTweens = []; };
    const killSettle = () => { settleTweens.forEach((t) => t.kill()); settleTweens = []; };

    const start = () => {
      killSettle();
      killFloat();
      Object.values(SKILLS)
        .sort(() => Math.random() - 0.5)
        .forEach((skill, idx) => {
          const keycap = splineApp.findObjectByName(skill.name);
          if (!keycap) return;
          floatTweens.push(
            gsap.to(keycap.position, {
              y: Math.random() * 200 + 200,
              duration: Math.random() * 2 + 2,
              delay: idx * 0.6,
              repeat: -1,
              yoyo: true,
              yoyoEase: "none",
              ease: "elastic.out(1,0.3)",
            })
          );
        });
    };

    const stop = () => {
      killFloat();
      killSettle();
      // Finite — GSAP disposes them on completion, so no cleanup timer needed.
      Object.values(SKILLS).forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        settleTweens.push(
          gsap.to(keycap.position, {
            y: 0,
            duration: 4,
            ease: "elastic.out(1,0.7)",
          })
        );
      });
    };

    return { start, stop };
  };

  const getDropKeysAnimation = () => {
    if (!splineApp) return { start: () => { }, stop: () => { } };

    let runId = 0;
    let activeSkillName: string | null = null;
    let timers: number[] = [];
    let tweens: gsap.core.Tween[] = [];
    const originals = new Map<string, KeyTransform>();

    const skillsWithKeys = () =>
      Object.values(SKILLS).filter((skill) => splineApp.findObjectByName(skill.name));

    const rememberOriginal = (skillName: string, keycap: SPEObject) => {
      if (originals.has(skillName)) return;
      originals.set(skillName, {
        position: { x: keycap.position.x, y: keycap.position.y, z: keycap.position.z },
        rotation: { x: keycap.rotation.x, y: keycap.rotation.y, z: keycap.rotation.z },
        scale: { x: keycap.scale.x, y: keycap.scale.y, z: keycap.scale.z },
      });
    };

    const clearTimers = () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers = [];
    };

    const killTweens = () => {
      tweens.forEach((tween) => tween.kill());
      tweens = [];
    };

    const animateBack = (skillName: string, duration = 0.55) => {
      const keycap = splineApp.findObjectByName(skillName);
      const original = originals.get(skillName);
      if (!keycap || !original) return;

      tweens.push(
        gsap.to(keycap.position, {
          ...original.position,
          duration,
          ease: "power3.out",
        }),
        gsap.to(keycap.rotation, {
          ...original.rotation,
          duration,
          ease: "power3.out",
        }),
        gsap.to(keycap.scale, {
          ...original.scale,
          duration,
          ease: "back.out(1.4)",
        })
      );
    };

    const start = () => {
      runId++;
      const currentRun = runId;
      clearTimers();
      killTweens();

      const keySkills = skillsWithKeys();
      keySkills.forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (keycap) rememberOriginal(skill.name, keycap);
      });

      const startTimer = window.setTimeout(() => {
        keySkills.forEach((skill, index) => {
          const timer = window.setTimeout(() => {
            if (currentRun !== runId) return;

            if (activeSkillName && activeSkillName !== skill.name) {
              animateBack(activeSkillName);
              playReleaseSound();
            }

            const keycap = splineApp.findObjectByName(skill.name);
            const original = originals.get(skill.name);
            if (!keycap || !original) return;

            activeSkillName = skill.name;
            selectedSkillRef.current = skill;
            setSelectedSkill(skill);
            playPressSound();
            splineApp.setVariable("heading", skill.label);
            splineApp.setVariable("desc", skill.shortDescription);

            tweens.push(
              gsap.to(keycap.position, {
                x: original.position.x,
                y: original.position.y + 260,
                z: original.position.z + 20,
                duration: 0.75,
                ease: "bounce.out",
              }),
              gsap.to(keycap.rotation, {
                x: original.rotation.x + 0.25,
                y: original.rotation.y + 0.18,
                z: original.rotation.z + 0.12,
                duration: 0.75,
                ease: "power3.out",
              }),
              gsap.to(keycap.scale, {
                x: original.scale.x * 1.16,
                y: original.scale.y * 1.16,
                z: original.scale.z * 1.16,
                duration: 0.75,
                ease: "back.out(1.8)",
              })
            );
          }, index * 200);

          timers.push(timer);
        });
      }, 500);

      timers.push(startTimer);
    };

    const stop = () => {
      runId++;
      clearTimers();
      killTweens();
      if (activeSkillName) playReleaseSound();
      activeSkillName = null;
      selectedSkillRef.current = null;
      setSelectedSkill(null);
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");

      originals.forEach((_, skillName) => animateBack(skillName, 0.8));
    };

    return { start, stop };
  };

  const getPopOutKeyAnimation = () => {
    if (!splineApp) return { start: () => { }, stop: () => { } };

    let activeSkillName: string | null = null;
    let autoIndex = 0;
    let autoRunning = false;
    let pausedByHover = false;
    let lockedByClick = false;
    let pointerInsideKeyboard = false;
    let cycleId = 0;
    let resumeTimer: number | null = null;
    let showTimer: number | null = null;
    let controls: { stop: () => void }[] = [];
    const originals = new Map<string, KeyTransform>();
    const emphasizedKeys = new Set<string>();

    const keySkills = () =>
      Object.values(SKILLS).filter((skill) => splineApp.findObjectByName(skill.name));

    const rememberOriginal = (skillName: string, keycap: SPEObject) => {
      if (originals.has(skillName)) return;
      originals.set(skillName, {
        position: { x: keycap.position.x, y: keycap.position.y, z: keycap.position.z },
        rotation: { x: keycap.rotation.x, y: keycap.rotation.y, z: keycap.rotation.z },
        scale: { x: keycap.scale.x, y: keycap.scale.y, z: keycap.scale.z },
      });
    };

    const clearTimers = () => {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      if (showTimer) window.clearTimeout(showTimer);
      resumeTimer = null;
      showTimer = null;
    };

    const stopControls = () => {
      controls.forEach((control) => control.stop());
      controls = [];
    };

    const springTo = (
      target: { x: number; y: number; z: number },
      to: { x: number; y: number; z: number }
    ) => {
      const from = { x: target.x, y: target.y, z: target.z };
      const control = animate(0, 1, {
        type: "spring",
        stiffness: 520,
        damping: 26,
        mass: 0.55,
        onUpdate: (progress) => {
          target.x = from.x + (to.x - from.x) * progress;
          target.y = from.y + (to.y - from.y) * progress;
          target.z = from.z + (to.z - from.z) * progress;
        },
      });
      controls.push(control);
    };

    const setKeyVisualEmphasis = (keycap: SPEObject, active: boolean) => {
      const object = keycap as unknown as {
        castShadow?: boolean;
        receiveShadow?: boolean;
        traverse?: (callback: (child: unknown) => void) => void;
      };
      object.castShadow = active;
      object.receiveShadow = true;
      object.traverse?.((child) => {
        const mesh = child as {
          castShadow?: boolean;
          receiveShadow?: boolean;
          material?: {
            emissiveIntensity?: number;
            opacity?: number;
          };
        };
        mesh.castShadow = active;
        mesh.receiveShadow = true;
        if (mesh.material && "emissiveIntensity" in mesh.material) {
          mesh.material.emissiveIntensity = active ? 0.18 : 0;
        }
      });

      if (active) emphasizedKeys.add(keycap.name);
      else emphasizedKeys.delete(keycap.name);
    };

    const returnKey = (skillName: string) => {
      const keycap = splineApp.findObjectByName(skillName);
      const original = originals.get(skillName);
      if (!keycap || !original) return;

      setKeyVisualEmphasis(keycap, false);
      springTo(keycap.position, original.position);
      springTo(keycap.rotation, original.rotation);
      springTo(keycap.scale, original.scale);
    };

    const popKey = (skill: Skill) => {
      const keycap = splineApp.findObjectByName(skill.name);
      if (!keycap) return;

      rememberOriginal(skill.name, keycap);
      const original = originals.get(skill.name);
      if (!original) return;

      if (activeSkillName && activeSkillName !== skill.name) {
        returnKey(activeSkillName);
        playReleaseSound();
      }

      activeSkillName = skill.name;
      selectedSkillRef.current = skill;
      setSelectedSkill(skill);
      playPressSound();
      splineApp.setVariable("heading", skill.label);
      splineApp.setVariable("desc", skill.shortDescription);
      setKeyVisualEmphasis(keycap, true);

      const rotateZ = ((Math.random() * 8 - 4) * Math.PI) / 180;

      springTo(keycap.position, {
        x: original.position.x,
        y: original.position.y - 35,
        z: original.position.z + 18,
      });
      springTo(keycap.rotation, {
        x: original.rotation.x,
        y: original.rotation.y,
        z: original.rotation.z + rotateZ,
      });
      springTo(keycap.scale, {
        x: original.scale.x * 1.08,
        y: original.scale.y * 1.08,
        z: original.scale.z * 1.08,
      });

    };

    const scheduleNext = (delay = 0) => {
      clearTimers();
      const currentCycle = cycleId;

      showTimer = window.setTimeout(() => {
        if (!autoRunning || pausedByHover || lockedByClick || currentCycle !== cycleId) return;

        const skills = keySkills();
        if (skills.length === 0) return;

        const skill = skills[autoIndex % skills.length];
        popKey(skill);
        autoIndex = (autoIndex + 1) % skills.length;

        showTimer = window.setTimeout(() => {
          if (!autoRunning || pausedByHover || lockedByClick || currentCycle !== cycleId) return;
          if (activeSkillName) {
            returnKey(activeSkillName);
            playReleaseSound();
          }
          activeSkillName = null;
          selectedSkillRef.current = null;
          setSelectedSkill(null);
          splineApp.setVariable("heading", "");
          splineApp.setVariable("desc", "");
          scheduleNext(250);
        }, 2000);
      }, delay);
    };

    const start = () => {
      cycleId++;
      autoRunning = true;
      pausedByHover = false;
      lockedByClick = false;
      pointerInsideKeyboard = false;
      stopControls();
      keySkills().forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (keycap) rememberOriginal(skill.name, keycap);
      });
      scheduleNext(800);
    };

    const stop = () => {
      cycleId++;
      autoRunning = false;
      pausedByHover = false;
      lockedByClick = false;
      pointerInsideKeyboard = false;
      clearTimers();
      stopControls();
      if (activeSkillName) playReleaseSound();
      activeSkillName = null;
      selectedSkillRef.current = null;
      setSelectedSkill(null);
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
      originals.forEach((_, skillName) => returnKey(skillName));
      emphasizedKeys.forEach((skillName) => {
        const keycap = splineApp.findObjectByName(skillName);
        if (keycap) setKeyVisualEmphasis(keycap, false);
      });
    };

    const pauseForHover = () => {
      pointerInsideKeyboard = true;
      pausedByHover = true;
      clearTimers();
    };

    const resumeAfterHover = () => {
      pointerInsideKeyboard = false;
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        lockedByClick = false;
        pausedByHover = false;
        autoRunning = true;
        const currentActive = activeSkillName;
        if (currentActive) {
          returnKey(currentActive);
          playReleaseSound();
          activeSkillName = null;
          selectedSkillRef.current = null;
          setSelectedSkill(null);
          splineApp.setVariable("heading", "");
          splineApp.setVariable("desc", "");
          scheduleNext(250);
          return;
        }

        scheduleNext(0);
      }, 2000);
    };

    const selectSkill = (skill: Skill) => {
      clearTimers();
      lockedByClick = true;
      autoRunning = false;
      pausedByHover = pointerInsideKeyboard;
      const skills = keySkills();
      const clickedIndex = skills.findIndex((item) => item.name === skill.name);
      if (clickedIndex >= 0) autoIndex = (clickedIndex + 1) % skills.length;

      if (activeSkillName && activeSkillName !== skill.name) {
        const previousSkillName = activeSkillName;
        returnKey(previousSkillName);
        playReleaseSound();
        window.setTimeout(() => popKey(skill), 180);
        return;
      }

      popKey(skill);
    };

    splineApp.addEventListener("mouseHover", (event) => {
      const targetName = event.target.name;
      if (targetName === "body" || targetName === "platform") {
        resumeAfterHover();
        return;
      }

      if (SKILLS[targetName as SkillNames]) pauseForHover();
    });

    splineApp.addEventListener("mouseDown", (event) => {
      const skill = SKILLS[event.target.name as SkillNames];
      if (skill) selectSkill(skill);
    });

    return { start, stop };
  };

  const updateKeyboardTransform = async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    kbd.visible = false;
    await sleep(400);
    kbd.visible = true;
    setKeyboardRevealed(true);

    const currentState = getKeyboardState({ section: activeSection, isMobile });
    gsap.fromTo(
      kbd.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        ...currentState.scale,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
      }
    );

    const allObjects = splineApp.getAllObjects();
    const keycaps = allObjects.filter((obj) => obj.name === "keycap");

    await sleep(900);

    if (isMobile) {
      const mobileKeyCaps = allObjects.filter((obj) => obj.name === "keycap-mobile");
      mobileKeyCaps.forEach((keycap) => { keycap.visible = true; });
    } else {
      const desktopKeyCaps = allObjects.filter((obj) => obj.name === "keycap-desktop");
      desktopKeyCaps.forEach(async (keycap, idx) => {
        await sleep(idx * 70);
        keycap.visible = true;
      });
    }

    keycaps.forEach(async (keycap, idx) => {
      keycap.visible = false;
      await sleep(idx * 70);
      keycap.visible = true;
      gsap.fromTo(
        keycap.position,
        { y: 200 },
        { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" }
      );
    });
  };

  // --- Effects ---

  // Initialize GSAP and Spline interactions
  useEffect(() => {
    if (!splineApp) return;
    if (!KEYBOARD_POP_MODE) handleSplineInteractions();
    const timelines = setupScrollAnimations();
    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();
    dropKeysAnimationRef.current = getDropKeysAnimation();
    popOutKeyAnimationRef.current = getPopOutKeyAnimation();
    return () => {
      bongoAnimationRef.current?.stop()
      keycapAnimationsRef.current?.stop()
      dropKeysAnimationRef.current?.stop()
      popOutKeyAnimationRef.current?.stop()
      // Kill the section ScrollTriggers so they don't orphan when the scene
      // unmounts (e.g. toggling reduced motion) and fire on the disposed app.
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    }

  }, [splineApp, isMobile]);

  // Handle keyboard text visibility based on theme and section
  useEffect(() => {
    if (!splineApp) return;
    const textDesktopDark = splineApp.findObjectByName("text-desktop-dark");
    const textDesktopLight = splineApp.findObjectByName("text-desktop");
    const textMobileDark = splineApp.findObjectByName("text-mobile-dark");
    const textMobileLight = splineApp.findObjectByName("text-mobile");

    if (!textDesktopDark || !textDesktopLight || !textMobileDark || !textMobileLight) return;

    const setVisibility = (
      dDark: boolean,
      dLight: boolean,
      mDark: boolean,
      mLight: boolean
    ) => {
      textDesktopDark.visible = dDark;
      textDesktopLight.visible = dLight;
      textMobileDark.visible = mDark;
      textMobileLight.visible = mLight;
    };

    if (activeSection !== "skills") {
      setVisibility(false, false, false, false);
    } else if (theme === "dark") {
      isMobile
        ? setVisibility(false, false, false, true)
        : setVisibility(false, true, false, false);
    } else {
      isMobile
        ? setVisibility(false, false, true, false)
        : setVisibility(true, false, false, false);
    }
  }, [theme, splineApp, isMobile, activeSection]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    splineApp.setVariable("heading", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill]);

  // Handle rotation and teardown animations based on active section
  useEffect(() => {
    if (!splineApp) return;

    // Marks this run superseded so the delayed (await sleep) start/stop calls
    // below don't fire after activeSection has moved on — otherwise fast
    // scrolling overlaps runs and a stale keycap start() can land last, leaving
    // the float (yoyo) running forever.
    let cancelled = false;

    let rotateKeyboard: gsap.core.Tween | undefined;
    let teardownKeyboard: gsap.core.Tween | undefined;

    const kbd = splineApp.findObjectByName("keyboard");

    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, {
        y: Math.PI * 2 + kbd.rotation.y,
        duration: 10,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "back.inOut",
        delay: 2.5,
        paused: true, // Start paused
      });

      teardownKeyboard = gsap.fromTo(
        kbd.rotation,
        { y: 0, x: -Math.PI, z: 0 },
        {
          y: -Math.PI / 2,
          duration: 5,
          repeat: -1,
          yoyo: true,
          yoyoEase: true,
          delay: 2.5,
          immediateRender: false,
          paused: true,
        }
      );
    }

    const manageAnimations = async () => {
      // Reset text if not in skills
      if (activeSection !== "skills" && !DROP_KEYS_ANIMATION && !KEYBOARD_POP_MODE) {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }

      // Handle Rotate/Teardown Tweens
      if (activeSection === "hero") {
        rotateKeyboard?.restart();
        teardownKeyboard?.pause();
      } else if (activeSection === "contact") {
        rotateKeyboard?.pause();
      } else {
        rotateKeyboard?.pause();
        teardownKeyboard?.pause();
      }

      if (KEYBOARD_POP_MODE && activeSection === "skills") {
        bongoAnimationRef.current?.stop();
        teardownKeyboard?.pause();
        keycapAnimationsRef.current?.stop();
        dropKeysAnimationRef.current?.stop();
        popOutKeyAnimationRef.current?.start();
        return;
      }

      if (KEYBOARD_POP_MODE) {
        popOutKeyAnimationRef.current?.stop();
      }

      if (DROP_KEYS_ANIMATION && activeSection === "skills") {
        bongoAnimationRef.current?.stop();
        teardownKeyboard?.pause();
        keycapAnimationsRef.current?.stop();
        await sleep(500);
        if (cancelled) return;
        dropKeysAnimationRef.current?.start();
        return;
      }

      if (DROP_KEYS_ANIMATION) {
        dropKeysAnimationRef.current?.stop();
      }

      // Handle Bongo Cat
      if (activeSection === "projects") {
        await sleep(300);
        if (cancelled) return;
        bongoAnimationRef.current?.start();
      } else {
        await sleep(200);
        if (cancelled) return;
        bongoAnimationRef.current?.stop();
      }

      // Handle Contact Section Animations
      if (activeSection === "contact") {
        await sleep(600);
        if (cancelled) return;
        teardownKeyboard?.restart();
        keycapAnimationsRef.current?.start();
      } else {
        await sleep(600);
          if (cancelled) return;
          teardownKeyboard?.pause();
          keycapAnimationsRef.current?.stop();
        }
    };

    manageAnimations();

    return () => {
      cancelled = true;
      rotateKeyboard?.kill();
      teardownKeyboard?.kill();
    };
  }, [activeSection, splineApp]);

  // Reveal keyboard on load/route change
  useEffect(() => {
    // Rebuild the URL from the current pathname so the hash is always *replaced*
    // rather than appended. Using router.push("/" + hash) stacked fragments on
    // refresh (e.g. "/#skills#skills#skills") because the existing hash in the
    // address bar was never stripped first. replaceState also avoids polluting
    // browser history with an entry per scrolled-through section.
    const hash = activeSection === "hero" ? "" : `#${activeSection}`;
    const url = window.location.pathname + window.location.search + hash;
    window.history.replaceState(window.history.state, "", url);

    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [splineApp, isLoading, activeSection]);

  // Cap the renderer's pixel ratio once the scene is ready, and clean up the
  // resize listener on unmount / DPR change (previously added in onLoad and
  // never removed).
  useEffect(() => {
    if (!splineApp) return;
    return capSplinePixelRatio(splineApp, maxDpr);
  }, [splineApp, maxDpr]);

  // Pause the entire WebGL render loop (and the keyboard's infinite tweens /
  // bongo-cat interval, which are only visible through it) while the tab is
  // hidden. Spline keeps rendering at full tilt in a background tab otherwise —
  // a pointless, continuous GPU/battery drain.
  useEffect(() => {
    if (!splineApp) return;
    const onVisibility = () => {
      if (document.hidden) splineApp.stop();
      else splineApp.play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [splineApp]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Spline
        className="w-full h-full fixed"
        ref={splineContainer}
        onLoad={(app: Application) => {
          setSplineApp(app);
          bypassLoading();
        }}
        scene="/assets/skills-keyboard.spline"
      />
    </Suspense>
  );
};

/**
 * Gate the heavy WebGL scene behind device/preference detection.
 *
 * The gate lives here in the parent (not inside KeyboardScene) on purpose: when
 * 3D is disabled — e.g. the user toggles reduced motion — KeyboardScene fully
 * UNMOUNTS, tearing down its Spline app, GSAP tweens, ScrollTriggers and reveal
 * state. Re-enabling remounts it from a clean slate. (Gating with an internal
 * early-return instead kept the component mounted, so it came back with stale
 * `keyboardRevealed` state and never re-initialised the keycaps.)
 *
 * Waiting for `ready` also avoids a flash-mount that would fetch the heavy
 * runtime chunk + scene before detection has run; the Preloader bypasses its
 * splash when 3D is disabled.
 */
const AnimatedBackground = () => {
  const { disable3D, maxDpr, ready } = usePerfProfile();
  if (!ready || disable3D) return null;
  return <KeyboardScene maxDpr={maxDpr} />;
};

/**
 * Cap the Spline/Three.js renderer's pixel ratio. The scene is published with
 * pixelRatio=0 ("device"), so on a 2–3x screen it renders 4–9x the pixels of a
 * 1x canvas — a huge GPU cost. We clamp it and reapply on resize, since Spline
 * re-reads devicePixelRatio when the canvas resizes. Returns a disposer that
 * removes the resize listener (so it isn't leaked across reloads/unmounts).
 */
function capSplinePixelRatio(app: Application, maxDpr: number) {
  const apply = () => {
    try {
      const renderer = (app as unknown as { _renderer?: { setPixelRatio?: (n: number) => void } })
        ._renderer;
      if (renderer?.setPixelRatio) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
      }
    } catch {
      /* internal API moved — fail silent, scene still renders */
    }
  };
  apply();
  window.addEventListener("resize", apply, { passive: true });
  return () => window.removeEventListener("resize", apply);
}

export default AnimatedBackground;
