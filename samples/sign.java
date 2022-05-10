import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class Signature {
    
    private static String salt1 = "_";
    private static String salt2 = "_";
    
    private static byte[] sign(byte[] key, String msg) throws Exception {
    	String algo = "HMacSHA256";
        final SecretKeySpec keySpec = new SecretKeySpec(key, algo);
        final Mac mac = Mac.getInstance(algo);
        mac.init(keySpec);
        final byte[] signBytes = mac.doFinal(msg.getBytes());
    	return signBytes;
    }

    public static String getSignature(String apikey,String datetime,String endpoint,String path) throws Exception {
    	byte[] k1 = sign((salt1+apikey).getBytes(), datetime);
      byte[] k2 = sign(k1, endpoint);
    	byte[] k3 = sign(k2, path);
    	byte[] k = sign(k3, salt2);
    	return Base64.getUrlEncoder().encodeToString(k);
    }
}