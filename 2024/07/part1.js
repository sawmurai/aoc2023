import fs from 'node:fs'

let content = fs.readFileSync("./data.txt", { encoding: "utf-8" });

content = content.split('\n').map(form => {
  const s = form.split(': ');
  return [
    Number(s[0]),
    s[1].split(' ').map(Number)
  ]
});

const permutate = (parts) => {
  const vals = [[parts[0]]]
  for (let i = 1; i < parts.length; i++) {
    const nextSet = []
    //console.log(vals[i-1], vals[i-1].length)

    for (let back = 0; back < vals[i-1].length; back++) {
      // console.log(vals[i-1][back], parts[i])

      nextSet.push(vals[i-1][back] * parts[i])
      nextSet.push(vals[i-1][back] + parts[i])
    }

    vals.push(nextSet)
  }

  // console.log(vals)
  return vals.at(-1);
}

console.log(
  content.filter(row => permutate(row[1]).includes(row[0]))
  .reduce((prev, cur) => prev + cur[0], 0)
)

// console.log(permutate([ 4,744,275,496,888]).includes(2353160400888))