
# RTSMMORPG Prototype — Version 0.2

## Overview
This project is an experimental RTS + MMO hybrid engine prototype.
The focus is on **correct world logic, spatial consistency, and long-term scalability**
before adding gameplay complexity.

Version **0.2** finalizes the foundational architecture for:
- Multi-atlas world representation
- Player-centric coordinate truth
- Translator-based atlas communication
- Scene → Viewport → Browser contracts
- Stable camera centering

This is a **logic milestone**, not a content milestone.

---

## Atlases

### Overworld Atlas
- Lowest resolution
- Represents the planetary map
- Tiles represent regions (temperature / biome later)
- One tile is always flagged as `active`

### Minimap Atlas
- Medium resolution
- Each overworld tile expands into a 20×20 grid
- Used for regional navigation
- Movement here can advance overworld tiles

### InGame Atlas (planned)
- High resolution
- Structures, units, fog of war
- Procedurally derived from minimap data

---

## Core Principles
- Player coordinates are the single source of truth
- Atlases never guess positions
- Rendering never mutates logic
- Scenes declare camera needs
- SceneManager enforces canvas resolution
- Browser never clips or rescales gameplay

---

## Controls (current)
W A S D  — Move  
E        — Enter Minimap (from Overworld)  
ESC      — Return to Overworld  

---

## Version
**v0.2 — World, Camera, and Viewport Stability**
