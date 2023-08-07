//page.js
"use client";
import React, { useState, useEffect, useRef } from "react";
import Grid from "@/components/Grid/Grid";
import GameObject from "@/components/GameObject/GameObject.js";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const placeGameObject = (grid, gameObject, startX, startY) => {
    // Check if the gameObject fits into the grid
    if (
      startX + gameObject.width - 1 >= grid[0].length ||
      startY + gameObject.height - 1 >= grid.length
    ) {
      console.error(
        `GameObject ${gameObject.id} doesn't fit into the grid at position (${startX}, ${startY})`
      );
      return false;
    }

    for (let x = startX; x < startX + gameObject.width; x++) {
      for (let y = startY; y < startY + gameObject.height; y++) {
        if (grid[y][x] === null) {
          grid[y][x] = gameObject;
        } else {
          // There's already an object in this cell, aborting placement
          console.error(
            `Conflicting placement for gameObject ${gameObject.id} at position (${x}, ${y})`
          );
          return false;
        }
      }
    }

    return true;
  };

  // Example grid initialization
  const [grid, setGrid] = useState(() => {
    const columns = 60;
    const rows = 30;
    let newGrid = Array(rows)
      .fill()
      .map(() => Array(columns).fill(null));

    let gameObject0 = new GameObject(uuidv4(), "rc_left", 2, 2);
    let gameObject1 = new GameObject(uuidv4(), "rc_right", 2, 2);

    placeGameObject(newGrid, gameObject0, 14, 14);
    placeGameObject(newGrid, gameObject1, 44, 14);

    return newGrid;
  });

  const createEmptyGrid = () => {
    const columns = 60;
    const rows = 30;
    let newGrid = Array(rows)
      .fill()
      .map(() => Array(columns).fill(null));

    let gameObject0 = new GameObject(uuidv4(), "rc_left", 2, 2);
    let gameObject1 = new GameObject(uuidv4(), "rc_right", 2, 2);

    placeGameObject(newGrid, gameObject0, 14, 14);
    placeGameObject(newGrid, gameObject1, 44, 14);

    return newGrid;
  };

  const clearGrid = () => {
    setGrid(createEmptyGrid());
  };

  const saveGrid = () => {
    const gridData = JSON.stringify(grid);
    const blob = new Blob([gridData], { type: "text/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = `${fileName}.json`; // Use the fileName state variable here
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const loadGrid = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file ? file.name : null); // Add this line

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const gridData = JSON.parse(event.target.result);
        setGrid(gridData);
      };

      reader.readAsText(file);
    }
  };

  const [selectedType, setSelectedType] = useState("fang");
  const [placementPosition, setPlacementPosition] = useState(null);
  const [isRotated, setIsRotated] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [previewGameObject, setPreviewGameObject] = useState(null);
  const [fileName, setFileName] = useState("grid");

  useEffect(() => {
    let unitSize = UNIT_SIZES[selectedType];
    if (hoveredCell && unitSize) {
      const width = isRotated ? unitSize.h : unitSize.w;
      const height = isRotated ? unitSize.w : unitSize.h;
      let previewObject = new GameObject(
        "preview",
        selectedType,
        width,
        height,
        hoveredCell.x,
        hoveredCell.y
      );

      if (
        canPlaceGameObject(grid, previewObject, hoveredCell.x, hoveredCell.y)
      ) {
        setPreviewGameObject(previewObject);
      } else {
        setPreviewGameObject(null);
      }
    }

    // Display in the console the grid and it's contents for debugging
    console.log(grid);
  }, [hoveredCell, selectedType, isRotated]);

  const UNIT_SIZES = {
    /* SQUAD UNITS */
    fang: { w: 5, h: 2 },
    crawler: { w: 5, h: 2 },
    mustang: { w: 5, h: 2 },
    sledgehammer: { w: 5, h: 2 },
    steelball: { w: 5, h: 2 },
    stormcaller: { w: 5, h: 2 },
    wasp: { w: 5, h: 2 },

    /* Giant Units */
    overlord: { w: 4, h: 4 },
    meltingpoint: { w: 4, h: 4 },
    fortress: { w: 4, h: 4 },
    vulcan: { w: 4, h: 4 },

    /* SINGLE UNITS */
    arclight: { w: 2, h: 2 },
    marksman: { w: 2, h: 2 },

    /* MEDIUM UNITS */
    hacker: { w: 3, h: 3 },
    rhino: { w: 3, h: 3 },

    /* SMALL UNITS */
    phoenix: { w: 4, h: 2 },
  };

  const canPlaceGameObject = (grid, gameObject, startX, startY) => {
    // Check if the object would overflow from the grid
    if (
      startX + gameObject.width > grid[0].length ||
      startY + gameObject.height > grid.length
    ) {
      return false;
    }

    // If not, verify each cell is empty
    for (let x = startX; x < startX + gameObject.width; x++) {
      for (let y = startY; y < startY + gameObject.height; y++) {
        if (grid[y][x] !== null) {
          return false;
        }
      }
    }

    return true;
  };

  const handleCellClick = (x, y) => {
    setPlacementPosition({ x, y });

    // Create a new game object with the selected type
    let unitSize = UNIT_SIZES[selectedType];

    if (unitSize) {
      const width = isRotated ? unitSize.h : unitSize.w;
      const height = isRotated ? unitSize.w : unitSize.h;

      let gameObject = new GameObject(
        uuidv4(),
        selectedType,
        width,
        height,
        x,
        y
      );

      if (gameObject) {
        const newGrid = [...grid]; // Create a copy of the grid
        // Check if gameObject can be placed on the grid
        if (canPlaceGameObject(newGrid, gameObject, x, y)) {
          placeGameObject(newGrid, gameObject, x, y);
          setGrid(newGrid);
        } else {
          // Handle the case when the gameObject can't be placed
          console.error(
            `Invalid placement for gameObject ${gameObject.id} at position (${x}, ${y})`
          );
        }
      }
    }
  };

  // Combine hoveredCell, previewCells, and previewGameObject into a single state
  const [hoverState, setHoverState] = useState({
    hoveredCell: null,
    previewCells: [],
    previewGameObject: null,
  });

  const handleCellMouseEnter = (x, y) => {
    let unitSize = UNIT_SIZES[selectedType];
    if (unitSize) {
      const width = isRotated ? unitSize.h : unitSize.w;
      const height = isRotated ? unitSize.w : unitSize.h;
      let previewObject = new GameObject(
        "preview",
        selectedType,
        width,
        height
      );

      if (canPlaceGameObject(grid, previewObject, x, y)) {
        const newHoveredCell = { x, y };
        const cells = [];
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
            // Here, make sure the cell coordinates are within the grid
            if (x + i < grid[0].length && y + j < grid.length) {
              cells.push({ x: x + i, y: y + j });
            }
          }
        }

        // Set the new hover state with updated values
        setHoverState({
          hoveredCell: newHoveredCell,
          previewCells: cells,
          previewGameObject: previewObject,
        });
      } else {
        // Clear the hover state
        setHoverState({
          hoveredCell: null,
          previewCells: [],
          previewGameObject: null,
        });
      }
    }
  };

  const handleCellMouseLeave = () => {
    // Clear the hovered cell
    setHoveredCell(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center">
          <button
            className="p-2 mx-2 bg-slate-400 cursor-pointer rounded-md shadow-sm"
            onClick={saveGrid}
          >
            Save Grid
          </button>
          <input
            className="p-2 m-2 bg-slate-400"
            type="text"
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
          />
        </div>
        <div className="flex items-center mt-4">
          <label
            htmlFor="file"
            className="p-2 bg-slate-400 cursor-pointer rounded-md shadow-sm text-white"
          >
            Load Grid
          </label>
          <input id="file" className="hidden" type="file" onChange={loadGrid} />
          {selectedFile && (
            <span className="ml-2 text-sm text-white">
              Loaded File: {selectedFile}
            </span>
          )}
        </div>
      </div>
      <div className="my-4">
        Select a unit to place: &nbsp;
        <select
          className="text-slate-800"
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
        >
          <option value="arclight">Arclight</option>
          <option value="crawler">Crawler</option>
          <option value="fang">Fang</option>
          <option value="fortress">Fortress</option>
          <option value="hacker">Hacker</option>
          <option value="marksman">Marksman</option>
          <option value="meltingpoint">Melting Point</option>
          <option value="mustang">Mustang</option>
          <option value="overlord">Overlord</option>
          <option value="phoenix">Phoenix</option>
          <option value="rhino">Rhino</option>
          <option value="sledgehammer">Sledgehammer</option>
          <option value="steelball">Steel Ball</option>
          <option value="stormcaller">Stormcaller</option>
          <option value="vulcan">Vulcan</option>
          <option value="wasp">Wasp</option>
        </select>
        <input
          className="ml-2"
          type="checkbox"
          checked={isRotated}
          onChange={(event) => setIsRotated(event.target.checked)}
        />
        <label className="mx-1">Rotate Unit</label>
        <button
          className="p-2 mx-2 bg-slate-400 cursor-pointer rounded-md shadow-sm"
          onClick={clearGrid}
        >
          Clear Grid
        </button>
      </div>
      <div>
        <Grid
          grid={grid}
          onCellClick={handleCellClick}
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseLeave={handleCellMouseLeave}
          hoveredCell={hoveredCell}
          selectedType={selectedType}
          isRotated={isRotated}
          UNIT_SIZES={UNIT_SIZES}
          previewCells={hoverState.previewCells}
          previewGameObject={previewGameObject}
        />
      </div>
    </main>
  );
}
