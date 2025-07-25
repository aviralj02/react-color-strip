import React, { useRef, useEffect, useState, FC } from "react";
import { ColorStripProps, ColorValue } from "../types";
import { createColorFromHue, getHueFromColor } from "../lib/utils";
import "../index.css";

const ColorStrip: FC<ColorStripProps> = ({
  value = "#000000ff",
  width = 300,
  height = 20,
  disabled = false,
  pointer = {},
  style = {},
  rounded = 0,
  onChange,
  onChangeComplete,
}) => {
  const {
    width: pointerWidth = 12,
    height: pointerHeight = height,
    backgroundColor = "white",
    border = "none",
    borderRadius = "2px",
    boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    scaleOnDrag = true,
    dragScale = 1.1,
  } = pointer;

  const stripRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentHue, setCurrentHue] = useState(() => getHueFromColor(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);

    for (let i = 0; i <= 360; i += 30) {
      const hue = i % 360;
      gradient.addColorStop(i / 360, `hsl(${hue}, 100%, 50%)`);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  // Update hue when value prop changes
  useEffect(() => {
    const newHue = getHueFromColor(value);
    setCurrentHue(newHue);
  }, [value]);

  const getColorFromPosition = (x: number): ColorValue => {
    const hue = Math.max(0, Math.min(360, (x / width) * 360));
    return createColorFromHue(hue);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;

    e.preventDefault();
    setIsDragging(true);

    const rect = stripRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const color = getColorFromPosition(x);
    setCurrentHue(color.hsl.h);
    onChange?.(color);

    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disabled) return;

    e.preventDefault();

    const rect = stripRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const color = getColorFromPosition(x);
    setCurrentHue(color.hsl.h);
    onChange?.(color);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;

    setIsDragging(false);

    const rect = stripRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const color = getColorFromPosition(x);
    onChangeComplete?.(color);

    // Release pointer capture
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    let newHue = currentHue;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        newHue = Math.max(0, currentHue - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        newHue = Math.min(360, currentHue + 1);
        break;
      case "Home":
        e.preventDefault();
        newHue = 0;
        break;
      case "End":
        e.preventDefault();
        newHue = 360;
        break;
      default:
        return;
    }

    const color = createColorFromHue(newHue);
    setCurrentHue(newHue);
    onChange?.(color);
    onChangeComplete?.(color);
  };

  const pointerPosition = (currentHue / 360) * width;

  const transforms = [
    "translate(-50%, -50%)",
    isDragging && scaleOnDrag ? `scale(${dragScale})` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const pointerStyle: React.CSSProperties = {
    left: `${pointerPosition}px`,
    width: `${pointerWidth}px`,
    height: `${pointerHeight}px`,
    backgroundColor,
    border,
    borderRadius,
    boxShadow,
    transform: transforms,
    pointerEvents: "none",
    opacity: disabled ? "0.5" : "",
  };

  const colorStripStyle: React.CSSProperties = {
    opacity: disabled ? "0.5" : "",
    cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
    borderRadius: rounded,
  };

  return (
    <div
      ref={stripRef}
      className={`stripStyle`}
      style={{ width, height, ...colorStripStyle, ...style }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="slider"
      aria-label="Color hue selector"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={currentHue}
      aria-disabled={disabled}
    >
      <canvas
        ref={canvasRef}
        className={`canvasStyle`}
        style={{ width: "100%", height: "100%", borderRadius: rounded }}
      />

      {/* Pointer */}
      <div className={`pointer`} style={pointerStyle} />
    </div>
  );
};

export default ColorStrip;
