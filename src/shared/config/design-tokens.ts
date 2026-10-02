export const designTokens = {
  typography: {
    fontSans: "Geist",
    fontMono: "Geist Mono",
  },

  layout: {
    pageMaxWidth: "1600px",
    headerHeight: "56px",
    sidebarWidth: "256px",
    sidebarCollapsedWidth: "48px",
  },

  spacing: {
    pageMobile: "16px",
    pageDesktop: "24px",

    pageGap: "24px",
    sectionGap: "24px",
    contentGap: "16px",
    fieldGap: "16px",
    actionGap: "8px",
  },

  radius: {
    base: "10px",
    sm: "6px",
    md: "8px",
    lg: "10px",
    xl: "14px",
  },

  breakpoints: {
    mobile: "375px",
    tablet: "768px",
    desktop: "1366px",
  },
} as const;

export type DesignTokens = typeof designTokens;

/**
 * NET CORP design baseline.
 *
 * Không dùng các giá trị này để build class Tailwind động.
 * Đây là nguồn tham chiếu chung cho Design System.
 *
 * Khi thay đổi token nền tảng, cần kiểm tra lại:
 * - AppShell
 * - PageContainer
 * - Form
 * - DataTable
 * - Dialog
 * - Responsive 375 / 768 / 1366
 */
