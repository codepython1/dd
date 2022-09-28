const app_id = 'c7eb1e799be2439ea47470c31a6b34de'
const channel = 'main'
const token = '007eJxTYGBjZjg6ecG9M/WXpx6q+vdoUqHlggyl0zc17FP/xCtlzSxXYEg2T00yTDW3tExKNTIxtkxNNDE3MTdINjZMNEsyNklJ3SplnGyaY5K8UkuXlZEBAkF8FobcxMw8BgYAkeIgOA=='
let UID;

const client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let loacal_tracks = []
let remote_users = {}

let joinandisplaylocalstream = async () => {
    client.on('user-published',handel_user_joine)

    UID = await client.join(app_id,channel,token,null)
 
    loacal_tracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}" >
                    <div class="username-wrapper" ><span class="user-name" >My Name</span></div>
                    <div class="video-player" id="user-${UID}" ></div>
                </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    loacal_tracks[1].play(`user-${UID}`)

    await client.publish([loacal_tracks[0],loacal_tracks[1]])

}

let handel_user_joine = async(user,mediaType) => {
    remote_users[user.uid] = user
    await client.subscribe(user,mediaType)

    if(mediaType == 'video'){
        let player = document.getElementById(`user-countainer-${user.uid}`)
        if(player !=null){
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}" >
                    <div class="username-wrapper" ><span class="user-name" >My Name</span></div>
                    <div class="video-player" id="user-${user.uid}" ></div>
                </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)
        user.videoTrack.play(`user-${user.uid}`)
    }

    if(mediaType=='audio'){
        user.audioTrack.play()
    }

}

joinandisplaylocalstream()
// 