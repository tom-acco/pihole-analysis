import axios from "axios";

export const downloadFile = async (url: string): Promise<Buffer> => {
    const res = await axios.get<ArrayBuffer>(url, {
        responseType: "arraybuffer"
    });

    if (res.status !== 200) {
        throw new Error(`Download failed: ${res.status}`);
    }

    return Buffer.from(res.data);
};
