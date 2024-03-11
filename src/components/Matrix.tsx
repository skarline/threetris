import { HTMLAttributes } from "react"

import { UI } from "@/constants/ui"

import { Block } from "./Block"

export type MatrixProps = Threetris.Matrix & HTMLAttributes<HTMLDivElement>

export function Matrix({ blocks, width, height, ...rest }: MatrixProps) {
  return (
    <div
      {...rest}
      css={{
        display: "grid",
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
        position: "relative",
        width: `${width * UI.BlockSize}px`,
        maxWidth: "100%",
        aspectRatio: `${width}/${height}`,
      }}
    >
      {blocks.map(({ x, y, type }, index) => {
        if (!type) return null

        return (
          <div
            css={{
              gridColumn: x + 1,
              gridRow: height - y,
            }}
            key={index}
          >
            <Block key={index} type={type} />
          </div>
        )
      })}
    </div>
  )
}
