import React from 'react'
import {
    Text,
    XStack,
    styled,
  } from "tamagui";


interface IconTitleProps {
    icon?: React.ElementType;
    text: any;
  }


  const IconText = styled(Text, {
    fontSize: 14,
  });

  const IconContainer = styled(XStack, {
    alignItems: "center",
    gap: 4,
  });


const IconTitle = ({ icon: Icon, text }: IconTitleProps) => (
    <IconContainer>
      {Icon && <Icon size={16} />}
      <IconText>{text}</IconText>
    </IconContainer>
  );

export default IconTitle