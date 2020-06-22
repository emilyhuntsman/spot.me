// global var: slide num
let slideNum = 0;

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

const getInfo = (userAccessToken,artist) => {
    artist = artist.replace(/ /g,"%20");
    // get artist object from user input
    const promise = $.ajax({
        url: `https://api.spotify.com/v1/search?q='${artist}'&type=artist`,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
        }
    })
    return (promise);
}

const getGenreSeeds = (genreCount) => {
    let genreSeeds = [];
    const genres = [
        "acoustic","afrobeat","alt-rock","alternative","ambient","anime","black-metal","bluegrass","blues","bossanova","brazil","breakbeat","british","cantopop","chicago-house","children","chill","classical","club","comedy","country","dance","dancehall","death-metal","deep-house","detroit-techno","disco","disney","drum-and-bass","dub","dubstep","edm","electro","electronic","emo","folk","forro","french","funk","garage","german","gospel","goth","grindcore","groove","grunge","guitar","happy","hard-rock","hardcore","hardstyle","heavy-metal","hip-hop","holidays","honky-tonk","house","idm","indian","indie","indie-pop","industrial","iranian","j-dance","j-idol","j-pop","j-rock","jazz","k-pop","kids","latin","latino","malay","mandopop","metal","metal-misc","metalcore","minimal-techno","movies","mpb","new-age","new-release","opera","pagode","party","philippines-opm","piano","pop","pop-film","post-dubstep","power-pop","progressive-house","psych-rock","punk","punk-rock","r-n-b","rainy-day","reggae","reggaeton","road-trip","rock","rock-n-roll","rockabilly","romance","sad","salsa","samba","sertanejo","show-tunes","singer-songwriter","ska","sleep","songwriter","soul","soundtracks","spanish","study","summer","swedish","synth-pop","tango","techno","trance","trip-hop","turkish","work-out","world-music"];
        for (key in genreCount){
            if ((genres.includes(key))&&(genreCount[key]>=2)){
                genreSeeds.push(key);
            }
        }
    return (genreSeeds);
}

// the following two functions reference slideshow by w3schools with edits

const displaySlide = (slideI) => {
    const $slides = $('.slide');
    for (let i = 0; i < $slides.length; i++){
        $slides[i].style.display = "none";
    }
    $slides[slideI].style.display = "block";
}

const nextImage = (shift) => {
    const index = slideNum + shift;
    if ((index >= 0) && (index < 10)) {
        displaySlide(slideNum += shift);
    }
}

