//node ProcessingFromWeb.js --destexcel=WorldCup.csv --destfolder=teams --url="https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results" --source=download.html
let minimist = require("minimist");
let jsdom  = require("jsdom");
let fs = require("fs");
let axios=require("axios");
let path=require("path");
let excel=require("excel4node");
let pdf=require("pdf-lib")

let args = minimist(process.argv);

let dldpromise=axios.get(args.url);

dldpromise.then(function(response1){
    let html=response1.data;

    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;

    let matches=[];
    let matchScoreDivs=document.querySelectorAll("div.match-score-block");
    for(let i=0;i<matchScoreDivs.length;i++){
        let match={}; 
        let desc = document.querySelectorAll("div.match-info>div.description");
        match.description=desc[i].textContent;
        let teams=matchScoreDivs[i].querySelectorAll("p.name");
        match.t1=teams[0].textContent;
        match.t2=teams[1].textContent;
        let scores=matchScoreDivs[i].querySelectorAll("div.score-detail>span.score");
        if(scores.length==2){
            match.score1=scores[0].textContent;
            match.score2=scores[1].textContent;
        }
        else if(scores.length==1){
            match.score1=scores[0].textContent;
            match.score2='';
        }
        else{
            match.score1='';
            match.score2='';
        }
        let res=matchScoreDivs[i].querySelectorAll("div.status-text > span");
        match.result=res[0].textContent;
        matches.push(match);
    }

    let wb=new excel.Workbook();

    let names=['Afghanistan','Australia','Bangladesh','England','India','New Zealand','Pakistan','South Africa','Sri Lanka','West Indies'];

    let sheets=[];

    for(let i=0;i<names.length;i++){
        sheets[i]=wb.addWorksheet(names[i]);
        sheets[i].cell(1,1).string('Match Information');
        sheets[i].cell(1,2).string('Team 1');
        sheets[i].cell(1,3).string('Team 1 Score');
        sheets[i].cell(1,4).string('Team 2');
        sheets[i].cell(1,5).string('Team 2 Score');
        sheets[i].cell(1,6).string('Result');
    }

    let ptr=[0,0,0,0,0,0,0,0,0,0];
    
    for(let i=0;i<matches.length;i++){
        let index=0;
        if(matches[i].t1==names[1]){
            index=1;
        }
        else if(matches[i].t1==names[2]){
            index=2;
        }
        else if(matches[i].t1==names[3]){
            index=3;
        }
        else if(matches[i].t1==names[4]){
            index=4;
        }
        else if(matches[i].t1==names[5]){
            index=5;
        }
        else if(matches[i].t1==names[6]){
            index=6;
        }
        else if(matches[i].t1==names[7]){
            index=7;
        }
        else if(matches[i].t1==names[8]){
            index=8;
        }
        else if(matches[i].t1==names[9]){
            index=9;
        }

        sheets[index].cell(2+ptr[index],1).string(matches[i].description);
        sheets[index].cell(2+ptr[index],2).string(matches[i].t1);
        sheets[index].cell(2+ptr[index],4).string(matches[i].t2);
        sheets[index].cell(2+ptr[index],3).string(matches[i].score1);
        sheets[index].cell(2+ptr[index],5).string(matches[i].score2);
        sheets[index].cell(2+ptr[index],6).string(matches[i].result);
        ptr[index]++;

        index=0;
        if(matches[i].t2==names[1]){
            index=1;
        }
        else if(matches[i].t2==names[2]){
            index=2;
        }
        else if(matches[i].t2==names[3]){
            index=3;
        }
        else if(matches[i].t2==names[4]){
            index=4;
        }
        else if(matches[i].t2==names[5]){
            index=5;
        }
        else if(matches[i].t2==names[6]){
            index=6;
        }
        else if(matches[i].t2==names[7]){
            index=7;
        }
        else if(matches[i].t2==names[8]){
            index=8;
        }
        else if(matches[i].t2==names[9]){
            index=9;
        }
        sheets[index].cell(2+ptr[index],1).string(matches[i].description);
        sheets[index].cell(2+ptr[index],2).string(matches[i].t1);
        sheets[index].cell(2+ptr[index],4).string(matches[i].t2);
        sheets[index].cell(2+ptr[index],3).string(matches[i].score1);
        sheets[index].cell(2+ptr[index],5).string(matches[i].score2);
        sheets[index].cell(2+ptr[index],6).string(matches[i].result);
        ptr[index]++;
    }

    wb.write(args.destexcel);

    let folders=[];

    for(let i=0; i<names.length; i++){
        folders[i]=path.join(args.destfolder,names[i]);
        fs.mkdirSync(folders[i]);
    }

    let ptr1=[1,1,1,1,1,1,1,1,1,1];

    for(let i=0;i<matches.length;i++){
        let index=0;
        if(matches[i].t1==names[1]){
            index=1;
        }
        else if(matches[i].t1==names[2]){
            index=2;
        }
        else if(matches[i].t1==names[3]){
            index=3;
        }
        else if(matches[i].t1==names[4]){
            index=4;
        }
        else if(matches[i].t1==names[5]){
            index=5;
        }
        else if(matches[i].t1==names[6]){
            index=6;
        }
        else if(matches[i].t1==names[7]){
            index=7;
        }
        else if(matches[i].t1==names[8]){
            index=8;
        }
        else if(matches[i].t1==names[9]){
            index=9;
        }

        let matchname=matches[i].t1+" vs "+matches[i].t2;
        if(ptr[index]>9){
            matchname=ptr1[index]+" "+matches[i].t1+" vs "+matches[i].t2;
        }
        let matchFileName=path.join(folders[index],matchname+".pdf");
        createScoreCard(matches,i,matchFileName);
        ptr1[index]++;

        index=0;
        if(matches[i].t2==names[1]){
            index=1;
        }
        else if(matches[i].t2==names[2]){
            index=2;
        }
        else if(matches[i].t2==names[3]){
            index=3;
        }
        else if(matches[i].t2==names[4]){
            index=4;
        }
        else if(matches[i].t2==names[5]){
            index=5;
        }
        else if(matches[i].t2==names[6]){
            index=6;
        }
        else if(matches[i].t2==names[7]){
            index=7;
        }
        else if(matches[i].t2==names[8]){
            index=8;
        }
        else if(matches[i].t2==names[9]){
            index=9;
        }
        
        matchname=matches[i].t2+" vs "+matches[i].t1;
        if(ptr[index]>9){
            matchname=ptr1[index]+" "+matches[i].t2+" vs "+matches[i].t1;
        }
        let matchFileName1=path.join(folders[index],matchname+".pdf");
        createScoreCard(matches,i,matchFileName1);
        ptr1[index]++;
        
    }
    
}).catch(function(err){
    console.log("URL not found");
})

function createScoreCard(matches,index,matchFileName){
    let desc=matches[index].description;
    let team1=matches[index].t1;
    let team2=matches[index].t2;
    let s1=matches[index].score1;
    let s2=matches[index].score2;
    let res=matches[index].result;

    let pdfDocument=pdf.PDFDocument;
    let templateBytes=fs.readFileSync("template1.pdf");
    let promiseToLoadBytes=pdfDocument.load(templateBytes);
    promiseToLoadBytes.then(function(pdfDoc){
        let page=pdfDoc.getPage(0);
        page.drawText(desc,{
            x:165,
            y:665,
            size:13
        });
        page.drawText(team1,{
            x:163,
            y:540,
            size:20
        });
        page.drawText(s1,{
            x:440,
            y:541,
            size:20
        });
        page.drawText(team2,{
            x:163,
            y:445,
            size:20
        });
        
        page.drawText(s2,{
            x:440,
            y:446,
            size:20
        });
        page.drawText(res,{
            x:160,
            y:318,
            size:20
        });
        let promiseToSave=pdfDoc.save();
        promiseToSave.then(function(changedBytes){
            fs.writeFileSync(matchFileName,changedBytes);
        });
    });
}