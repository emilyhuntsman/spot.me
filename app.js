const getUserAccessToken = (client_64) => {
    const resp = $.ajax({
        url: "https://accounts.spotify.com/api/token",
        method: 'POST',
        data: "grant_type=client_credentials",
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Basic ${client_64}`);
        },
    })
    return (resp);
}

const populatePage = (userAccessToken,artistList) => {
    $('img').remove();
    $('ul').empty();
    $('#a1Header').text($('#first').val());
    $('#a2Header').text($('#second').val());
    $('#a3Header').text($('#third').val());
    // first artist call
    artistList.push(getInfo(userAccessToken,($('#first').val()),$('#a1List'),$('#a1')));
    // second artist call
    artistList.push(getInfo(userAccessToken,($('#second').val()),$('#a2List'),$('#a2')));
    // third artist call
    artistList.push(getInfo(userAccessToken,($('#third').val()),$('#a3List'),$('#a3')));
    // clearing input fields
    $('input').val("");
    $('h3').text("classified as: ");
}

const getInfo = (userAccessToken,artist,uList,section) => {
    let toReturn = { name: artist, idNum: null, idGenres: [] };
    artist = artist.replace(/ /g,"%20");
    // get artist id from user input
    const artistData = $.ajax({
        url: `https://api.spotify.com/v1/search?q='${artist}'&type=artist`,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
        }, success: (data) => {
            for (let genre of data.artists.items[0].genres) {
                toReturn.idGenres.push(genre);
                const $li = $('<li>').text(genre);
                (uList).append($li);
            }
            const $img = $('<img>').attr("src",data.artists.items[0].images[0].url).attr("id","picture");
            section.prepend($img);
            toReturn.idNum = data.artists.items[0].id;
        }
    })
    return (toReturn);
}

const getRecs = (userAccessToken,idList,seedG) => {
    $.ajax({
        url: `https://api.spotify.com/v1/recommendations?limit=10&max_popularity=60&seed_artists=${idList[0]},${idList[1]},${idList[2]}&seed_genres=${seedG[0]},${seedG[1]}`,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
        }, success: (data) => {
            $('#recs').empty();
            $('#recs').append($('<h1>').text("Your custom playlist..."));
            const $ul= $('<ul>');
            $('#recs').append($ul);
            for (let track of data.tracks){
                $ul.append($('<li>').text(`${track.name} by ${track.artists[0].name}`));
            }
        }
    })
}


const display = () => {
    const client_64 = "MjQ4M2E5OWU4Y2U2NGQ4ZmE2NjgxM2ZhZTY3ZjM2MTA6OGIwZDVjYjFmOTM4NDEyNThiNGJjMDBlMTAwZWVjOGY=";
    let artistList = [];
    let idList = [ "1r1uxoy19fzMxunt3ONAkG", "3RcaUsjj5gt1x2QK3TSNS2", "07D1Bjaof0NFlU32KXiqUP" ];
    let seedG = ["indie-pop","sad"];
    getUserAccessToken(client_64).then((response) => {   
        const userAccessToken = response.access_token; 
        populatePage(userAccessToken,artistList);
        getRecs(userAccessToken,idList,seedG);

        //console.log(artistList);
        // for (let a of artistList){
        //     console.log("name "+a.name);
        //     console.log("id "+a.idNum);
        //     console.log(a.idGenres);
        // }

    });
}