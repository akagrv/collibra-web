import * as sjcl from "sjcl";

export default class SSOUtil {
  DPL_BASE_URL = "https://api.myasuplat-dpl.asu.edu/api";

  static getParam(nameIn) {
    var qs = location.search.substring(1, location.search.length);
    if (qs.length != 0) {
      qs = qs.replace(/\+/g, " ");
      var qsargs = qs.split("&");
      for (var i = 0; i < qsargs.length; i++) {
        var j = qsargs[i].indexOf("=");
        if (j == -1) {
          var name = qsargs[i];
          var value = "";
        } else {
          var name = qsargs[i].substring(0, j);
          var value = unescape(qsargs[i].substring(j + 1));
        }
        if (nameIn == name) {
          return value;
        }
      }
    }
    return null;
  }

  static readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0)
        return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
  }

  static sha256hex(message) {
    return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(message));
  }

  // without padding
  static sha256base64url(message) {
    return sjcl.codec.base64url.fromBits(sjcl.hash.sha256.hash(message));
  }

  static generateRandomString(alphabet, length) {
    var randArr = new Uint8Array(length);
    var ret = "";
    window.crypto.getRandomValues(randArr);
    for (var i = 0; i < randArr.length; i++) {
      var j = randArr[i] % 64;
      ret += alphabet.substring(j, j + 1);
    }
    return ret;
  }
}
