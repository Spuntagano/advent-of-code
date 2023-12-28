const { exec } = require('child_process');

const YEAR = 2023
const FROM = 1
const TO = 25

const PART1_FILENAME = 'part1.js'
const PART2_FILENAME = 'part2.js'

for (let i = FROM; i <= TO; i++) {
  exec(`node ${YEAR}/${i.toString().padStart(2, '0')}/${PART1_FILENAME}`, (err, stdout) => {
    if (!err) {
      console.log(`Day ${i} Part 1: ${stdout}`)
    } else {
      console.log(`Day ${i} Part 1: ERROR: ${err}`)
    }
  });

  exec(`node ${YEAR}/${i.toString().padStart(2, '0')}/${PART2_FILENAME}`, (err, stdout) => {
    if (!err) {
      console.log(`Day ${i} Part 2: ${stdout}`)
    } else {
      console.log(`Day ${i} Part 2: ERROR: ${err}`)
    }
  });
}
