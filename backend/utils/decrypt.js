const crypto = require("crypto");

const decryptFile = (buffer, password) => {
    const PBKDF2_ITERATIONS = 10000;
    const KEY_LENGTH = 32;
    const IV_LENGTH = 16;

    const SALTED_MAGIC = Buffer.from("Salted__");

    if (!buffer.subarray(0, 8).equals(SALTED_MAGIC)) {
        throw new Error("Invalid OpenSSL salt header");
    }

    const salt = buffer.subarray(8, 16);
    const encrypted = buffer.subarray(16);

    const keyIv = crypto.pbkdf2Sync(
        password,
        salt,
        PBKDF2_ITERATIONS,
        KEY_LENGTH + IV_LENGTH,
        "sha256"
    );

    const key = keyIv.subarray(0, KEY_LENGTH);
    const iv = keyIv.subarray(KEY_LENGTH);

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    return Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]).toString("utf8");
};

module.exports = decryptFile;
