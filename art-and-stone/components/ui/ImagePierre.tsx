import Image, { type ImageProps } from "next/image";

/**
 * Image distante (artandstone.fr) avec un fond couleur pierre pendant le
 * chargement. En mode `fill`, le parent doit être positionné (relative).
 */
export function ImagePierre({ className = "", alt, ...props }: ImageProps) {
  return <Image alt={alt} className={`bg-greige/40 object-cover ${className}`} {...props} />;
}
