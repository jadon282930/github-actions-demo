import Cookies from 'js-cookie';

const CryptoJS = require('crypto-js');

export const getAccessToken = () => Cookies.get('x-access-token');
export const isAuthenticated = () => !!getAccessToken();

export const formatPhoneNumber = (str) => {
    let value = str;
    if(value){
        value = value
            .replace(/\D+/g, "")
            .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        return value;
    }
    return str;
};

export const numberValidate = (value) => {
    if (!value.length) {
        return true
    } else {
        if (value.length <= 9) {
            return "Minimum  10 digits are allowed"
        }
    }
}
export const dotGenerator = (text) => {
    let result = "";
    text = text?.replaceAll('\n\n', ' ');
    text = text?.replaceAll('\n', ' ');
    let splitText = text?.trim().split(' ');
    if (splitText.length > 5 ) {
        result = `${splitText.slice(0, 5).join(' ')}...`
    }
    else {
         result = `${splitText.slice(0, splitText.length).join(' ')}`
    }

    // if (result?.length > 165) {
    //     result = `${result.split(' ')?.reduce((acc = "", cur) => ((acc?.length + cur?.length) <= 165) ?  `${acc} ${cur}` : acc)}...`;
    // }
    return (result || "")
};

function buildFormData(formData, data, parentKey) {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
            buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        });
    } else {
        const value = data == null ? '' : data;

        formData.append(parentKey, value);
    }
}

export function jsonToFormData(data) {
    const formData = new FormData();
    buildFormData(formData, data);
    return formData;
}

export const Encryption = (data) => {
    try {
        return CryptoJS.AES.encrypt(data, 'DFKTxfMLwjL9WUyNGJYU5200715A').toString();
    } catch (e) {
    }
}

export function Decryption(data) {
    try {
        let bytes =  CryptoJS.AES.decrypt(data, 'DFKTxfMLwjL9WUyNGJYU5200715A');
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
    }
}
export const generateAvatar = (text) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Draw background
    context.fillStyle = stringToHslColor(text);
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "bold 65px montserrat_regular";
    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.textBaseline = "middle";

    let first = text?.split(' ')[0]?.charAt(0)?.toUpperCase();
    let last = text?.split(' ')[1]?.charAt(0)?.toUpperCase();

    if (!last) {
        last = text?.split(' ')[0]?.charAt(1)?.toUpperCase() || text?.split(' ')[0]?.charAt(0)?.toUpperCase();
    }
    if (!first) {
        first = "S";
        last = "U";
    }

    context.fillText(first + last, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
};


export const stringToHslColor = (str, s = 30, l = 80) => {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let h = hash % 360;
    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
};