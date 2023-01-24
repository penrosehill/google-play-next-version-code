import * as google from '@googleapis/androidpublisher';
import * as core from '@actions/core';
import { androidpublisher_v3 } from "@googleapis/androidpublisher";
import { Compute } from "google-auth-library/build/src/auth/computeclient";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth"
import AndroidPublisher = androidpublisher_v3.Androidpublisher;

const androidPublisher:AndroidPublisher  = google.androidpublisher('v3');

const getEditId = async (appId:string, client: Compute | JSONClient) => {
    const editIdResponse = await androidPublisher.edits.insert({
        auth: client,
        packageName: appId
    });
    if(editIdResponse.status!=200 || editIdResponse.data.id == null){
        core.debug(editIdResponse.statusText)
        throw new Error('Error getting an editId');
    }
    return editIdResponse.data.id;
}


export const NextVersionCode = async (appId, serviceAccountJsonFile)=>{

    core.exportVariable("GOOGLE_APPLICATION_CREDENTIALS", serviceAccountJsonFile);

    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/androidpublisher']
    });

    const authClient = await auth.getClient();

    const editId = await getEditId(appId, authClient);

    const tracksResponse = await androidPublisher.edits.tracks.list({
            auth: authClient,
            packageName: appId,
            editId: editId
        });
    
    if(tracksResponse.status != 200){
        core.debug("Error getting tracks")
        throw new Error('Error getting tracks');
    }

    let result = -1;

    for(let trackIndex in tracksResponse.data.tracks ){
        let track = tracksResponse.data.tracks[trackIndex]
        if(track && track.releases){
            for(let releaseIndex in track.releases){
                let release = track.releases[releaseIndex];
                let releaseVersionCodes = release.versionCodes;
                for(let versionCodeIndex in releaseVersionCodes){
                    let versionCode = parseInt(releaseVersionCodes[versionCodeIndex]);
                    if(versionCode > result){result = versionCode}
                }
            }
                
        }
    }
    return result + 1;    
}
