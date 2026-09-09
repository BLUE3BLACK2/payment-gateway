import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={inverse ? "brand-logo is-inverse" : "brand-logo"} href="/" aria-label="Kaia home">
      <Image src="/images/kaia-logo.webp" alt="Kaia" width={560} height={210} priority />
    </Link>
  );
}
