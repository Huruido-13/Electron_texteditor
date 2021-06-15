const { default: WebViewer } = require("@pdftron/webviewer");

const viewerElement = document.getElementById("viewer");

const openFileBtn = document.getElementById("open");
const saveFileBtn = document.getElementById("save");

WebViewer({
    path:'./public', 
},
viewerElement).then(instance => {
    instance.setTheme('dark');
    instance.disableElements(['downloadButton']);

    const { docViewer, annotManager} = instance;

    openFileBtn.onclick = async () => {
        const file = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                {name:"Documents", extensions:["pdf", "docx", "xlsx", "pptx"]},
                {name:"Images", extensions:["png", "jpg"]}
            ]
        });

        if(!file.canceled){
            instance.loadDocument(file.filePaths[0])
            console.log("OK!");
        }
    }

    saveFileBtn.onclick = async () =>{
        const file = await dialog.showOpenDialog({
            properties:['openDirectory'],
            title:"Select File",
            buttonLabel:"Save",
            filters: [
                {name:"PDF",extensions:["pdf"]},
            ]
        });

        if(!file.canceled){
            //ビュワーが現在表示しているドキュメントをリターンする
            const doc = docViewer.getDocument();
            //すべての注釈をXMLSTRINGとして出力する
            const xfdString = await annotManager.exportAnnotations();
            const data = await doc.getFileData({
                xfdString
            });
            //符号なし8ビット整数配列
            const arr = new Uint8Array(data);
            fs.writeFile(
                `${file.filePaths[0].toString()}/anotated.pdf`,
                arr,
                function (err) {
                    if(err){
                        throw err;
                    }
                    console.log('Saved');
                }
            )
        }
    }
});
