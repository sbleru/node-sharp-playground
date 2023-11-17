import { compressImage } from "./compressImage";
import { compareImages } from "./compareImage";

async function main() {
  const fileName = "<your file name>";
  const srcPath = `./images/src/${fileName}.jpg`
  const outPath = `./images/out/${fileName}.jpg`
  await compressImage(srcPath, outPath);
  await compareImages(srcPath, outPath);
}

main()
  .then(() => {
    console.log("done");
    process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
