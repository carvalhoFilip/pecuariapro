import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 180,
  height: 180,
};

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16a34a",
          color: "white",
          fontSize: 80,
          fontWeight: 800,
          borderRadius: 36,
          letterSpacing: -2,
        }}
      >
        PP
      </div>
    ),
    size,
  );
}
