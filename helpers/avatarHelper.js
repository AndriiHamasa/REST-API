import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";

const avatarHelper = async (oldPath, filename) => {
    const image = await Jimp.read(oldPath)
    await image.resize(250, 250)

    const imageBuffer = await image.getBufferAsync(Jimp.AUTO);
    const targetFilePath = path.join("public", "avatars", filename);
    await fs.writeFile(targetFilePath, imageBuffer);
    await fs.unlink(oldPath)
    
    return path.join("avatars", filename)
};

export default avatarHelper;
