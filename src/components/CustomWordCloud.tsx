"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type WordPlacement = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type SvgWordCloudProps = {
  words: string[];
  width?: number;
  height?: number;
  fontSize?: number;
  maxAttempts?: number;
};

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;
const DEFAULT_FONT_SIZE = 18;

const randomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 45%)`;
};

const estimateTextSize = (text: string, fontSize: number) => ({
  width: text.length * fontSize * 0.6,
  height: fontSize,
});

const doesOverlap = (
  a: WordPlacement,
  b: WordPlacement,
  padding = 4,
): boolean => {
  return !(
    a.x + a.width + padding < b.x ||
    a.x > b.x + b.width + padding ||
    a.y + a.height + padding < b.y ||
    a.y > b.y + b.height + padding
  );
};

const CustomWordCloud = ({
  words,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  fontSize = DEFAULT_FONT_SIZE,
  maxAttempts = 60,
}: SvgWordCloudProps) => {
  const router = useRouter();
  const [placedWords, setPlacedWords] = useState<WordPlacement[]>([]);

  useEffect(() => {
    const placements: WordPlacement[] = [];

    words.forEach((word) => {
      const { width: textWidth, height: textHeight } = estimateTextSize(
        word,
        fontSize,
      );

      let placed = false;

      for (let i = 0; i < maxAttempts; i++) {
        const x = Math.random() * (width - textWidth);
        const y = Math.random() * (height - textHeight) + textHeight;

        const candidate: WordPlacement = {
          text: word,
          x,
          y,
          width: textWidth,
          height: textHeight,
          color: randomColor(),
        };

        const overlaps = placements.some((p) => doesOverlap(candidate, p));

        if (!overlaps) {
          placements.push(candidate);
          placed = true;
          break;
        }
      }

      if (!placed) {
        placements.push({
          text: word,
          x: Math.random() * (width - textWidth),
          y: Math.random() * (height - textHeight) + textHeight,
          width: textWidth,
          height: textHeight,
          color: randomColor(),
        });
      }
    });

    setPlacedWords(placements);
  }, [words, width, height, fontSize, maxAttempts]);

  return (
    <svg width="100%" height={height}>
      {placedWords.map((word, index) => (
        <text
          className="cursor-pointer"
          onClick={() => router.push("/quiz?topic=" + encodeURIComponent(word.text))}
          key={`${word.text}-${index}`}
          x={word.x}
          y={word.y}
          fontSize={fontSize}
          fill={word.color}
          fontFamily="system-ui, sans-serif"
        >
          {word.text}
        </text>
      ))}
    </svg>
  );
};

export default CustomWordCloud;
