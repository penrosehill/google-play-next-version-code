import {LastVersionCode} from './googleApiHelper.js';
import * as core from '@actions/core';

const serviceAccountJsonFile = core.getInput("serviceAccountJsonFile", { required: true });
const packageName = core.getInput("packageName", { required: true });

LastVersionCode(packageName, serviceAccountJsonFile).then((versionCode) => {
    core.setOutput("versionCode", versionCode);
}).catch((error) => {
    if (error instanceof Error) {
        core.setFailed(error.message);
    } else {
        core.setFailed("Unknown error");
    }
});
