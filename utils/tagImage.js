const apiKey = process.env.IMAGGA_KEY;
const apiSecret = process.env.IMAGGA_SECRET;
// Dynamic import for got
const getGot = import("got");
const fetch = require("node-fetch");

// Using got
// const tagImage = async (req, res) => {
//   const { got } = await getGot;
//   const image =
//     "https://ik.imagekit.io/vjugbonpd/image_xeG7P_Den?updatedAt=1683119703523";
//   const url =
//     "https://api.imagga.com/v2/tags?image_url=" + encodeURIComponent(image);
//   try {
//     const response = await got.get(url, {
//       username: apiKey,
//       password: apiSecret,
//     });
//     console.log("response:  ", response.body);
//     res.status(200).json(response.body);
//   } catch (error) {
//     console.log("error: ", errorresponse.body);
//   }
// };

const tagImage = async (image) => {
  let tags = [];
  const url =
    "https://api.imagga.com/v2/tags?image_url=" + encodeURIComponent(image);
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString(
          "base64"
        )}`,
      },
    });
    const data = await response.json();

    tags = [
      ...data.result.tags.reduce((acc, cur) => {
        const { confidence, tag } = cur;
        if (confidence > 15) {
          acc.push(tag.en);
        }
        return acc;
      }, []),
    ];
    return tags;
  } catch (error) {
    console.log("error: ", error);
  }
};

module.exports = tagImage
