// Telefon rasmlari odatda bir necha MB bo'ladi — yuklashdan oldin uni
// kichraytirib (maks. tomon 1280px) va JPEG sifatida siqib, yuklash
// vaqtini sezilarli qisqartiramiz.
export async function compressImage(
  file: File,
  maxDim = 1280,
  quality = 0.82
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context yaratib bo'lmadi");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Siqib bo'lmadi"))),
      "image/jpeg",
      quality
    );
  });
}
