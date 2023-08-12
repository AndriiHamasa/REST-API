import Jimp from "jimp/es";

const resizeAvatars = async (pathImage) => {
    const image = await Jimp.read(pathImage)
    const resizedImage = await image.resize(250, 250)
//   Jimp.read(pathImage)
//     .then((image) => {
//       // Do stuff with the image.
//     })
//     .catch((err) => {
//       // Handle an exception.
//     });
    return resizedImage
};

export default resizeAvatars