const getRecs = (userAccessToken,idList,seedG,filter,popular,fromArtists) => {
    let seedUrl = ""; let popUrl = "";
    (seedG.length == 0) ? "" : (seedG.length == 1) ? seedUrl = `&seed_genres=${seedG[0]}` : seedUrl = `&seed_genres=${seedG[0]},${seedG[1]}`;;
    if (!popular) { popUrl = "&max_popularity=40" }
    $.ajax({
        url: `https://api.spotify.com/v1/recommendations?limit=20${popUrl}&seed_artists=${idList[0]},${idList[1]},${idList[2]}${seedUrl}`,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Bearer ${userAccessToken}`)
        }, success: (data) => {
            const playlist = { artists: fromArtists, songs: [] };
            let trackCount = 0;
            $('#recs').empty();
            $('#recs').append($('<h2>').text("Your Playlist"));
            const $ol= $('<ol>');
            $('#rec-list').empty().append($ol);
            if (filter) {
                for (let track of data.tracks){
                    if ((trackCount<10)&&(!idList.includes(track.artists[0].id))){
                        $ol.append($('<li>').text(`${track.name} by ${track.artists[0].name}`));
                        playlist.songs.push(`${track.name} by ${track.artists[0].name}`);
                        trackCount++;
                        const $slide = $('<div>').attr("class","slide").append($('<img>').attr("src",track.album.images[0].url));
                        $('#carousel-container').append($slide);
                    }
                }
            }
            else{
                for (let track of data.tracks){
                    if (trackCount<10){
                        $ol.append($('<li>').text(`${track.name} by ${track.artists[0].name}`));
                        trackCount++;
                        playlist.songs.push(`${track.name} by ${track.artists[0].name}`);
                        const $slide = $('<div>').append($('<img>').attr("src",track.album.images[0].url));
                        $('#carousel-container').append($slide);
                    }
                }
            }
            const $prev = $('<a>').attr("class","prev").attr("onclick","nextImage(-1)").text("<");
            const $next = $('<a>').attr("class","next").attr("onclick","nextImage(1)").text(">");
            $('#carousel-container').append($prev).append($next);
            displaySlide(slideNum);

            if ((localStorage.length) != 0){
                const stored = JSON.parse(localStorage.getItem("playlists"));
                if ((stored.length) == 1) {
                    const stored = JSON.parse(localStorage.getItem("playlists"));
                    stored.second = stored.first;
                    stored.first = playlist;
                    localStorage.setItem("playlists",JSON.stringify(stored));
                }
                else {
                    stored.third = stored.second;
                    stored.second = stored.first;
                    stored.first = playlist;
                    localStorage.setItem("playlists",JSON.stringify(stored));
                }
            }
            else {
                const stored = { first: playlist };
                localStorage.setItem("playlists",JSON.stringify(stored));
            }
            $('#myLists').empty();
            const stored = JSON.parse(localStorage.getItem("playlists"));
            if ((localStorage.length) != 0){
                Object.keys(stored).forEach((key) => {
                    if (key != "first"){
                        const $div = $('<div>').attr("class","play");
                        $('#myLists').append($div);
                        $div.append($('<h3>').text(`${stored[key].artists[0]}`));
                        $div.append($('<h3>').text(`${stored[key].artists[1]}`));
                        $div.append($('<h3>').text(`${stored[key].artists[2]}`));
                        const $ul = $('<ul>');
                        $div.append($ul);
                        for (let song of stored[key].songs){
                            $ul.append($('<li>').text(song));
                        }
                    }
                });
            }
        }
    })
}

const populatePage = (userAccessToken,filter,popular) => {
    const htmlE = [ [$('#a1List'),$('#a1')], [$('#a2List'),$('#a2')], [$('#a3List'),$('#a3')] ];
    $('img').remove();
    $('ul').empty();
    $('#a1Header').text($('#first').val());
    $('#a2Header').text($('#second').val());
    $('#a3Header').text($('#third').val());
    // first artist call
    const promise1 = getInfo(userAccessToken,($('#first').val()));
    // second artist call
    const promise2 = getInfo(userAccessToken,($('#second').val()));
    // third artist call
    const promise3 = getInfo(userAccessToken,($('#third').val()));
    Promise.all([promise1,promise2,promise3]).then((values) => {
        const idList = [];
        const fromArtists = [];
        const genreCount = {};
        for (let i = 0; i < values.length; i++){
            for (let genre of values[i].artists.items[0].genres) {
                (genre.replace(/ /g,"-") in genreCount) ? genreCount[genre.replace(/ /g,"-")]++ : genreCount[genre.replace(/ /g,"-")] = 1;
                const $li = $('<li>').text(genre);
                (htmlE[i][0]).append($li);
            }
            const $img = $('<img>').attr("src",values[i].artists.items[0].images[0].url).attr("id","picture");
            htmlE[i][1].prepend($img);
            idList.push(values[i].artists.items[0].id);
            fromArtists.push(values[i].artists.items[0].name);
        }
        let seedG = getGenreSeeds(genreCount);
        getRecs(userAccessToken,idList,seedG,filter,popular,fromArtists);
    });
    // clearing input fields
    $('.tbox').val("");
    $('h3').text("classified as: ");
}

const display = () => {
    if (($('#first').val()=="")||($('#second').val()=="")||($('#third').val()=="")) {
        alert("please enter three valid artists"); return;
    }
    const client_64 = "MjQ4M2E5OWU4Y2U2NGQ4ZmE2NjgxM2ZhZTY3ZjM2MTA6OGIwZDVjYjFmOTM4NDEyNThiNGJjMDBlMTAwZWVjOGY=";
    let filter; let popular;
    ($('input[name="filt"]:checked').val() == "yes") ? filter = true : filter = false;
    $('input[name="filt"]:checked').prop("checked", false);
    ($('input[name="pop"]:checked').val() == "yes") ? popular = false : popular = true;
    $('input[name="pop"]:checked').prop("checked", false);
    getUserAccessToken(client_64).then((response) => {   
        const userAccessToken = response.access_token; 
        populatePage(userAccessToken,filter,popular);
    });
}

$(() => {
    $('#myLists').empty();
    const stored = JSON.parse(localStorage.getItem("playlists"));
    if ((localStorage.length) != 0){
        Object.keys(stored).forEach((key) => {
            const $div = $('<div>').attr("class","play");
            $('#myLists').append($div);
            $div.append($('<h3>').text(`${stored[key].artists[0]}`));
            $div.append($('<h3>').text(`${stored[key].artists[1]}`));
            $div.append($('<h3>').text(`${stored[key].artists[2]}`));
            const $ul = $('<ul>');
            $div.append($ul);
            for (let song of stored[key].songs){
                $ul.append($('<li>').text(song));
            }
        });
    }
})