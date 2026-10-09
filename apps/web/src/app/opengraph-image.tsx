import { ImageResponse } from "next/og";

export const alt = "Transfert - Your files stay with you.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#18191d",
        color: "#fbfaf8",
        padding: "70px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          fontSize: "30px",
          fontWeight: 700,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "#f06c53",
          }}
        />
        Transfert
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", maxWidth: "920px" }}
      >
        <div
          style={{
            color: "#f06c53",
            fontSize: "19px",
            letterSpacing: "5px",
            textTransform: "uppercase",
          }}
        >
          Local-first file tools
        </div>
        <div
          style={{
            marginTop: "24px",
            fontSize: "82px",
            fontWeight: 700,
            letterSpacing: "-5px",
            lineHeight: 1,
          }}
        >
          Your files stay with you.
        </div>
      </div>
      <div style={{ display: "flex", fontSize: "25px", color: "#b6b6ba" }}>
        Convert, clean, and edit files without sending them anywhere.
      </div>
    </div>,
    size,
  );
}
