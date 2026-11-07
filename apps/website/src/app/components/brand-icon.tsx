import Image from "next/image";

export default function BrandIcon({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/Transfert.png"
      alt=""
      width={size}
      height={size}
      className={`rounded-[22%] ${className}`}
      aria-hidden="true"
    />
  );
}
