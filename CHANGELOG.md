# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-03-19

### Features

- fix(controls | player): add auto-hide in controls and fixes in player and episodelist [`76fe07d`](https://github.com/2004durgesh/uwumi/commit/76fe07d)
- feat(update): version comparison and download request dialog for new stable release [`7149699`](https://github.com/2004durgesh/uwumi/commit/7149699)
- feat: add custom-slider component and integrate it into controls [`030140a`](https://github.com/2004durgesh/uwumi/commit/030140a)
- feat: update theme handling and improve server initialization and ui-fixes [`888432d`](https://github.com/2004durgesh/uwumi/commit/888432d)
- feat: make embed type boolean in watch queries; add season store & fix multi-season issue [`dd9a367`](https://github.com/2004durgesh/uwumi/commit/dd9a367)
- feat: replace anime images with svg; update player & queries for movies [`929f1de`](https://github.com/2004durgesh/uwumi/commit/929f1de)
- feat: update fullscreen module to set navigation and status bar colors to transparent [`653fda7`](https://github.com/2004durgesh/uwumi/commit/653fda7)
- feat: update fullscreen module configuration and clean up related code [`2716d74`](https://github.com/2004durgesh/uwumi/commit/2716d74)
- feat: enhance pre-commit hook for version consistency checks and update package version to rc [`ebbbf3a`](https://github.com/2004durgesh/uwumi/commit/ebbbf3a)
- chore: clean up build artifacts and add .gitignore for fullscreen module [`2fbdee6`](https://github.com/2004durgesh/uwumi/commit/2fbdee6)
- feat: complete husky setup with commitlint and lint-staged [`6d22e94`](https://github.com/2004durgesh/uwumi/commit/6d22e94)
- feat: add fullscreen module with initial setup and configuration [`eea7d08`](https://github.com/2004durgesh/uwumi/commit/eea7d08)
- feat: add favorites functionality, including favorites management and UI updates, and integrate lottie-react-native for animations [`0472bd4`](https://github.com/2004durgesh/uwumi/commit/0472bd4)
- feat: update episode handling by enforcing uniqueId usage, refactor related state management, and clean up console logs [`716203d`](https://github.com/2004durgesh/uwumi/commit/716203d)
- feat: enhance server and episode management, update type definitions, and clean up imports [`235cb3b`](https://github.com/2004durgesh/uwumi/commit/235cb3b)
- feat: add server management functionality, including server selection and state management [`c049e73`](https://github.com/2004durgesh/uwumi/commit/c049e73)
- feat: update movie provider constants, enhance episode handling, and refactor related components [`955db78`](https://github.com/2004durgesh/uwumi/commit/955db78)
- feat: add episode display mode enum, implement provider selection component, and refactor episode store [`8114740`](https://github.com/2004durgesh/uwumi/commit/8114740)
- feat: enhance episode and movie season handling, update UI components [`8f503f6`](https://github.com/2004durgesh/uwumi/commit/8f503f6)
- feat: update build scripts, enhance provider constants, and adjust package dependencies [`0379b0b`](https://github.com/2004durgesh/uwumi/commit/0379b0b)
- feat: refactor SearchBar color handling , some ui changes in episodelist and clean up imports in read chapter component [`3af13b2`](https://github.com/2004durgesh/uwumi/commit/3af13b2)
- feat: add read chapter functionality and improve chapters display [`32260bd`](https://github.com/2004durgesh/uwumi/commit/32260bd)
- feat:work on chapters has started [`d158a72`](https://github.com/2004durgesh/uwumi/commit/d158a72)
- feat: resuable tabs component, improve theme color for bottom-tabs [`04d7868`](https://github.com/2004durgesh/uwumi/commit/04d7868)
- feat: improve Settings layout, add RippleButton, and enhance splash screen visuals [`d7428e2`](https://github.com/2004durgesh/uwumi/commit/d7428e2)
- feat: enhance theme handling by consolidating hook imports and adding pure black background support; update components for improved styling [`4f01c48`](https://github.com/2004durgesh/uwumi/commit/4f01c48)
- feat: add pure black background option and hex to RGB utility; update theme handling in components and new ui for accent switching [`2a4c716`](https://github.com/2004durgesh/uwumi/commit/2a4c716)
- feat: consolidate hooks imports and enhance theme handling across components [`4960c81`](https://github.com/2004durgesh/uwumi/commit/4960c81)
- feat: add Chapters component and integrate it into HorizontalTabs; update Settings layout and theme colors [`5db1659`](https://github.com/2004durgesh/uwumi/commit/5db1659)
- feat: restructure settings tab into a dedicated settings section; add appearance and about screens [`8221f32`](https://github.com/2004durgesh/uwumi/commit/8221f32)
- feat: add time formatting utility and integrate toast notifications for error handling; update dependencies [`0c4568e`](https://github.com/2004durgesh/uwumi/commit/0c4568e)
- feat: add new stores for watch progress; refactor imports across components [`4a7b1cc`](https://github.com/2004durgesh/uwumi/commit/4a7b1cc)
- feat: add meta provider types and integrate into media queries and components and dynamic api url for fetching based on env [`e7ec0de`](https://github.com/2004durgesh/uwumi/commit/e7ec0de)
- feat: replace ListEmpty component with NoResults and implement tab management in MediaBrowser [`48add7b`](https://github.com/2004durgesh/uwumi/commit/48add7b)
- feat: implement SearchBar component with debounced input and enhance ListEmpty component for better UX [`9943aba`](https://github.com/2004durgesh/uwumi/commit/9943aba)
- feat: add SearchBar component and update CardList layout for improved UI [`68e5424`](https://github.com/2004durgesh/uwumi/commit/68e5424)
- feat: add popular anime tab and integrate FlashList for improved performance [`b905f1d`](https://github.com/2004durgesh/uwumi/commit/b905f1d)
- feat: integrate FlashList for improved episode list performance and enhance ControlsOverlay navigation [`351df4e`](https://github.com/2004durgesh/uwumi/commit/351df4e)
- implement current playing episode store and refactor episode list component [`1b2c077`](https://github.com/2004durgesh/uwumi/commit/1b2c077)
- feat: implement accent and theme stores with persistent storage, enhance themed components, and update layout [`737b595`](https://github.com/2004durgesh/uwumi/commit/737b595)
- feat: add CustomImage and Similar components, enhance layout and queries, and update dependencies [`a75c799`](https://github.com/2004durgesh/uwumi/commit/a75c799)
- feat: add StatisticItem component and enhance ReadMore with improved animations [`ae9d886`](https://github.com/2004durgesh/uwumi/commit/ae9d886)

### Bug Fixes

- git issue resolving [`8e3eb5d`](https://github.com/2004durgesh/uwumi/commit/8e3eb5d)
- cardlist refetching solved [`eb174bc`](https://github.com/2004durgesh/uwumi/commit/eb174bc)
- video issue solved [`5b1521f`](https://github.com/2004durgesh/uwumi/commit/5b1521f)

### UI Enhancements

- Add theme switcher UI and video quality settings [`e0f00f8`](https://github.com/2004durgesh/uwumi/commit/e0f00f8)
- refactor: update ignore files for consistency and improve build script comments [`44fdcd0`](https://github.com/2004durgesh/uwumi/commit/44fdcd0)
- stop tracking .tamagui directory [`b7ba9e8`](https://github.com/2004durgesh/uwumi/commit/b7ba9e8)
- before expo prebuild clean [`6739c70`](https://github.com/2004durgesh/uwumi/commit/6739c70)

### Code Refactoring

- some code refactor and movie-episodes and anime dub [`818ba56`](https://github.com/2004durgesh/uwumi/commit/818ba56)
- remove unused hook imports; clean up console log formatting [`f86b168`](https://github.com/2004durgesh/uwumi/commit/f86b168)
- refactor: added remove unused  via eslint and clean up component code and movie screen [`cd7aa0e`](https://github.com/2004durgesh/uwumi/commit/cd7aa0e)
- refactor: remove console logs and replace Pressable with CustomPressable for better event handling [`77236a1`](https://github.com/2004durgesh/uwumi/commit/77236a1)
- refactor: remove unused movie queries and clean up imports in media queries [`2d69771`](https://github.com/2004durgesh/uwumi/commit/2d69771)
- refactor: update episode management and enhance controls overlay functionality [`45516ec`](https://github.com/2004durgesh/uwumi/commit/45516ec)
- just small refactor [`180d5ff`](https://github.com/2004durgesh/uwumi/commit/180d5ff)
- refactor: remove .env file, update .gitignore, and enhance ReadMore component with animations [`54fc59a`](https://github.com/2004durgesh/uwumi/commit/54fc59a)

### Testing

- first test-release [`eb65a58`](https://github.com/2004durgesh/uwumi/commit/eb65a58)

### Miscellaneous

- some linting and formatting [`f4ed17c`](https://github.com/2004durgesh/uwumi/commit/f4ed17c)
- the video works in prod [`b466b68`](https://github.com/2004durgesh/uwumi/commit/b466b68)
- swipe auto close works [`7fdc366`](https://github.com/2004durgesh/uwumi/commit/7fdc366)
- swipeable works [`9a7477d`](https://github.com/2004durgesh/uwumi/commit/9a7477d)
- video works fine [`4d0441c`](https://github.com/2004durgesh/uwumi/commit/4d0441c)
- rough expo-video solution [`727945d`](https://github.com/2004durgesh/uwumi/commit/727945d)
- goinf back to expo-video [`07e64b4`](https://github.com/2004durgesh/uwumi/commit/07e64b4)
- before media-console [`3fae043`](https://github.com/2004durgesh/uwumi/commit/3fae043)
- before react-native-video [`046dc3f`](https://github.com/2004durgesh/uwumi/commit/046dc3f)
- info screen complete,  watch screen added [`7dfee5e`](https://github.com/2004durgesh/uwumi/commit/7dfee5e)
- second commit [`3fd3317`](https://github.com/2004durgesh/uwumi/commit/3fd3317)

