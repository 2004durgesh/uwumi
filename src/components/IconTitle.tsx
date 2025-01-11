import React from 'react';
import { GetProps, Text, XStack, styled } from 'tamagui';

interface IconTitleProps {
  icon?: React.ElementType;
  text: any;
  color?: string;
  iconProps?: Record<string, unknown>;
  textProps?: Partial<GetProps<typeof Text>>;
}

const IconText = styled(Text, {
  fontSize: 14,
  color: '$color1',
});

const IconContainer = styled(XStack, {
  alignItems: 'center',
  gap: 4,
});

const IconTitle = ({ icon: Icon, text, color, iconProps, textProps }: IconTitleProps) => {
  return (
    <IconContainer>
      {Icon && <Icon color={color ? color : '$color1'} size={16} {...iconProps} />}
      <IconText color={color ? color : '$color1'} {...textProps}>
        {text}
      </IconText>
    </IconContainer>
  );
};

export default IconTitle;
