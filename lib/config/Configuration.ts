interface BaseConfiguration {

    /**
     * The pages to edit as an object. The key defines the target page on
     * the wiki, and the value defines the path of the file to use.
     */
    page: Record<string, string>;
    /**
     * A list of tags to add when editing.
     */
    tags?: string[];

}

interface BotPasswordAuthorization {

    /**
     * The authentication method to use.
     */
    method: "bot";
    /**
     * The credentials to use.
     */
    credentials: {
        /**
         * The username of the user. This should end with an @ symbol
         * followed by the name of the BotPassword consumer.
         */
        username: string,
        /**
         * The bot password of the user.
         */
        password: string
    }

}

interface OAuthAuthorization {

    /**
     * The callback URL to use. Only supply this if you are using this library in conjunction
     * with a web server.
     *
     * If not supplied, you must set your callback URL as defined in the README file.
     */
    callbackUrl?: string;
    /**
     * The credentials to use.
     */
    credentials: {
        /**
         * The application token is given when registering an OAuth consumer.
         */
        applicationToken: string,
        /**
         * The application secret is given when registering an OAuth consumer.
         */
        applicationSecret: string,
        /**
         * The access token is provided only if the OAuth consumer was registered
         * as an [owner-only consumer]{@link https://www.mediawiki.org/wiki/OAuth/Owner-only_consumers}.
         * Otherwise, the access token and secret will be requested when the script is run.
         */
        accessToken: string
    }

}

interface OAuth1Authorization extends OAuthAuthorization {

    /**
     * The authentication method to use.
     */
    method: "oauth1";

}

interface OAuth2Authorization extends OAuthAuthorization {

    /**
     * The authentication method to use.
     */
    method: "oauth2";
    credentials: OAuthAuthorization["credentials"] & {
        /**
         * The access secret is provided only if the OAuth consumer was registered
         * as an [owner-only consumer]{@link https://www.mediawiki.org/wiki/OAuth/Owner-only_consumers}.
         * Otherwise, the access token and secret will be requested when the script is run.
         *
         * This is only applicable for OAuth v2.0 consumers.
         */
        accessSecret?: string
    }

}

export type Authorization = BotPasswordAuthorization | OAuth1Authorization | OAuth2Authorization;
export type Configuration = BaseConfiguration & Authorization;
