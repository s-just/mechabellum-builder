//Grid.jsx
import React from "react";
import Cell from "@/components/Cell/Cell";
import GameObjectDisplay from "@/components/GameObject/GameObjectDisplay";

const Grid = ({
  grid,
  onCellClick,
  onCellMouseEnter,
  onCellMouseLeave,
  selectedType,
  isRotated,
  hoveredCell,
  UNIT_SIZES,
  previewCells,
  previewGameObject,
}) => {
  return (
    <div
      style={{
        gap: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${grid.length}, 1fr)`,
        position: "relative", // This is necessary to position the preview layer correctly
      }}
    >
      {grid.flatMap((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          // Check if the cell is null
          if (cell === null) {
            return (
              <Cell
                key={`${rowIndex}-${columnIndex}`}
                onClick={() => onCellClick(columnIndex, rowIndex)}
                onMouseEnter={() => onCellMouseEnter(columnIndex, rowIndex)}
                onMouseLeave={() => onCellMouseLeave(columnIndex, rowIndex)}
                isHovered={previewCells.some(
                  (pCell) => pCell.x === columnIndex && pCell.y === rowIndex
                )}
              />
            );
          } else {
            // Only render a GameObjectDisplay for the top-left cell of each GameObject
            if (
              (columnIndex === 0 ||
                grid[rowIndex][columnIndex - 1]?.id !== cell.id) &&
              (rowIndex === 0 ||
                grid[rowIndex - 1][columnIndex]?.id !== cell.id)
            ) {
              return (
                <GameObjectDisplay
                  key={`${rowIndex}-${columnIndex}`}
                  gameObject={cell}
                  style={{
                    gridColumnStart: columnIndex + 1, // Grid columns and rows are 1-based
                    gridRowStart: rowIndex + 1,
                    gridColumnEnd: `span ${Math.min(
                      cell.width,
                      grid[0].length - columnIndex
                    )}`,
                    gridRowEnd: `span ${Math.min(
                      cell.height,
                      grid.length - rowIndex
                    )}`,
                  }}
                />
              );
            } else {
              // Return a null element when the cell is part of a GameObject but we don't want to render a GameObjectDisplay
              return <React.Fragment key={`${rowIndex}-${columnIndex}`} />;
            }
          }
        })
      )}

      {hoveredCell && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
            gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          }}
        >
          {previewGameObject && (
            <GameObjectDisplay
              style={{
                // style for the preview object
                gridColumnStart: previewGameObject.x + 1,
                gridRowStart: previewGameObject.y + 1,
                gridColumnEnd: `span ${previewGameObject.width}`,
                gridRowEnd: `span ${previewGameObject.height}`,
              }}
              gameObject={previewGameObject}
              isPreview={true}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Grid;
