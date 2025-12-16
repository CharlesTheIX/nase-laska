# RPG Game

A TypeScript-based RPG game built with HTML5 Canvas and Webpack.

## Description

This is a 2D RPG game featuring menu navigation, resource loading (images, audio, JSON), and state-based game management. It uses a custom game engine with canvas rendering, input handling, and asset management.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd rpg
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Build the project:

   ```bash
   yarn build
   ```

4. Start the development server:
   ```bash
   yarn start
   ```

## Usage

Open `index.html` in a web browser or use the development server. Navigate menus with arrow keys, select with Space/Enter.

## Features

- **State Management**: Start screen and settings screen with menu navigation.
- **Resource Loading**: Asynchronous loading of images, audio, and JSON data.
- **Input Handling**: Debounced keyboard input for smooth menu navigation.
- **Audio Playback**: Sound effects and background music support.
- **Canvas Rendering**: Custom drawing utilities for text, images, and shapes.
- **Storage**: Local storage for save data.

## To-Do List

### Core Gameplay

- [ ] Implement "Load Game" functionality in Start state
- [ ] Implement "New Game" functionality to transition to gameplay
- [ ] Add gameplay state (e.g., world map, character movement)
- [ ] Implement save/load system for game progress

### Audio Enhancements

- [ ] Add volume controls for audio (master, SFX, music)
- [ ] Implement audio fading (e.g., for state transitions)
- [ ] Add support for multiple audio instances (e.g., overlapping sounds)
- [ ] Add audio duration checking and progress tracking

### UI/UX Improvements

- [ ] Add cursor indicator (arrow) to menu selection
- [ ] Implement settings screen functionality (e.g., language, audio settings)
- [ ] Add loading progress bar for resources
- [ ] Improve error handling and user feedback

### Assets and Content

- [ ] Add placeholder audio files (menu_move.wav, menu_select.wav, background.mp3)
- [ ] Add more background images and sprites
- [ ] Create JSON data files for game content (levels, dialogs, etc.)
- [ ] Add localization support for more languages

### Performance and Optimization

- [ ] Optimize canvas rendering (e.g., offscreen rendering, sprite batching)
- [ ] Implement resource unloading for unused assets
- [ ] Add frame rate limiting and performance monitoring
- [ ] Optimize bundle size (e.g., code splitting, asset compression)

### Development and Testing

- [ ] Add unit tests for core classes (Timer, Resources, etc.)
- [ ] Add integration tests for game states
- [ ] Set up CI/CD pipeline
- [ ] Add TypeScript strict mode and linting

### Advanced Features

- [ ] Add particle effects system
- [ ] Implement collision detection
- [ ] Add animation system for sprites
- [ ] Add multiplayer support (if applicable)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
