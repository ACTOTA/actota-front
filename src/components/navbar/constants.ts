export const MOBILE_GLASS_PANEL_STYLES = 'bg-transparent border-0';

export const getMobileGlassPanelProps = (isMobile: boolean) => ({
  variant: 'light' as const,
  blur: 'xl' as const,
  padding: 'md' as const,
  rounded: '3xl' as const,
});