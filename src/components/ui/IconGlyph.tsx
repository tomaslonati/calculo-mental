// Iconos simples hechos con SVG para no depender de @expo/vector-icons.
// Mantenemos un set acotado: el necesario para la app.
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';

import { colors } from '../../constants/theme';

type IconName =
  | 'play'
  | 'history'
  | 'settings'
  | 'check'
  | 'close'
  | 'chevron-right'
  | 'chevron-left'
  | 'trophy'
  | 'flash'
  | 'clock'
  | 'target'
  | 'sparkles'
  | 'trash'
  | 'arrow-right'
  | 'arrow-back'
  | 'backspace';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

export const IconGlyph = ({ name, size = 22, color = colors.text }: Props) => {
  const stroke = color;
  const strokeWidth = 2;

  switch (name) {
    case 'play':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 5l12 7-12 7V5z" fill={color} />
        </Svg>
      );
    case 'history':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 12a9 9 0 109-9"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M3 4v5h5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M12 7v5l3 2" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'settings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={3} stroke={stroke} strokeWidth={strokeWidth} />
          <Path
            d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 12l5 5L20 6" stroke={stroke} strokeWidth={strokeWidth + 0.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Line x1={6} y1={6} x2={18} y2={18} stroke={stroke} strokeWidth={strokeWidth + 0.5} strokeLinecap="round" />
          <Line x1={6} y1={18} x2={18} y2={6} stroke={stroke} strokeWidth={strokeWidth + 0.5} strokeLinecap="round" />
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M9 6l6 6-6 6" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'chevron-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M15 6l-6 6 6 6" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'arrow-back':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M19 12H5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Path d="M12 5l-7 7 7 7" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'arrow-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M5 12h14" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Path d="M12 5l7 7-7 7" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'trophy':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 11-10 0V4z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );
    case 'flash':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={color} />
        </Svg>
      );
    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={9} stroke={stroke} strokeWidth={strokeWidth} />
          <Path d="M12 7v5l3 2" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );
    case 'target':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={9} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx={12} cy={12} r={5} stroke={stroke} strokeWidth={strokeWidth} />
          <Circle cx={12} cy={12} r={1.5} fill={color} />
        </Svg>
      );
    case 'sparkles':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4L12 3z" fill={color} />
          <Path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z" fill={color} />
        </Svg>
      );
    case 'trash':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'backspace':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 12l5-7h13v14H8l-5-7z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <Path d="M12 9l4 6M16 9l-4 6" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );
    default:
      return <Rect width={size} height={size} fill="transparent" />;
  }
};
