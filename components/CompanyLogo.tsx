"use client";

import { useState } from "react";
import Image from "next/image";

interface CompanyLogoProps {
  src: string;
  name: string;
  size?: number;
  style?: React.CSSProperties;
  variant?: "color" | "plain";
}

// Generate consistent background color based on company name
function getMonogramColor(name: string): { bg: string; color: string } {
  const colors = [
    { bg: "#F3E6DC", color: "var(--accent)" },
    { bg: "#F0FDF4", color: "#16A34A" }, // Green
    { bg: "#FEF2F2", color: "#DC2626" }, // Red
    { bg: "#FFFBEB", color: "#D97706" }, // Amber
    { bg: "#F3E8FF", color: "#9333EA" }, // Purple
    { bg: "#ECFEFF", color: "#0891B2" }, // Cyan
    { bg: "#FCE7F3", color: "#DB2777" }, // Pink
    { bg: "#F1F5F9", color: "#475569" }, // Slate
  ];

  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export default function CompanyLogo({
  src,
  name,
  size = 40,
  style = {},
  variant = "color",
}: CompanyLogoProps) {
  const [error, setError] = useState(false);
  const colorScheme =
    variant === "plain"
      ? { bg: "#f7f3ec", color: "var(--ink)" }
      : getMonogramColor(name);
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  if (error || !src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "10px",
          background: colorScheme.bg,
          color: colorScheme.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: variant === "plain" ? '"Fraunces", Georgia, serif' : "inherit",
          fontWeight: variant === "plain" ? 500 : 700,
          fontSize: `${Math.max(12, Math.round(size * (variant === "plain" ? 0.42 : 0.45)))}px`,
          userSelect: "none",
          border: "1px solid rgba(0,0,0,0.06)",
          flexShrink: 0,
          ...style,
        }}
        aria-label={`${name} logo fallback`}
      >
        {initial}
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...style,
      }}
    >
      <Image
        src={src}
        alt={`${name} logo`}
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  );
}
