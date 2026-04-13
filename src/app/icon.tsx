import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 512,
  height: 512,
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #14532d 0%, #16a34a 100%)",
          color: "white",
          fontSize: 210,
          fontWeight: 800,
          letterSpacing: -6,
        }}
      >
        PP
      </div>
    ),
    size,
  );
}
