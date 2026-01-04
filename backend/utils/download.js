const axios = require("axios");

const downloadFile = async (url) => {
    const res = await axios.get(url, {
        responseType: "arraybuffer"
    });

    if (res.status !== 200) {
        throw new Error(`Download failed: ${res.status}`);
    }

    return Buffer.from(res.data);
};

module.exports = downloadFile;
