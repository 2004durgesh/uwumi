/* eslint-disable react-hooks/rules-of-hooks */
import React, { forwardRef, useState, useCallback, useEffect } from 'react';
import { Platform, View, ViewProps, TouchableOpacity, findNodeHandle } from 'react-native';

interface TVFocusWrapperProps extends ViewProps {
  children: React.ReactNode;
  isFocusable?: boolean;
  style?: any;
  hasTVPreferredFocus?: boolean;
  nextFocusDown?: number;
  nextFocusUp?: number;
  nextFocusLeft?: number;
  nextFocusRight?: number;
  nextFocusSelf?: boolean; // Force next focus to self for circular navigation
  id?: string; // Identifier for debugging
  borderColor?: string;
  borderWidth?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  onPress?: () => void;
  onSelect?: () => void;
  activeOpacity?: number;
}

// Check if the app is running on TV (expand to include tvOS)
export const isTV =
  (Platform.OS === 'android' && !!Platform.isTV && Platform.Version >= 24) ||
  (Platform.OS === 'ios' && Platform.isTVOS === true);

export const getTVSafeInsets = () => {
  if (!isTV) {
    return undefined;
  }

  // TV safe insets
  const tvSafeInsets = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  return tvSafeInsets;
};

// Helper function to safely render children
const renderSafeChildren = (children: React.ReactNode): React.ReactNode => {
  // If no children, return null
  if (children == null) return null;

  // If it's already a valid React element or primitive type, return it directly
  if (
    typeof children === 'string' ||
    typeof children === 'number' ||
    typeof children === 'boolean' ||
    React.isValidElement(children)
  ) {
    return children;
  }

  // If it's an array, map through each child
  if (Array.isArray(children)) {
    return React.Children.map(children, (child) => renderSafeChildren(child));
  }

  // If it's an object but not a valid React element, stringify or return null
  return null;
};

const TVFocusWrapper = forwardRef<View, TVFocusWrapperProps>(
  (
    {
      children,
      isFocusable = true,
      hasTVPreferredFocus = false,
      style,
      borderColor = 'white',
      borderWidth = 2,
      onFocus,
      onBlur,
      onPress,
      onSelect,
      activeOpacity = 0.7,
      id, // For debugging
      nextFocusSelf = false,
      ...props
    },
    ref,
  ) => {
    // For non-TV platforms, simply render children directly
    if (!isTV) {
      return <>{renderSafeChildren(children)}</>;
    }

    // TV-specific implementation
    const [isFocused, setIsFocused] = useState(false);
    const elementRef = React.useRef<View | null>(null);

    // Combine refs
    const setRefs = useCallback(
      (node: View | null) => {
        // Save to our internal ref
        elementRef.current = node;

        // Forward to external ref if provided
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<View | null>).current = node;
        }
      },
      [ref],
    );

    // Set up self-referential focus if requested
    useEffect(() => {
      if (isTV && nextFocusSelf && elementRef.current) {
        const node = findNodeHandle(elementRef.current);
        if (node) {
          // This ensures focus stays within this element when navigating
          const selfFocusProps = {
            nextFocusUp: node,
            nextFocusDown: node,
            nextFocusLeft: node,
            nextFocusRight: node,
          };

          // Apply these props to the element
          if (elementRef.current) {
            Object.assign(elementRef.current, selfFocusProps);
          }
        }
      }
    }, [nextFocusSelf]);

    // Apply focus styles conditionally based on focus state
    const focusStyle = isFocused
      ? {
          borderColor: borderColor,
          borderWidth: borderWidth,
          borderRadius: 5, // Add slight border radius for better visual appearance
        }
      : {};

    // Handle focus event
    const handleFocus = useCallback(() => {
      setIsFocused(true);
      console.log(`[TV] Focus gained: ${id || 'unnamed element'}`);
      if (onFocus) onFocus();
    }, [onFocus, id]);

    // Handle blur event
    const handleBlur = useCallback(() => {
      setIsFocused(false);
      console.log(`[TV] Focus lost: ${id || 'unnamed element'}`);
      if (onBlur) onBlur();
    }, [onBlur, id]);

    // Handle press/select event
    const handlePress = useCallback(() => {
      console.log(`[TV] Pressed: ${id || 'unnamed element'}`);
      if (onPress) onPress();
      if (onSelect) onSelect();
    }, [onPress, onSelect, id]);

    // For TV with press handler, use TouchableOpacity for better remote feedback
    if (onPress || onSelect) {
      // Extract TV-specific props to avoid type conflicts
      const { nextFocusDown, nextFocusUp, nextFocusLeft, nextFocusRight, ...otherProps } = props;

      // Apply TV-specific props directly to the component
      return (
        // @ts-ignore
        <TouchableOpacity
          ref={setRefs as any}
          style={[style, focusStyle]}
          activeOpacity={activeOpacity}
          accessible={true}
          focusable={isFocusable}
          hasTVPreferredFocus={hasTVPreferredFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPress={handlePress}
          nextFocusDown={nextFocusDown}
          nextFocusUp={nextFocusUp}
          nextFocusLeft={nextFocusLeft}
          nextFocusRight={nextFocusRight}
          {...otherProps}>
          {renderSafeChildren(children)}
        </TouchableOpacity>
      );
    }

    // If no press handler, just use a focusable View
    return (
      <View
        ref={setRefs}
        style={[style, focusStyle]}
        accessible={true}
        focusable={isFocusable}
        hasTVPreferredFocus={hasTVPreferredFocus}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}>
        {renderSafeChildren(children)}
      </View>
    );
  },
);

TVFocusWrapper.displayName = 'TVFocusWrapper';

export default TVFocusWrapper;
