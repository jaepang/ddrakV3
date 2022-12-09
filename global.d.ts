declare global {
  interface Window {
    IMP: any
  }
}

export const IMP = window.IMP

declare module '*.svg'
