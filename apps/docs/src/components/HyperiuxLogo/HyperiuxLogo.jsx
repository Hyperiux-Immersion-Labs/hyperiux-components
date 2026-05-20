"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { CubeParticlesModel } from "./CubeParticlesModel";
import { CameraShakeOnHold } from "./CameraShakeOnHold";
import { HoldCursorIndicator } from "./HoldCursorIndicator";

const PHASE_IDLE = "idle";
const PHASE_HOLDING = "holding";
const PHASE_EXPLOADING = "exploding";
const PHASE_REFORMING = "reforming";

const DARK_TEXTURE_PATH = "/assets/models/new-logo-texture.png";
const LIGHT_TEXTURE_PATH = "/assets/models/hyperiux-logo-texture.png";
const HOLD_TRIGGER_DURATION = 3;

const HyperiuxLogo = () => {
  const [actionPhase, setActionPhase] = useState(PHASE_IDLE);
  const [burstKey, setBurstKey] = useState(0);
  const [isLightMode, setIsLightMode] = useState(false);

  const actionPhaseRef = useRef(PHASE_IDLE);
  const lockRef = useRef(false);
  const activePointerIdRef = useRef(null);
  const timersRef = useRef([]);
  const removeWindowReleaseRef = useRef(null);
  const holdStartTimeRef = useRef(0);
  const autoExplosionTimeoutRef = useRef(null);

  const explosionDuration = 3;
  const explodedHoldDuration = 1;
  const reformDuration = 3.5;
  const reformSettleBuffer = 0.12;

  useEffect(() => {
    actionPhaseRef.current = actionPhase;
  }, [actionPhase]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const clearAutoExplosionTimeout = () => {
    if (autoExplosionTimeoutRef.current) {
      clearTimeout(autoExplosionTimeoutRef.current);
      autoExplosionTimeoutRef.current = null;
    }
  };

  const clearWindowRelease = () => {
    if (removeWindowReleaseRef.current) {
      removeWindowReleaseRef.current();
      removeWindowReleaseRef.current = null;
    }
  };

  const resetCycle = () => {
    clearTimers();
    clearAutoExplosionTimeout();
    clearWindowRelease();

    lockRef.current = false;
    activePointerIdRef.current = null;
    holdStartTimeRef.current = 0;

    actionPhaseRef.current = PHASE_IDLE;
    setActionPhase(PHASE_IDLE);
  };

  const startExplosionSequence = () => {
    if (actionPhaseRef.current !== PHASE_HOLDING) return;

    clearWindowRelease();
    clearAutoExplosionTimeout();

    setBurstKey((v) => v + 1);
    actionPhaseRef.current = PHASE_EXPLOADING;
    setActionPhase(PHASE_EXPLOADING);

    timersRef.current.push(
      setTimeout(() => {
        actionPhaseRef.current = PHASE_REFORMING;
        setActionPhase(PHASE_REFORMING);
      }, (explosionDuration + explodedHoldDuration) * 1000)
    );

    timersRef.current.push(
      setTimeout(() => {
        resetCycle();
      }, (explosionDuration +
        explodedHoldDuration +
        reformDuration +
        reformSettleBuffer) * 1000)
    );
  };

  const startHold = (e) => {
    if (lockRef.current) return;
    if (actionPhaseRef.current !== PHASE_IDLE) return;

    clearTimers();
    clearAutoExplosionTimeout();
    clearWindowRelease();

    lockRef.current = true;
    activePointerIdRef.current = e.pointerId ?? null;
    holdStartTimeRef.current = performance.now();

    actionPhaseRef.current = PHASE_HOLDING;
    setActionPhase(PHASE_HOLDING);

    autoExplosionTimeoutRef.current = setTimeout(() => {
      startExplosionSequence();
    }, HOLD_TRIGGER_DURATION * 1000);

    const handleWindowPointerUp = (ev) => {
      if (actionPhaseRef.current !== PHASE_HOLDING) return;

      if (
        activePointerIdRef.current !== null &&
        ev.pointerId !== undefined &&
        ev.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      // Before 3 seconds: cancel and reset
      resetCycle();
    };

    const handleWindowPointerCancel = (ev) => {
      if (actionPhaseRef.current !== PHASE_HOLDING) return;

      if (
        activePointerIdRef.current !== null &&
        ev.pointerId !== undefined &&
        ev.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      resetCycle();
    };

    window.addEventListener("pointerup", handleWindowPointerUp, {
      passive: true,
    });
    window.addEventListener("pointercancel", handleWindowPointerCancel, {
      passive: true,
    });

    removeWindowReleaseRef.current = () => {
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerCancel);
    };
  };

  useEffect(() => {
    return () => {
      clearTimers();
      clearAutoExplosionTimeout();
      clearWindowRelease();
    };
  }, []);

  const backgroundColor = isLightMode ? "#ffffff" : "#111111";
  const outlineColor = isLightMode ? "#000000" : "#ffffff";
  const faceColor = isLightMode ? "#ffffff" : "#1a1a1a";
  const texturePath = isLightMode ? LIGHT_TEXTURE_PATH : DARK_TEXTURE_PATH;

  return (
    <div
      className="w-full h-screen touch-none relative overflow-hidden"
      style={{ backgroundColor }}
      onPointerDown={startHold}
    >
      <HoldCursorIndicator
        isHolding={actionPhase === PHASE_HOLDING}
        actionPhase={actionPhase}
        holdStartTime={holdStartTimeRef.current}
      />

      <button
        type="button"
        onClick={() => setIsLightMode((prev) => !prev)}
        className="absolute top-6 right-6 z-20 px-4 py-2 rounded-full border text-sm font-medium backdrop-blur-md"
        style={{
          backgroundColor: isLightMode
            ? "rgba(255,255,255,0.9)"
            : "rgba(17,17,17,0.75)",
          color: isLightMode ? "#111111" : "#ffffff",
          borderColor: isLightMode ? "#111111" : "#ffffff",
        }}
      >
        {isLightMode ? "Dark mode" : "Light mode"}
      </button>

      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <CameraShakeOnHold
          actionPhase={actionPhase}
          intensity={0.04}
          rotationIntensity={0.008}
          frequency={18}
          smooth={0.08}
        />

        <Suspense fallback={null}>
          <CubeParticlesModel
            modelPath="/assets/models/hyperiux-new-model.glb"
            texturePath={texturePath}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={0.25}
            particleCount={835}
            cubeSize={0.36}
            cubeScaleVariation={0.01}
            centerCubeScaleMin={0.72}
            middleBridgeScaleMin={0.42}
            middleBridgeXInfluence={0.34}
            middleBridgeYInfluence={0.18}
            modelOpacity={0.0}
            outlineColor={outlineColor}
            faceColor={faceColor}
            frontVector={[0, 0, 1]}
            frontBiasPower={1.2}
            backFill={0.05}
            edgeBoost={0.35}
            edgeOutwardBias={0.12}
            edgeJitter={0.06}
            gridSnapFactor={1}
            surfaceJitter={0.1}
            interactionRadius={2.5}
            maxShrink={1.5}
            minScaleMultiplier={4.0}
            scaleLerp={0.14}
            parallaxPositionStrength={0.06}
            parallaxRotationStrength={0.2}
            floatingCubeCount={42}
            floatingYStartOffset={2}
            floatingYEndOffset={2}
            floatingZMin={-6}
            floatingZMax={2.5}
            floatingScaleMin={0.08}
            floatingScaleMax={0.28}
            floatingSpeedMin={0.08}
            floatingSpeedMax={0.2}
            floatingRotationSpeedMax={1.1}
            floatingXSpreadMultiplier={1.25}
            actionPhase={actionPhase}
            holdStartTime={holdStartTimeRef.current}
            holdTriggerDuration={HOLD_TRIGGER_DURATION}
            burstKey={burstKey}
            explosionDuration={explosionDuration}
            explodedHoldDuration={explodedHoldDuration}
            reformDuration={reformDuration}
            holdShakeAmount={0.12}
            holdShakeSpeed={30}
            explosionSpreadX={0}
            explosionSpreadY={0}
            explosionForwardMin={-30.5}
            explosionForwardMax={30.2}
            explosionBackwardMin={-50.2}
            explosionBackwardMax={44.8}
            explosionRotateMax={1.4}
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls enabled={actionPhase === PHASE_IDLE} />
      </Canvas>
    </div>
  );
};

export default HyperiuxLogo;