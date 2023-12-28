const fs = require('fs');

let readFileAsString=function(fname){
    return fs.readFileSync(__dirname+"/"+fname,{encoding:'utf8',flag:'r'});
};
const input=readFileAsString("input.txt");

let day24bNoExternal=function(input){
    let lines=input.split('\n').map(l=>l.trim()).filter(l=>l.length>0);
    let parseTriple=function(trip){
        return trip.split(",").map(x=>(+x.trim()));
    };
    let parseLine=function(line){
        let args=line.split("@");
        return [parseTriple(args[0]),parseTriple(args[1])];
    };
    let parsed=lines.map(parseLine);

    //particle at solution sx,sy,sz, velocity svx,svy,svz
    //equations are:
    //sx+svx*t[i]==x[i]+vx[i]*t[i] ...same for y,z.
    //sy+svy*t[i]==y[i]+vy[i]*t[i]
    //sz+svz*t[i]==z[i]+vz[i]*t[i]
    //Ok, let's assume svx,svy,svz are fixed and linear solve on that...

    //sx+(svx-vx[0])*t[0]==x[0]
    //sy+(svy-vy[0])*t[0]==y[0]
    //sz+(svz-vz[0])*t[0]==z[0]
    //
    //sx+(svx-vx[1])*t[1]==x[1]
    //sy+(svy-vy[1])*t[1]==y[1]
    //Matrix looks like:
    //[1 0 0 svx-vx[0]     0    ][ sx ]   [x[0]]
    //[0 1 0 svy-vy[0]     0    ][ sy ]   [y[0]]
    //[0 0 1 svz-vz[0]     0    ][ sz ] = [z[0]]
    //[1 0 0    0      svx-vx[1]][t[0]]   [x[1]]
    //[0 1 0    0      svy-vy[1]][t[1]]   [y[1]]
    // the matrix has determinant (svx-vx[1])*(svy-vy[0])-(svx-vx[0])*(svy-vy[1])
    // mvx1 mvy0 - mvx0 mvy1
    let linearSolve=function(n,m,svx,svy,svz){
        let x0=parsed[n][0][0];
        let y0=parsed[n][0][1];
        let z0=parsed[n][0][2];
        let x1=parsed[m][0][0];
        let y1=parsed[m][0][1];
        let x0v=parsed[n][1][0];
        let y0v=parsed[n][1][1];
        let z0v=parsed[n][1][2];
        let x1v=parsed[m][1][0];
        let y1v=parsed[m][1][1];
        let mvx0=svx-parsed[n][1][0];
        let mvy0=svy-parsed[n][1][1];
        let mvz0=svz-parsed[n][1][2];
        let mvx1=svx-parsed[m][1][0];
        let mvy1=svy-parsed[m][1][1];
        let det=mvx1*mvy0-mvx0*mvy1;
        if(det!=0){
            return [(mvx1*mvy0*x0-mvx0*mvy1*x1+mvx0*mvx1*(-y0 + y1))/det,
                (mvy0*mvy1*(x0 - x1) - mvx0*mvy1*y0 + mvx1*mvy0*y1)/det,
                (mvy1*mvz0*(x0 - x1) + mvx1*mvz0*(-y0 + y1))/det + z0,
                (mvy1*(-x0 + x1) + mvx1*(y0 - y1))/det,
                (mvy0*(-x0 + x1) + mvx0*(y0 - y1))/det];
        }
        return undefined;
    };
    //error function
    let ef=function(svx,svy,svz){
        let nums1=linearSolve(0,1,svx,svy,svz);
        let nums2=linearSolve(2,1,svx,svy,svz);
        if(!nums1||!nums2)
            return undefined;
        let dsx=nums1[0]-nums2[0];
        let dsy=nums1[1]-nums2[1];
        let dsz=nums1[2]-nums2[2];
        let dt=nums1[4]-nums2[4];
        return dsx+dsy+dsz+dt;
    };
    let xm=0,ym=0,zm=0;
    let minimumfound=undefined;
    //Let's search in progressively larger shells around the origin.
    //This is just boring ctrl-c ctrl-v code for the six faces of a cube.
    //x,y,z are the velocities of the line, I guess I should have named them svx,svy,svz.
    for(let r=1;r<400;r++){
        for(let x=-r;x<r+1;x++){
            for(let y=-r;y<r+1;y++){
                for(let z=-r;z<r+1;z+=2*r){
                    let e=ef(x,y,z);
                    if(!isNaN(e)){
                        if(minimumfound==undefined){
                            xm=x; ym=y;zm=z; minimumfound=Math.abs(e);
                        } else if(Math.abs(e)<minimumfound) {
                            xm=x; ym=y;zm=z; minimumfound=Math.abs(e);
                        }
                    }
                }
            }
        }
        for(let x=-r;x<r+1;x++){
            for(let y=-r;y<r+1;y+=2*r){
                for(let z=-r;z<r+1;z+=1){
                    let e=ef(x,y,z);
                    if(!isNaN(e)){
                        if(minimumfound==undefined){
                            xm=x; ym=y;zm=z; minimumfound=Math.abs(e);
                        } else if(Math.abs(e)<minimumfound) {
                            xm=x; ym=y;zm=z; minimumfound=Math.abs(e);
                        }
                    }
                }
            }
        }
        for(let x=-r;x<r+1;x+=2*r){
            for(let y=-r;y<r+1;y++){
                for(let z=-r;z<r+1;z++){
                    let e=ef(x,y,z);
                    if(!isNaN(e)){
                        if(minimumfound==undefined){
                            xm=x; ym=y;zm=z; minimumfound=Math.abs(e);
                        } else if(Math.abs(e)<minimumfound) {
                            xm=x; ym=y;zm=z; minimumfound=Math.abs(e);
                        }
                    }
                }
            }
        }
        if(minimumfound<1)
            break;
    }
    let nums1=linearSolve(0,1,xm,ym,zm);
    console.log(nums1[0]+nums1[1]+nums1[2]);
};
day24bNoExternal(input);
