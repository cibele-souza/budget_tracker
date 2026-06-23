interface TokenResponse {
   access_token: string;
   error?: string;
}

interface TokenClient {
   requestAccessToken: () => void;
}

interface Oauth2 {
   initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: TokenResponse) => void;
   }) => TokenClient;
   revoke: (token: string, callback: () => void) => void;
}

interface Google {
   accounts: {
      oauth2: Oauth2;
   };
}

declare const google: Google;
