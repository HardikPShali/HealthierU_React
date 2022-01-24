import React from 'react';
import { SECRET_KEY } from './../../util/configurations';

var CryptoJS = require("crypto-js");

export const encryptedRSA = (data) => {
	var ciphertext = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
	return ciphertext;
}

export const decryptedRSA = (encryptedData) => {
	var bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
	var originalText = bytes.toString(CryptoJS.enc.Utf8);
	return originalText;
}