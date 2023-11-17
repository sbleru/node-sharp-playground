import sharp from "sharp";
import pixelmatch from "pixelmatch";

export async function compareImages(
  originalImagePath: string,
  compressedImagePath: string
) {
  // Read the images with sharp
  const originalImage = sharp(originalImagePath);
  const compressedImage = sharp(compressedImagePath);

  // Get the image metadata to ensure they are the same size
  const originalMetadata = await originalImage.metadata();
  const compressedMetadata = await compressedImage.metadata();

  // Resize the images to be the same size if necessary
  if (
    originalMetadata.width !== compressedMetadata.width ||
    originalMetadata.height !== compressedMetadata.height
  ) {
    const width = Math.min(originalMetadata.width!, compressedMetadata.width!);
    const height = Math.min(
      originalMetadata.height!,
      compressedMetadata.height!
    );
    originalImage.resize(width, height);
    compressedImage.resize(width, height);
  }

  // Convert the images to raw pixel data
  // .ensureAlpha() がないと「Error: Image data size does not match width/height.」エラー
  // @see https://github.com/mapbox/pixelmatch/issues/97#issuecomment-939031910
  // @see https://github.com/mapbox/pixelmatch/blob/b9261a447515f5aff37a15cfab9f4a491868f720/index.js#L23
  const originalRaw = await originalImage.ensureAlpha().raw().toBuffer();
  const compressedRaw = await compressedImage.ensureAlpha().raw().toBuffer();

  // Compare the images with pixelmatch
  // YIQ difference metric による比較
  const diff = pixelmatch(
    originalRaw,
    compressedRaw,
    null,
    originalMetadata.width!,
    originalMetadata.height!,
    { threshold: 0.1 }
  );

  // If diff is 0, the images are identical
  if (diff === 0) {
    console.log("The images are identical!");
  } else {
    console.log(
      `The images are different. There were ${diff} pixel differences.`
    );
  }
}
