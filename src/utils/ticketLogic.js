export function createTicketFromUserSelection(userNumbers){
    if(userNumbers.length !== 15){
        throw new Error("Use must pick exactly 15 numbers");
    }

    let grid = Array.from({length : 3},()=> Array(9).fill(null));
    let columns = Array.from({length:9},()=>[]);

    userNumbers.forEach(num=>{
        let col = Math.floor((num-1)/10);
        columns[col].push(num);
    })

    columns.forEach((nums,col)=>{
        if(nums.length>3){
            throw new Error(`Invalid selection : column ${col + 1} has ${nums.length} numbers`)
        }
    })

    let rowCounts = [0,0,0];
    columns.forEach((nums,col)=>{
        nums.sort((a,b)=>a-b);
        nums.forEach(num=>{
            let targetRow = rowCounts.indexOf(Math.min(...rowCounts));
            grid[targetRow][col]=num;
            rowCounts[targetRow]++;
        })
    })

    while (!rowCounts.every(c => c === 5)) {
        let overRow = rowCounts.findIndex(c => c > 5);
        let underRow = rowCounts.findIndex(c => c < 5);
        if (overRow === -1 || underRow === -1) break;
        for (let col = 0; col < 9; col++) {
          if (grid[overRow][col] !== null && grid[underRow][col] === null) {
            grid[underRow][col] = grid[overRow][col];
            grid[overRow][col] = null;
            rowCounts[overRow]--;
            rowCounts[underRow]++;
            break;
          }
        }
      }
    
      if (!rowCounts.every(c => c === 5)) {
        throw new Error(`Still invalid after balancing: row counts ${rowCounts.join(", ")}`);
      }
    
      return grid;
}