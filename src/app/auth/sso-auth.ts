import { Injectable } from "@angular/core";
import SSOUtil from "./sso-util";
import axios from "axios";

@Injectable()
export class SSOAuth {
  // https://tools.ietf.org/html/draft-ietf-oauth-browser-based-apps-01

  serviceauthId = "authn-cimpl";
  serviceauthSecret = "serviceauth-public-agent";
  //   serviceauthRedirectUri = "https://whisper.apps.sdc.uto.asu.edu/";
  serviceauthRedirectUri = "https://master.d2d4xy1u986kqj.amplifyapp.com/";

  serviceauthOauthUrl =
    "https://weblogin.asu.edu/serviceauth/oauth2/native/allow";
  serviceauthTokenUrl =
    "https://weblogin.asu.edu/serviceauth/oauth2/native/token";
  scopes = [
    "https://api.myasuplat-dpl.asu.edu/scopes/principal/read:self",
    "https://api.myasuplat-dpl.asu.edu/scopes/person/read:self",
    "https://api.myasuplat-dpl.asu.edu/scopes/student-group-membership/read:self",
    "https://my.asu.edu/jwtauthorizer/asusync-class-override-admin",
  ];

  // TODO:
  //var LOGOUT_URL = "https://weblogin.asu.edu/cas/logout";
  LOGOUT_URL = this.serviceauthRedirectUri;

  SS_SA_CODE_VERIFIER = "cimpl.serviceauth.codeVerifier";
  SS_SA_STATE = "cimpl.serviceauth.state";
  SS_JWT_TOKEN = "cimpl.jwt.token";

  /*
        TODO:
    A browser-based application that wishes to use either long-lived
    refresh tokens or privileged scopes SHOULD restrict its JavaScript
    execution to a set of statically hosted scripts via a Content
    Security Policy ([CSP2]) or similar mechanism.  A strong Content
    Security Policy can limit the potential attack vectors for malicious
    JavaScript to be executed on the page.
    */

  constructor() {}

  generateCodeVerifier() {
    var alphabet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.";
    var length = 128;
    return SSOUtil.generateRandomString(alphabet, length);
  }

  generateRandomServiceauthState() {
    var alphabet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.";
    var length = 64;
    return SSOUtil.generateRandomString(alphabet, length);
  }

  redirectToServiceauth() {
    var codeVerifier = this.generateCodeVerifier();
    var codeChallenge = SSOUtil.sha256base64url(codeVerifier);
    var state = this.generateRandomServiceauthState();

    var scopeParam = "";
    for (var i = 0; i < this.scopes.length; i++) {
      if (scopeParam.length > 0) {
        scopeParam += " ";
      }
      scopeParam += this.scopes[i];
    }

    sessionStorage.setItem(this.SS_SA_CODE_VERIFIER, codeVerifier);
    sessionStorage.setItem(this.SS_SA_STATE, state);

    var url = this.serviceauthOauthUrl;
    url += "?response_type=code";
    url += "&client_id=" + encodeURIComponent(this.serviceauthId);
    url += "&redirect_uri=" + encodeURIComponent(this.serviceauthRedirectUri);
    url += "&state=" + encodeURIComponent(state);
    url += "&code_challenge_method=S256";
    url += "&code_challenge=" + codeChallenge;
    url += "&scope=" + encodeURIComponent(scopeParam);
    console.log("redirecting to oauth server at url=[" + url + "]");
    location.replace(url);
  }

  handleOauthCode(code, state, success, err) {
    var storedState = sessionStorage.getItem(this.SS_SA_STATE);
    var codeVerifier = sessionStorage.getItem(this.SS_SA_CODE_VERIFIER);
    sessionStorage.removeItem(this.SS_SA_STATE);
    sessionStorage.removeItem(this.SS_SA_CODE_VERIFIER);

    //console.log("recevied state=["+state+"]");
    //console.log("stored state  =["+storedState+"]");
    if (!state || state.length < 1 || storedState != state) {
      err(
        "received unexpected state [" +
          state +
          "] - expected [" +
          storedState +
          "]"
      );
      return;
    }

    //console.log("codeVerifier  =["+codeVerifier+"]");
    var requestData = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: this.serviceauthRedirectUri,
      client_id: this.serviceauthId,
      client_secret: this.serviceauthSecret,
      code_verifier: codeVerifier,
    };

    //console.log('token request data: ['+JSON.stringify(requestData)+"]");
    axios
      .post(this.serviceauthTokenUrl, requestData)
      .then((res: any) => {
        console.log("token endpoint success! data=[" + JSON.stringify(res));
        sessionStorage.setItem(this.SS_JWT_TOKEN, res.access_token);
        // TODO: save token expiration time and refresh token
        // TODO: verify we got scopes we need
        success();
      })
      .catch((error) => {
        err(
          "error: xhr: [" +
            JSON.stringify(error) +
            "] status=[" +
            status +
            "], error=[" +
            error +
            "]"
        );
      });
  }

  reauth() {
    console.log("reauthing...");
    // TODO: detect fail loop? throttle?
    sessionStorage.removeItem(this.SS_JWT_TOKEN);
    this.redirectToServiceauth();
  }

  deauth() {
    sessionStorage.removeItem(this.SS_JWT_TOKEN);
    location.assign(this.LOGOUT_URL);
  }

  getAccessToken() {
    return sessionStorage.getItem(this.SS_JWT_TOKEN);
  }

  ajaxBeforeSendFunc(xhr) {
    xhr.setRequestHeader("Authorization", "Bearer " + this.getAccessToken());
  }

  handleAuth(authComplete) {
    if (SSOUtil.getParam("code")) {
      var code = SSOUtil.getParam("code");
      var state = SSOUtil.getParam("state");

      window.history.replaceState(
        {},
        document.title,
        this.serviceauthRedirectUri
      );

      this.handleOauthCode(
        code,
        state,
        function () {
          authComplete();
        },
        function (errTxt) {
          // TODO: UI
          console.log("ERROR: " + errTxt);
          this.reauth();
        }
      );
    } else if (sessionStorage.getItem(this.SS_JWT_TOKEN)) {
      authComplete();
    } else {
      this.redirectToServiceauth();
    }
  }
}
