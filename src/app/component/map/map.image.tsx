import { Coordinate } from "@/services/tracking/tracking.interface";

// components/SvgMap.js
"use client";

import React, { useRef, useState } from "react";

const SvgMap = ({
  width = 1700,         // SVG width
  height = 1950,         // SVG height
  position,
}: {
  width: number,
  height: number,
  position: Coordinate
}) => {
  const containerRef = useRef(null);
  const [pos, setPos] = useState<Coordinate>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const scale = 0.5

  // Handle start of dragging (mouse and touch)
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  // Handle dragging (mouse and touch)
  const handleDragging = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const newX = clientX - startPos.x;
    const newY = clientY - startPos.y;
    setPos({ x: newX, y: newY });
  };

  // Mouse event handlers
  const handleMouseDown = (e: any) => handleDragStart(e.clientX, e.clientY);
  const handleMouseMove = (e: any) => handleDragging(e.clientX, e.clientY);
  const handleMouseUp = () => setIsDragging(false);

  // Touch event handlers
  const handleTouchStart = (e: any) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };
  
  const handleTouchMove = (e: any) => {
    const touch = e.touches[0];
    handleDragging(touch.clientX, touch.clientY);
  };
  
  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-gray-100 flex justify-center items-center bg-p_border"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "grab",
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        <svg width={width} height={height}>
          <image
            xlinkHref="/map.svg"
            x="0"
            y="0"
            width={width * scale}
            height={height * scale}
          />
        </svg>
      </div>
    </div>
  );
};

export default SvgMap;
