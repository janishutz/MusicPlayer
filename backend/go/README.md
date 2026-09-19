# GO backend
MusicPlayer V4 migrates its backend to Go to improve performance and memory usage.
While Go isn't anywhere near the memory efficiency of Rust, it gets much closer than Node.js, with the benefit of a more extensive list of libraries that can be used.
Furthermore, I don't want to maintain a login SDK for three or more languages.


## Configuration
See the `config.yml` file for the default configuration.
Next to that, the following environment variables are respected by the backend:

### Authentication (via OIDC)
If any of these are unset, then no authentication will be used. If that is the case, you will see a warning in the startup logs
- `OIDC_ISSUER`: The issuer as specified by your OIDC provider (such as [Keycloak](https://keycloak.org) or [VoidAuth](https://voidauth.app))
- `OIDC_CLIENT_ID`: The Client ID, as specified by your OIDC provider
- `OIDC_CLIENT_SECRET`: The Client Secret

### Store
If any of these are unset, ownership / subscription status won't be checked for the user. If that is the case, you will see a warning in the logs
If they are set and a request fails with a 401 code, the check is disabled after a few failed attempts (TODO: Implement)
- `STORE_SERVICE_ID`: The ServiceID for the store
- `STORE_SERVICE_SECRET`: The service secret for authentication
