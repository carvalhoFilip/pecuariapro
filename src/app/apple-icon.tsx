import { ImageResponse } from "next/og";
import { Beef } from "lucide-react";

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
          borderRadius: 36,
        }}
      >
        <Beef size={96} strokeWidth={2.25} />
      </div>
    ),
    size,
  );
}
