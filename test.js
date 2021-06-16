function getFileList(dirpath, callback){
    //ディレクトリ内のファイルの配列を返す
    let dirArray = fs.readdirSync(dirpath);
    dirListPathArray.push(dirpath);
    console.log(dirArray);
    if(!dirArray){
        throw err("Can't read directory");
    }

    for (const fileOrDir of dirArray) {

        const fp = path.join(dirpath, fileOrDir);



        if (fs.statSync(fp).isDirectory()) {
            console.log(fs.statSync(fp).isDirectory());
            console.log(fileOrDir);
            getFileList(fp, callback);
            //ファイルの出力ループを抜けるとここに戻ってくる
            callback(fileOrDir,1);
            //ファイルに到達するとelse節が実行される
        } 
        else {
            if(fileOrDir === dirArray[dirArray.length()-1]){
                callback(fileOrDir,2);
            }
            else{
                callback(fileOrDir);
                        console.log(fileOrDir);
            }

            console.log("dekiteruyo")
        }
    }

}

function concatFileListString(filename, checkDir = 0){
    if(checkDir === 1){
        tag = '<details><summary>' + filename + '</summary>';
        
        tag = tag.concat(bufTag);
        console.log(tag);
        bufTag = "";
    }

    else if(checkDir === 2){
        bufTag += '<li id="item ' + htmlCounter + '" onclick="openfile(' + htmlCounter 
        + ')"  oncontextmenu="fileContextMenu(' + htmlCounter + ')">' + filename + '</li></details>'
    }
    
    else{
        bufTag += '<li id="item ' + htmlCounter + '" onclick="openfile(' + htmlCounter 
        + ')"  oncontextmenu="fileContextMenu(' + htmlCounter + ')">' + filename + '</li>'

    }
    htmlCounter++;
}
