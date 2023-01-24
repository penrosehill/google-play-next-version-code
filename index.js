import {LastVersionCode} from './googleApiHelper.js';
import * as core from '@actions/core';

const serviceAccountJsonRaw = core.getInput("serviceAccountJsonFile", { required: true });
const packageName = core.getInput("packageName", { required: true });

core.exportVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountJsonRaw);
try{
    const versionCode = LastVersionCode(packageName);
    core.setOutput("versionCode", versionCode);
} catch (error){
    core.setFailed(error.message);
}
