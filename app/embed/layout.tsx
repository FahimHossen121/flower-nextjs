import type { ReactNode } from 'react'

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        html, body {
          background: transparent !important;
        }

        body {
          margin: 0;
          overflow: hidden;
        }
      `}</style>
      {children}
    </>
  )
}
