import { ImageResponse } from "next/og"

export const dynamic = "force-static"

export const size = {
  width: 180,
  height: 180,
}

export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(180deg, #10233c 0%, #0d1d33 52%, #0a1628 100%)",
          display: "flex",
          height: "180px",
          justifyContent: "center",
          position: "relative",
          width: "180px",
        }}
      >
        <div
          style={{
            background: "#7ecfb3",
            borderRadius: "999px",
            height: "20px",
            opacity: 0.95,
            position: "absolute",
            right: "38px",
            top: "28px",
            width: "20px",
          }}
        />
        <div
          style={{
            borderBottom: "58px solid #28435e",
            borderLeft: "34px solid transparent",
            borderRight: "34px solid transparent",
            bottom: "38px",
            height: 0,
            left: "22px",
            position: "absolute",
            width: 0,
          }}
        />
        <div
          style={{
            borderBottom: "94px solid #dbe9f4",
            borderLeft: "56px solid transparent",
            borderRight: "56px solid transparent",
            bottom: "38px",
            height: 0,
            position: "absolute",
            right: "16px",
            width: 0,
          }}
        />
        <div
          style={{
            borderBottom: "28px solid #ffffff",
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            bottom: "104px",
            height: 0,
            position: "absolute",
            right: "57px",
            width: 0,
          }}
        />
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          style={{
            bottom: "28px",
            position: "absolute",
            right: "18px",
          }}
        >
          <path
            d="M14 34 L26 46 L50 20"
            fill="none"
            stroke="#4caf50"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="7"
          />
        </svg>
      </div>
    ),
    size
  )
}
