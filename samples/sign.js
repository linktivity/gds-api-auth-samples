const cryptoJS = require("crypto-js")
const GetSignature = ({apiKey,host,path,salt1,salt2}) => {
    if (typeof window != 'undefined') {
        throw new Error("cannot be used by browser env")
    }

    t = new Date()

    const year = t.getUTCFullYear();
    const month = String(t.getUTCMonth() + 1).padStart(2, '0');
    const day = String(t.getUTCDate()).padStart(2, '0');
    const hours = String(t.getUTCHours()).padStart(2, '0');
    const minutes = String(t.getUTCMinutes()).padStart(2, '0');
    const seconds = String(t.getUTCSeconds()).padStart(2, '0');
    ts = `${year}${month}${day}T${hours}${minutes}${seconds}Z`

    function sign(key, msg) {
        const hmac = cryptoJS.algo.HMAC.create(cryptoJS.algo.SHA256, key);
        hmac.update(msg);
        return hmac.finalize();
    }

    k1 = sign(salt1 + apiKey, ts);
    k2 = sign(k1, host);
    k3 = sign(k2, path);
    k = sign(k3, salt2);

    return cryptoJS.enc.Base64.stringify(k).replace(/\+/g, '-').replace(/\//g, '_');
}

encodedKeys = GetSignature({
    apiKey:pm.environment.get("api-key"),
    host:pm.request.url.getHost(),
    path:pm.request.url.getPath(),
    salt1:"congaree",
    salt2:"veltra"
});
pm.request.headers.add({key:"Grpc-Metadata-api-key-id",value:pm.environment.get("Grpc-Metadata-api-key-id")})
pm.request.headers.add({key:"Grpc-Metadata-ota-id",value:pm.environment.get("Grpc-Metadata-ota-id")})
pm.request.headers.add({key:"Grpc-Metadata-group-id",value:pm.environment.get("Grpc-Metadata-group-id")})
pm.request.headers.add({key:"Grpc-Metadata-timestamp",value:ts})
pm.request.headers.add({key:"Grpc-Metadata-signature-key",value:encodedKeys})
