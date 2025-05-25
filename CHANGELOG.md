# Changelog

## <small>2.4.1 (2025-05-25)</small>

* refactor: optimize components and gestures; add advanced ripple-button ([ef1aaaa](https://github.com/2004durgesh/uwumi/commit/ef1aaaa))
* fix(slider): using skia for better performant slider ([944909d](https://github.com/2004durgesh/uwumi/commit/944909d))

## 2.4.0 (2025-05-09)

* feat(himovies): add new movie provider ([a19943e](https://github.com/2004durgesh/uwumi/commit/a19943e))
* feat(netflixmirror): new movie provider ([c35b0e0](https://github.com/2004durgesh/uwumi/commit/c35b0e0))

## 2.3.0 (2025-04-27)

* feat: add version synchronization script for android and ios ([9530a23](https://github.com/2004durgesh/uwumi/commit/9530a23))
* feat: integrate react-native-consumet and tweak media queries & about ui ([6feb2d0](https://github.com/2004durgesh/uwumi/commit/6feb2d0))     
* feat: new animepahe provider and major changes for react-native-consumet ([fbdc32a](https://github.com/2004durgesh/uwumi/commit/fbdc32a))     

## <small>2.2.1 (2025-04-10)</small>

* chore: changes for new version ([4c50428](https://github.com/2004durgesh/uwumi/commit/4c50428))
* refactor: remove tv-support from main branch ([47bf34d](https://github.com/2004durgesh/uwumi/commit/47bf34d))
* fix(about, tabs): memoize heavy tasks in about and tabs layout ([3918647](https://github.com/2004durgesh/uwumi/commit/3918647))

## <small>2.1.1 (2025-04-05)</small>

* fix(release): use absolute path for build script and improve script directory handling ([222bd83](https://github.com/2004durgesh/uwumi/commit/222bd83))
* feat(about,update-checker): implement about screen and update checker hook ([4c090b5](https://github.com/2004durgesh/uwumi/commit/4c090b5))
* chore(readme): add env.local and update readme ([8dda059](https://github.com/2004durgesh/uwumi/commit/8dda059))


## v2.0.0 (2025-03-26)

### Chore

- *(release)* Bump version to 2.0.0 (fa72462)


### Features

- *(tvos)* Implement android tv feature (070f7fa)

## v1.0.1 (2025-03-20)

### Bug Fixes

- *(controls)* Adjust visibility logic and improve ripple button duration (9e0729e)

- *(controls | player)* Add auto-hide in controls and fixes in player and episodelist (76fe07d)


### Chore

- *(release)* Update version to 1.0.1 and regenerate changelog (6fba30e)

- *(changelog)* Update changelog with recent enhancements and organization improvements (5c87bd5)


### Features

- *(changelog)* Enhance changelog generation and organization; update pre-commit hook (a2a827c)

## v1.0.0 (2025-03-18)

### Features

- *(update)* Version comparison and download request dialog for new stable release (7149699)

- Add custom-slider component and integrate it into controls (030140a)

- Update theme handling and improve server initialization and ui-fixes (888432d)

- Make embed type boolean in watch queries; add season store & fix multi-season issue (dd9a367)

- Replace anime images with svg; update player & queries for movies (929f1de)

## v1.0.0-rc (2025-03-02)

### Chore

- Clean up build artifacts and add .gitignore for fullscreen module (2fbdee6)


### Features

- Update fullscreen module to set navigation and status bar colors to transparent (653fda7)

- Update fullscreen module configuration and clean up related code (2716d74)

- Enhance pre-commit hook for version consistency checks and update package version to rc (ebbbf3a)

- Complete husky setup with commitlint and lint-staged (6d22e94)

- Add fullscreen module with initial setup and configuration (eea7d08)

- Add favorites functionality, including favorites management and UI updates, and integrate lottie-react-native for animations (0472bd4)

- Update episode handling by enforcing uniqueId usage, refactor related state management, and clean up console logs (716203d)

- Enhance server and episode management, update type definitions, and clean up imports (235cb3b)

- Add server management functionality, including server selection and state management (c049e73)

- Update movie provider constants, enhance episode handling, and refactor related components (955db78)

- Add episode display mode enum, implement provider selection component, and refactor episode store (8114740)

- Enhance episode and movie season handling, update UI components (8f503f6)

- Update build scripts, enhance provider constants, and adjust package dependencies (0379b0b)

- Refactor SearchBar color handling , some ui changes in episodelist and clean up imports in read chapter component (3af13b2)

- Add read chapter functionality and improve chapters display (32260bd)

- Work on chapters has started (d158a72)

- Resuable tabs component, improve theme color for bottom-tabs (04d7868)

- Improve Settings layout, add RippleButton, and enhance splash screen visuals (d7428e2)

- Enhance theme handling by consolidating hook imports and adding pure black background support; update components for improved styling (4f01c48)

- Add pure black background option and hex to RGB utility; update theme handling in components and new ui for accent switching (2a4c716)

- Consolidate hooks imports and enhance theme handling across components (4960c81)

- Add Chapters component and integrate it into HorizontalTabs; update Settings layout and theme colors (5db1659)

- Restructure settings tab into a dedicated settings section; add appearance and about screens (8221f32)

- Add time formatting utility and integrate toast notifications for error handling; update dependencies (0c4568e)

- Add new stores for watch progress; refactor imports across components (4a7b1cc)

- Add meta provider types and integrate into media queries and components and dynamic api url for fetching based on env (e7ec0de)

- Replace ListEmpty component with NoResults and implement tab management in MediaBrowser (48add7b)

- Implement SearchBar component with debounced input and enhance ListEmpty component for better UX (9943aba)

- Add SearchBar component and update CardList layout for improved UI (68e5424)

- Add popular anime tab and integrate FlashList for improved performance (b905f1d)

- Integrate FlashList for improved episode list performance and enhance ControlsOverlay navigation (351df4e)

- Implement accent and theme stores with persistent storage, enhance themed components, and update layout (737b595)

- Add CustomImage and Similar components, enhance layout and queries, and update dependencies (a75c799)

- Add StatisticItem component and enhance ReadMore with improved animations (ae9d886)


### Other

- *(other)* Some code refactor and movie-episodes and anime dub (818ba56)

- *(other)* Git issue resolving (8e3eb5d)

- *(other)* Remove unused hook imports; clean up console log formatting (f86b168)

- *(other)* Add theme switcher UI and video quality settings (e0f00f8)

- *(other)* Some linting and formatting (f4ed17c)

- *(other)* The video works in prod (b466b68)

- *(other)* Stop tracking .tamagui directory (b7ba9e8)

- *(other)* First test-release (eb65a58)

- *(other)* Cardlist refetching solved (eb174bc)

- *(other)* Video issue solved (5b1521f)

- *(other)* First commit after prettier and eslint config (f91c538)

- *(other)* Just small refactor (180d5ff)

- *(other)* Implement current playing episode store and refactor episode list component (1b2c077)

- *(other)* Swipe auto close works (7fdc366)

- *(other)* Swipeable works (9a7477d)

- *(other)* Video works fine (4d0441c)

- *(other)* Rough expo-video solution (727945d)

- *(other)* Goinf back to expo-video (07e64b4)

- *(other)* Before media-console (3fae043)

- *(other)* Before expo prebuild clean (6739c70)

- *(other)* Before react-native-video (046dc3f)

- *(other)* Info screen complete,  watch screen added (7dfee5e)

- *(other)* Second commit (3fd3317)

- *(other)* Initial commit (e691ee0)


### Refactor

- Update ignore files for consistency and improve build script comments (44fdcd0)

- Added remove unused  via eslint and clean up component code and movie screen (cd7aa0e)

- Remove console logs and replace Pressable with CustomPressable for better event handling (77236a1)

- Remove unused movie queries and clean up imports in media queries (2d69771)

- Update episode management and enhance controls overlay functionality (45516ec)

- Remove .env file, update .gitignore, and enhance ReadMore component with animations (54fc59a)
