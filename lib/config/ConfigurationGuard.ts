import { Authorization, Configuration } from "./Configuration";
import maybeThrow from "../util/maybeThrow";

export function isAuthorization(obj: any, willThrow?: boolean): obj is Authorization {
    if (typeof obj !== "object")
        maybeThrow(willThrow, "Not an object.");
    if (typeof obj.credentials !== "object")
        maybeThrow(willThrow, "No credentials were provided.");

    if (obj.method === "oauth1" || obj.method === "oauth2") {
        if (typeof obj.credentials.applicationToken !== "string")
            maybeThrow(willThrow, `'applicationToken' is not a string.`);
        if (typeof obj.credentials.applicationSecret !== "string")
            maybeThrow(willThrow, "'applicationToken' is not a string.");
        if (typeof obj.credentials.accessToken !== "string")
            maybeThrow(willThrow, "'applicationToken' is not a string.");
        if (
            obj.method === "oauth2" &&
            typeof obj.credentials.accessSecret !== "string"
        )
            maybeThrow(willThrow, "'accessSecret' is not a string.");
    } else if (obj.method === "bot") {
        if (typeof obj.credentials.username !== "string")
            maybeThrow(willThrow, "'username' is not a string.");
        if (typeof obj.credentials.password !== "string")
            maybeThrow(willThrow, "'password' is not a string.");
    }
    return true;
}

export function isConfiguration(obj: any, willThrow?: boolean): obj is Configuration {
    if (typeof obj !== "object")
        maybeThrow(willThrow, "Not an object.");

    if (typeof obj.page !== "object")
        maybeThrow(willThrow, "'page' must be an object.");
    else {
        for (const [key, value] of Object.entries(obj.page))
            if (typeof value !== "string")
                maybeThrow(willThrow, `Value of page '${key}' is not a string.`);
    }
    if (typeof obj.tags !== "undefined" && !Array.isArray(obj.tags)) {
        maybeThrow(willThrow, "'tags' must be undefined or an array")
    } else if (Array.isArray(obj.tags)) {
        for (const tag of obj.tags)
            if (typeof tag !== "string")
                maybeThrow(willThrow, `Tag '${tag}' is not a string.`)
    }

    if (obj.method !== "bot" && obj.method !== "oauth1" && obj.method !== "oauth2")
        maybeThrow(willThrow, "Authorization type must be either 'bot', 'oauth1', or 'oauth2'.");
    if (!isAuthorization(obj, willThrow)) {
        maybeThrow(willThrow, "Authorization details are invalid.");
    }
    return true;
}

