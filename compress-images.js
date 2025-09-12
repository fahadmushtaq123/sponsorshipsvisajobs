const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesPath = './public';
const outputPath = './public/compressed';

const compressImage = async (imagePath, output_path) => {
  try {
    const compressedPath = path.join(output_path, path.basename(imagePath));
    await sharp(imagePath)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFile(compressedPath);
    console.log(`Compressed ${imagePath} to ${compressedPath}`);
  } catch (error) {
    console.log(`Could not compress ${imagePath}. Error: ${error.message}`);
  }
};

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
};

const main = async () => {
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const allFiles = getAllFiles(imagesPath);
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

    for (const file of allFiles) {
        if (imageExtensions.includes(path.extname(file).toLowerCase())) {
            const relativePath = path.relative(imagesPath, path.dirname(file));
            const outputDir = path.join(outputPath, relativePath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            await compressImage(file, outputDir);
        }
    }
}

main();
