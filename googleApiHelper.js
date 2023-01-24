import * as google from '@googleapis/androidpublisher';
const androidPublisher = google.androidpublisher('v3');

let _editId = null;

const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/androidpublisher']
});
const authClient = await auth.getClient();

const getEditId = async (appId)=>{
    if(_editId == null){
        const editIdResponse = await androidPublisher.edits.insert({
            auth: authClient,
            packageName: appId
        });
        if(editIdResponse.status!=200 || editIdResponse.data.id == null){
            throw new Error('Error getting an editId');
        }
        _editId = editIdResponse.data.id;
    }
    return _editId;
}

export const LastVersionCode = async (appId)=>{
    const editId = await getEditId(appId);
    const tracksResponse = await androidPublisher.edits.tracks.list({
            auth: authClient,
            packageName: appId,
            editId: editId
        });
    if(tracksResponse.status != 200){
        throw new Error('Error getting tracks');
    }
    let result = -1;
    for(let trackIndex in tracksResponse.data.tracks ){
        let track = tracks.data.tracks[trackIndex]
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
    return result;    
}
