import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Text, Stack, View } from "tamagui";
import { TouchableOpacity } from "react-native";
import { ChevronDown } from "@tamagui/lucide-icons";
import React, { useState } from "react";

type ReadMoreProps = {
  children: string;
  previewLines?: number;
  lineHeight?: number;
};

const ReadMore: React.FC<ReadMoreProps> = ({
  children,
  previewLines = 3,
  lineHeight = 20,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  return (
    <View position="relative">
      <View marginTop="$2">
        <View
          onLayout={(event) =>
            setContentHeight(event.nativeEvent.layout.height)
          }
        >
          <Text
            color="$color1"
            paddingHorizontal='$2'
            lineHeight='$3.5'
            textAlign="justify"
          >
            {children}
          </Text>
        </View>
      </View>
      <View height='100%'>
        {/* Animated description view */}
        <MotiView
          from={{
            translateY: -contentHeight,
          }}
          animate={{
            translateY: isExpanded ? 0 : -contentHeight + lineHeight,
          }}
          transition={{
            type: "timing",
            duration: 500,
          }}
          style={{
            overflow: "hidden",
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        >
          <LinearGradient
            locations={[0, 0.05, 0.1]}
            colors={[
              "rgba(0, 0, 0, 0.5)",
              "rgba(0, 0, 0, 0.7)",
              "rgba(0, 0, 0, 1)",
            ]}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.0, y: 0.1 }}
            style={{ height: "100%", width: "100%" }}
          >
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              {/* Animated icon rotation */}
              <MotiView
                style={{ alignItems: 'center', padding: 8 }}
                from={{
                  rotate: "180deg",
                }}
                animate={{
                  rotate: isExpanded ? "180deg" : "0deg",
                }}
                transition={{
                  type: "timing",
                  duration: 500,
                }}
              >
                <ChevronDown size={24} color="$color" />
              </MotiView>
            </TouchableOpacity>
          </LinearGradient>
        </MotiView>
      </View>
    </View>
  );
};

export default ReadMore;
