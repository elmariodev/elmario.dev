import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Mario Montano, full-stack engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// elmariodev "Mango" brand tokens (youtube repo, brand/tokens.css).
const brand = {
  ground: "#17131f",
  text: "#f6f1ea",
  muted: "#a299ae",
  accent: "#ffb224",
};

const asset = (path: string) => readFile(join(process.cwd(), "assets", path));

export default async function OpenGraphImage() {
  const [archivoBlack, montserratBlack, monoBold, monoRegular, logo] =
    await Promise.all([
      asset("fonts/ArchivoBlack-Regular.ttf"),
      asset("fonts/Montserrat-Black.ttf"),
      asset("fonts/JetBrainsMono-Bold.ttf"),
      asset("fonts/JetBrainsMono-Regular.ttf"),
      asset("brand/logo.png"),
    ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: brand.ground,
          color: brand.text,
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 40 }}>
            <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, color: brand.muted }}>
              el
            </span>
            <span style={{ fontFamily: "Montserrat", fontWeight: 900 }}>mario</span>
            <span style={{ fontFamily: "JetBrains Mono", fontWeight: 700, color: brand.accent }}>
              dev
            </span>
          </div>

          <div
            style={{
              display: "flex",
              maxWidth: 680,
              fontFamily: "Archivo Black",
              fontSize: 60,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            AI agents, automation, and the apps around them.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", fontFamily: "Montserrat", fontWeight: 900, fontSize: 30 }}>
              Mario Montano
            </div>
            <div
              style={{
                display: "flex",
                gap: 20,
                fontFamily: "JetBrains Mono",
                fontWeight: 400,
                fontSize: 18,
                color: brand.muted,
              }}
            >
              <span>Full-stack engineer</span>
              <span>TypeScript</span>
              <span>Agent orchestration</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={`data:image/png;base64,${logo.toString("base64")}`}
            width={360}
            height={360}
            alt=""
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Black", data: archivoBlack, weight: 400, style: "normal" },
        { name: "Montserrat", data: montserratBlack, weight: 900, style: "normal" },
        { name: "JetBrains Mono", data: monoBold, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: monoRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
