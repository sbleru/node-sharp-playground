import sharp from "sharp";

export const compressImage = async (
  originalImagePath: string,
  compressedImagePath: string
): Promise<void> => {
  let sharpPageImage = sharp(originalImagePath);
  const metadata = await sharpPageImage.metadata();
  if (metadata.format === "png") {
    sharpPageImage = sharpPageImage.png();
  }
  if (metadata.format === "jpeg") {
    sharpPageImage = sharpPageImage.jpeg({
      // ここを修正して試す
      quality: 90,
    });
  }
  sharpPageImage = sharpPageImage.withMetadata({ density: metadata.density });
  await sharpPageImage.toFile(compressedImagePath);
};
