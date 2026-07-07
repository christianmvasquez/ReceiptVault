import Image from "next/image";

type BrandLogoProps = {
  className?: string;
};

export default function BrandLogo({ className = "h-12 w-auto" }: BrandLogoProps) {
  return (
    <Image
      src="/receiptr-logo.svg"
      alt="Receiptr"
      width={760}
      height={210}
      priority
      className={className}
    />
  );
}
