/** Wursor mark: an arch with a dot at its centre. The arch follows the theme; the dot is accent. */
export function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand-mark brand-mark-light" src="/marketing/brand-mark-light.svg" alt="" width={size} height={size} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand-mark brand-mark-dark" src="/marketing/brand-mark-dark.svg" alt="" width={size} height={size} />
    </>
  );
}
