# Skia Slider Component

This document provides an overview and usage guide for the **SkiaSlider** component, implemented using `@shopify/react-native-skia` and `react-native-gesture-handler`.

---

## Overview

**SkiaSlider** is a highly customizable slider component for React Native that can be oriented **horizontal** or **vertical**. Key features:

* Smooth, GPU-accelerated rendering via **Shopify Skia**
* Native gesture handling using **react-native-gesture-handler**
* Optional stepping, disabling, and snapping
* Customizable marks (with labels)
* Callbacks for start, change, and complete sliding events

---

## Installation

Install the required dependencies in your React Native project:

```bash
npm install @shopify/react-native-skia react-native-gesture-handler react-native-reanimated
# or
yarn add @shopify/react-native-skia react-native-gesture-handler react-native-reanimated
```

> **Note:** Follow the official setup instructions for **react-native-reanimated** and **@shopify/react-native-skia** to configure native modules, Babel plugin, and gesture-handler entry point.

---

## Usage

Wrap your app in `GestureHandlerRootView` and import `SkiaSlider`:

```tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SkiaSlider from './SkiaSlider';

const App = () => {
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.label}>
          Slider Value: {sliderValue.toFixed(2)}
        </Text>

        <SkiaSlider
          initialValue={sliderValue}
          onValueChange={setSliderValue}
          onSlidingStart={(v) => console.log('start', v)}
          onSlidingComplete={(v) => console.log('complete', v)}
          minValue={0}
          maxValue={100}
          step={1}
          width={300}
          height={50}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default App;
```

---

## Props

| Prop                 | Type                           | Default                                | Description                                                                   |
| -------------------- | ------------------------------ | -------------------------------------- | ----------------------------------------------------------------------------- |
| `width`              | `number`                       | `300`/`40`                             | Slider container width (based on orientation)                                 |
| `height`             | `number`                       | `40`/`300`                             | Slider container height (based on orientation)                                |
| `initialValue`       | `number`                       | `0`                                    | Starting slider value (clamped between `minValue` and `maxValue`)             |
| `orientation`        | `'horizontal'` \| `'vertical'` | `'horizontal'`                         | Layout orientation                                                            |
| `minValue`           | `number`                       | `0`                                    | Minimum slider value                                                          |
| `maxValue`           | `number`                       | `1`                                    | Maximum slider value                                                          |
| `step`               | `number`                       | `undefined`                            | Snap increment step (e.g. `0.1`, `1`)                                         |
| `trackColor`         | `string`                       | `'#cfafea'`                            | Inactive track color                                                          |
| `activeTrackColor`   | `string`                       | `'#2089DC'`                            | Filled track color                                                            |
| `thumbColor`         | `string`                       | `'#2089DC'`                            | Thumb (knob) color                                                            |
| `trackThickness`     | `number`                       | `4`                                    | Thickness of the track line                                                   |
| `thumbSize`          | `number`                       | `16 \| trackThickness*3 \| height/1.5` | Diameter of the thumb knob                                                    |
| `disabled`           | `boolean`                      | `false`                                | Disable all interaction and apply disabled colors                             |
| `disabledTrackColor` | `string`                       | `'#BDBDBD'`                            | Track color when disabled                                                     |
| `disabledThumbColor` | `string`                       | `'#BDBDBD'`                            | Thumb color when disabled                                                     |
| `marks`              | `Mark[]`                       | `[]`                                   | Array of `{ value: number; label?: string; }` to render marks along the track |
| `showMarks`          | `boolean`                      | `false`                                | Show or hide marks                                                            |
| `markColor`          | `string`                       | `'#BDBDBD'`                            | Color of mark dots                                                            |
| `showMarkLabels`     | `boolean`                      | `false`                                | Show labels for each mark                                                     |
| `markLabelColor`     | `string`                       | `'#757575'`                            | Color of mark labels                                                          |
| `markLabelFontSize`  | `number`                       | `10`                                   | Font size for mark labels                                                     |
| `markLabelFont`      | `SkFont \| null`               | `null`                                 | Custom Skia font for rendering mark labels                                    |
| `style`              | `ViewStyle`                    | `undefined`                            | Additional styling for the outer container                                    |
| `onSlidingStart`     | `(value: number) => void`      | `undefined`                            | Called when user begins dragging or tapping                                   |
| `onValueChange`      | `(value: number) => void`      | `undefined`                            | Called continuously as the slider position updates                            |
| `onSlidingComplete`  | `(value: number) => void`      | `undefined`                            | Called once when the drag or tap interaction completes                        |

---

## Examples

### Horizontal Slider with Controls

Demonstrates a slider used for video progress, integrated with play/pause and reset buttons.

```tsx
// example.tsx (excerpt)
<SkiaSlider
  initialValue={progress}
  onValueChange={setProgress}
  minValue={0}
  maxValue={duration}
  width={width}
  height={30}
  trackThickness={6}
/>
```

### Vertical Slider with Marks & Labels

Shows a vertical range slider with custom marks:

```tsx
<SkiaSlider
  orientation="vertical"
  initialValue={50}
  minValue={0}
  maxValue={100}
  step={10}
  showMarks
  marks={[{value: 0, label: '0%'}, {value:50, label:'50%'}, {value:100, label:'100%'}]}
  markColor="#333"
  showMarkLabels
  markLabelColor="#333"
  thumbSize={24}
/>
```

### Disabled State

```tsx
<SkiaSlider disabled initialValue={0.5} width={200} height={40} />
```

