# Plinko Game - Rewritten Version

## Overview
This is a complete rewrite of the Plinko idle/clicker game using modern JavaScript ES6+ practices including:
- ES6 Modules
- Classes and proper OOP
- Separation of concerns
- Clean architecture with managers
- No global variables
- Proper encapsulation

## Project Structure

```
plinko/
├── index.html              # Main HTML file
├── test.html              # Test page for debugging
├── CSS/
│   └── game.css           # Game styles
├── JS/
│   ├── main.js            # Entry point
│   ├── config/            # Configuration files
│   │   ├── GameConfig.js  # Main game configuration
│   │   ├── SpawnConfig.js # Ball spawn configurations
│   │   └── TokenConfig.js # Token upgrade configurations
│   ├── managers/          # Game state and logic managers
│   │   ├── GameState.js   # Central game state
│   │   ├── SaveManager.js # Save/load functionality
│   │   ├── UIManager.js   # UI updates and interactions
│   │   ├── BallManager.js # Ball physics and lifecycle
│   │   ├── ZoneManager.js # Zone/level management
│   │   └── AdManager.js   # Ad system and bonuses
│   ├── scenes/            # Phaser scenes
│   │   ├── TitleScene.js  # Title/menu scene
│   │   └── GameScene.js   # Main game scene
│   ├── utils/             # Utility classes
│   │   └── NumberFormatter.js # Number formatting
│   └── assets/            # Game assets (images, etc.)
```

## How to Run

1. Start a local web server (Python example):
   ```bash
   cd c:\code\plinko
   python -m http.server 8080
   ```

2. Open your browser to:
   ```
   http://localhost:8080
   ```

3. For testing/debugging, you can use:
   ```
   http://localhost:8080/test.html
   ```

## Testing for Errors

### Browser Developer Console
1. Open your browser's developer tools (F12)
2. Check the Console tab for JavaScript errors
3. Common issues to look for:
   - Module loading errors (404s)
   - Syntax errors
   - Reference errors (undefined variables)

### Common Fixes

#### CORS/Module Errors
- Make sure you're using a proper web server (not file://)
- Check that all file paths are correct
- Ensure .js extensions are included in imports

#### Phaser Errors
- Verify Phaser CDN is loading
- Check camera bounds settings
- Ensure sprites are loaded before use

#### Decimal.js Errors
- Make sure Decimal.js CDN is loaded
- Check that all currency values use new Decimal()

## Features

### Game Mechanics
- **Ball Spawning**: Balls spawn automatically and fall through obstacles
- **Zones**: 8 different zones with unique obstacle patterns
- **Upgrades**: Upgrade balls (10 types) and zones (8 types)
- **Prestige**: Reset progress for tokens that provide permanent bonuses
- **Offline Progress**: Earn gold while away
- **Click Mechanic**: Click to explode balls for bonus multipliers
- **Ad Bonuses**: Optional video ads for temporary boosts

### Technical Features
- **Auto-save**: Game saves every 2000 frames (about 33 seconds)
- **Manual Save**: Save button in help menu
- **Number Formats**: Engineering, Scientific, Traditional notations
- **Responsive**: Camera follows gameplay area
- **Smooth Physics**: Matter.js physics engine

## Architecture Highlights

### Managers
Each manager handles a specific aspect of the game:
- **GameState**: Tracks all game data (gold, tokens, upgrades)
- **SaveManager**: Handles localStorage operations
- **UIManager**: Updates DOM elements and handles user input
- **BallManager**: Creates and updates ball sprites
- **ZoneManager**: Creates zones and obstacle patterns
- **AdManager**: Manages ad system and bonus timers

### Data Flow
1. User action → UIManager → GameState
2. GameState updates → UIManager refreshes display
3. Physics updates → Managers → GameState
4. GameState changes → Auto-save

## Differences from Original

### Improvements
- ✅ All code uses ES6+ syntax (classes, arrow functions, const/let)
- ✅ No global variables (except necessary Phaser/scene references)
- ✅ Modular architecture with imports/exports
- ✅ Clear separation of concerns
- ✅ Better code organization
- ✅ More maintainable and testable
- ✅ Proper error handling

### Maintained Features
- ✅ All original gameplay mechanics
- ✅ Save/load system
- ✅ All upgrade systems
- ✅ Ad integration support
- ✅ Offline progress
- ✅ Same visual design

## Known Limitations

- Ad system (cpmstar) is optional - game works without it
- GameAnalytics removed (can be re-added if needed)
- Requires ES6 module support (modern browsers)

## Debugging Tips

### Module Not Found Errors
Check that file paths match exactly:
```javascript
// Correct
import { GameConfig } from './config/GameConfig.js';

// Wrong (missing .js)
import { GameConfig } from './config/GameConfig';
```

### Decimal.js Errors
All currency must use Decimal:
```javascript
// Correct
this.gold = new Decimal(100);

// Wrong
this.gold = 100;
```

### Phaser Scene Errors
Ensure scenes are added to config:
```javascript
const config = {
  ...PHASER_CONFIG,
  scene: [TitleScene, GameScene]
};
```

## Future Enhancements

- TypeScript conversion
- Unit tests
- Performance optimizations
- Additional game modes
- More upgrade types
- Achievement system
- Cloud saves

## Credits

Original game concept and design: [Original Author]
Complete rewrite: Modern ES6+ JavaScript implementation
Physics: Phaser 3 with Matter.js
Number handling: Decimal.js
